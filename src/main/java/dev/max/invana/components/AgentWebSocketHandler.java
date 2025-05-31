package dev.max.invana.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.dtos.AgentRegistrationDto;
import dev.max.invana.dtos.AgentWebSocketMessage;
import dev.max.invana.entities.Agent;
import dev.max.invana.enums.AgentStatus;
import dev.max.invana.repositories.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class AgentWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private AgentRepository agentRepository;

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
            agent.get().setStatus(AgentStatus.DISCONNECTED);
            agentRepository.save(agent.get());
        }

        sessions.remove(session);
        sessionToAgentId.remove(session.getId());

        System.out.println("Agent disconnected: " + session.getId());
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
                            System.out.println("Sent config to: " + session.getRemoteAddress());
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error sending config to " + session.getRemoteAddress());
                    e.printStackTrace();
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
        sessionToAgentId.put(session.getId(), saved.getId());

        session.sendMessage(new TextMessage("REGISTERED: " + saved.getId()));
    }

    private void handleHeartbeat(WebSocketSession session, Object payload) throws IOException {
        // Extract agentId from payload
        Map<String, Object> data = objectMapper.convertValue(payload, Map.class);
        String agentId = (String) data.get("id");

        if (agentId == null) {
            session.sendMessage(new TextMessage("HEARTBEAT_DENY"));
            return;
        }

        Optional<Agent> agentOpt = agentRepository.findById(agentId);

        if (agentOpt.isPresent() && agentOpt.get().getStatus() != AgentStatus.PENDING) {
            if(!sessionToAgentId.containsKey(session.getId())) {
                System.out.println("Agent connected: " + agentId);
                sessionToAgentId.put(session.getId(), agentId);
            }

            Agent agent = agentOpt.get();
            agent.setLastSeen(LocalDateTime.now());
            agent.setStatus(AgentStatus.CONNECTED);
            agentRepository.save(agent);
            session.sendMessage(new TextMessage("HEARTBEAT_ACK"));
        } else {
            session.sendMessage(new TextMessage("HEARTBEAT_DENY"));
        }
    }

    public List<Agent> getRegisteredAgents() {
        return agentRepository.findAll().stream().filter(a -> a.getStatus() != AgentStatus.PENDING).toList();
    }
}
