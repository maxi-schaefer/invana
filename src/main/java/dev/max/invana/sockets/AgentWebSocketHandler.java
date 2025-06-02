    package dev.max.invana.sockets;
    
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.node.ObjectNode;
    import dev.max.invana.components.ScriptService;
    import dev.max.invana.dtos.AgentRegistrationDto;
    import dev.max.invana.dtos.AgentWebSocketMessage;
    import dev.max.invana.entities.Agent;
    import dev.max.invana.enums.AgentStatus;
    import dev.max.invana.model.ScriptCategories;
    import dev.max.invana.repositories.AgentRepository;
    import dev.max.invana.services.AgentSettingsService;
    import dev.max.invana.services.FrontendNotificationService;
    import lombok.AllArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Component;
    import org.springframework.web.socket.*;
    import org.springframework.web.socket.handler.TextWebSocketHandler;
    
    import java.io.IOException;
    import java.time.LocalDateTime;
    import java.util.*;
    
    @Component
    @AllArgsConstructor
    @Slf4j
    public class AgentWebSocketHandler extends TextWebSocketHandler {
    
        private AgentRepository agentRepository;
        private AgentSettingsService agentSettingsService;
        private FrontendNotificationService frontendNotificationService;
        private ScriptWebSocketHandler scriptWebSocketHandler;

        private final ScriptService scriptService;
        private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
        private final Map<String, String> sessionToAgentId = new HashMap<>();
        private final ObjectMapper objectMapper = new ObjectMapper();
    
        @Override
        public void afterConnectionEstablished(WebSocketSession session) throws Exception {
            sessions.add(session);
        }
    
        @Override
        public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
            Optional<Agent> agent = agentRepository.findById(sessionToAgentId.get(session.getId()));
    
            if(agent.isPresent()) {
                if(agent.get().getStatus() == AgentStatus.PENDING) return;
                agent.get().setStatus(AgentStatus.DISCONNECTED);
                Agent saved = agentRepository.save(agent.get());
                frontendNotificationService.sendAgentUpdate(saved);
            }
    
            sessionToAgentId.remove(session.getId());
            sessions.remove(session);
    
            log.info("Agent disconnected: " + session.getId());
        }
    
        @Override
        protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
            AgentWebSocketMessage msg = objectMapper.readValue(message.getPayload(), AgentWebSocketMessage.class);
    
            switch(msg.getType()) {
                case REGISTER -> handleRegister(session, msg.getPayload());
                case HEARTBEAT -> handleHeartbeat(session, msg.getPayload());
            }
        }
    
        public void broadcastConfig(String json) {
            synchronized (sessions) {
                for(WebSocketSession session : sessions) {
                    try {
                        Optional<Agent> agent = agentRepository.findById(sessionToAgentId.get(session.getId()));
    
                        if(agent.isPresent() && agent.get().getStatus() != AgentStatus.PENDING) {
                            if(session.isOpen()) {
                                session.sendMessage(new TextMessage(json));
                                log.info("Sent config to: " + session.getRemoteAddress());
                            }
                        }
                    } catch (Exception e) {
                        log.error("Error sending config to " + session.getRemoteAddress());
                        e.printStackTrace();
                    }
                }
            }
        }

        public void sendToAgent(Agent agent, String json) {
            synchronized (sessions) {
                for(WebSocketSession session : sessions) {
                    try {
                        if(sessionToAgentId.get(session.getId()).equals(agent.getId())) {
                            if(session.isOpen()) {
                                session.sendMessage(new TextMessage(json));
                                log.info("Sending scripts to: " + agent.getId());
                            }
                        }
                    } catch (Exception e) {
                        log.error("Error sending scripts to " + session.getRemoteAddress());
                        e.printStackTrace();
                    }
                }
            }
        }
    
        public void sendDenialToAgent(String agentId) {
            synchronized (sessions) {
                for(WebSocketSession session : sessions) {
                    String mappedAgentId = sessionToAgentId.get(session.getId());
                    if(agentId.equals(mappedAgentId)) {
                        try {
                            if(session.isOpen()) {
                                session.sendMessage(new TextMessage("DENIED"));
                                log.info("Sent denial to agent: " + agentId);
                            }
                        } catch (Exception e) {
                            log.error("Error sending denial to agent " + agentId);
                            e.printStackTrace();
                        }
                        break;
                    }
                }
            }
        }
    
        private void handleRegister(WebSocketSession session, Object payload) throws IOException {
            AgentRegistrationDto req = objectMapper.convertValue(payload, AgentRegistrationDto.class);
    
            Agent agent = new Agent();
            agent.setName(req.getName());
            agent.setHostname(req.getHostname());
            agent.setIp(req.getIp());
            agent.setEnvironment(req.getEnvironment());
            agent.setOs(req.getOs());
            agent.setServices(req.getServices());
            agent.setVersion(req.getVersion());
            agent.setStatus(AgentStatus.PENDING);
            agent.setLastSeen(LocalDateTime.now());
    
            Agent saved = agentRepository.save(agent);
            frontendNotificationService.sendAgentUpdate(saved);
            sessionToAgentId.put(session.getId(), saved.getId());

            session.sendMessage(new TextMessage("REGISTERED: " + saved.getId()));

            ScriptCategories scripts = scriptService.getScripts();

            ObjectNode root = objectMapper.createObjectNode();
            root.put("change", "script");
            root.set("payload", objectMapper.valueToTree(scripts));

            String json = objectMapper.writeValueAsString(root);
            sendToAgent(agent, json);
        }
    
        private void handleHeartbeat(WebSocketSession session, Object payload) throws IOException {
            // Extract agentId from payload
            Map<String, Object> data = objectMapper.convertValue(payload, Map.class);
            String agentId = (String) data.get("id");
            String agentToken = (String) data.get("token");
            String exceptedToken = agentSettingsService.getSettings().getToken();
    
            if (agentId == null || agentToken == null || !agentToken.equals(exceptedToken)) {
                Optional<Agent> agentOpt = agentRepository.findById(agentId);
    
    
                agentOpt.ifPresent(agent -> {
                    agent.setStatus(agent.getStatus() != AgentStatus.PENDING ? AgentStatus.UNAUTHENTICATED : AgentStatus.PENDING);
                    sessionToAgentId.put(session.getId(), agentId);
                    agentRepository.save(agent);
    
                    frontendNotificationService.sendAgentUpdate(agent);
                });
    
                session.sendMessage(new TextMessage("AUTH_DENIED"));
                return;
            }
    
            Optional<Agent> agentOpt = agentRepository.findById(agentId);

            if (agentOpt.isPresent()) {
                Agent agent = agentOpt.get();
    
                if(agent.getStatus() != AgentStatus.PENDING) {
    
                    if(!sessionToAgentId.containsKey(session.getId())) {
                        frontendNotificationService.sendAgentReconnected(agent);
                    }
    
                    sessionToAgentId.putIfAbsent(session.getId(), agentId);
                    agent.setLastSeen(LocalDateTime.now());
                    agent.setStatus(AgentStatus.CONNECTED);
                    agentRepository.save(agent);
    
                    session.sendMessage(new TextMessage("HEARTBEAT_ACK"));
                } else {
                    session.sendMessage(new TextMessage("HEARTBEAT_DENY"));
                }
    
                frontendNotificationService.sendAgentUpdate(agent);
            } else {
                session.sendMessage(new TextMessage("AUTH_DENIED"));
            }
        }
    
        public List<Agent> getRegisteredAgents() {
            return agentRepository.findAll().stream().filter(a -> a.getStatus() != AgentStatus.PENDING).toList();
        }
    
        private boolean isAuthenticated(String providedToken) {
            String expected = agentSettingsService.getSettings().getToken();
            return expected != null && expected.equals(providedToken);
        }
    
        public void sendConfigToAgent(String agentId, String configJson) {
            synchronized (sessions) {
                for(WebSocketSession session : sessions) {
                    String mappedAgentId = sessionToAgentId.get(session.getId());
                    if (agentId.equals(mappedAgentId)) {
                        try {
                            if(session.isOpen()) {
                                session.sendMessage(new TextMessage(configJson));
                                log.info("Sent config to accepted agent: " + agentId);
                            }
                        } catch (Exception e) {
                            log.error("Error sending config to agent " + agentId);
                            e.printStackTrace();
                        }
                        break;
                    }
                }
            }
        }
    }
