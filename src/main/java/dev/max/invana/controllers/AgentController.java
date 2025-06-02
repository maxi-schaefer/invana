package dev.max.invana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.dtos.AgentUpdateDto;
import dev.max.invana.entities.User;
import dev.max.invana.services.FrontendNotificationService;
import dev.max.invana.sockets.AgentWebSocketHandler;
import dev.max.invana.dtos.AgentAcceptDto;
import dev.max.invana.entities.Agent;
import dev.max.invana.enums.AgentStatus;
import dev.max.invana.repositories.AgentRepository;
import dev.max.invana.services.AgentSettingsService;
import dev.max.invana.sockets.FrontendWebSocketHandler;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyDescriptor;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/agents")
@AllArgsConstructor
public class AgentController {

    private final AgentRepository agentRepository;
    private final AgentSettingsService settingsService;
    private final AgentWebSocketHandler socketHandler;
    private final FrontendNotificationService frontendNotificationService;
    private final ObjectMapper objectMapper;

    @Transactional
    @PostMapping("/{id}/deny")
    public void denyAgent(@PathVariable String id) {
        socketHandler.sendDenialToAgent(id);
        agentRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void updateAgent(@PathVariable String id, @RequestBody Agent body) {
        Agent agent = agentRepository.findById(id).orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setName(body.getName() != null ? body.getName() : agent.getName());
        agent.setEnvironment(body.getEnvironment() != null ? body.getEnvironment() : agent.getName());

        Agent updated = agentRepository.save(agent);
        frontendNotificationService.sendAgentUpdate(updated);
    }

    @PostMapping("/{id}/accept")
    public Agent acceptAgent(@PathVariable String id, @RequestBody AgentAcceptDto body) {
        Agent agent = agentRepository.findById(id).orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setName(body.getName());
        agent.setEnvironment(body.getEnvironment());
        agent.setStatus(AgentStatus.CONNECTED);
        agent.setLastSeen(LocalDateTime.now());
        Agent updated = agentRepository.save(agent);

        try {
            String configJson = objectMapper.writeValueAsString(settingsService.getSettings());
            socketHandler.sendConfigToAgent(updated.getId(), configJson);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return updated;
    }

    @GetMapping("/pending")
    public List<Agent> getPendingAgents() {
        return agentRepository.findAll().stream().filter(a -> a.getStatus() == AgentStatus.PENDING).toList();
    }

    @GetMapping
    public List<Agent> getAllAgents() {
        return agentRepository.findAll().stream().filter(a -> a.getStatus() != AgentStatus.PENDING).toList();
    }

    private String[] getNullPropertyNames(Agent source) {
        // Use BeanUtils or any utility to get null property names
        return Arrays.stream(BeanUtils.getPropertyDescriptors(Agent.class))
                .filter(pd -> {
                    try {
                        return pd.getReadMethod().invoke(source) == null;
                    } catch (Exception e) {
                        return false;
                    }
                })
                .map(PropertyDescriptor::getName)
                .toArray(String[]::new);
    }

}
