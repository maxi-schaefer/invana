package dev.max.invana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.sockets.AgentWebSocketHandler;
import dev.max.invana.dtos.AgentAcceptDto;
import dev.max.invana.entities.Agent;
import dev.max.invana.enums.AgentStatus;
import dev.max.invana.repositories.AgentRepository;
import dev.max.invana.services.AgentSettingsService;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/agents")
@AllArgsConstructor
public class AgentController {

    private final AgentRepository agentRepository;
    private final AgentSettingsService settingsService;
    private final AgentWebSocketHandler socketHandler;
    private final ObjectMapper objectMapper;

    @Transactional
    @PostMapping("/{id}/deny")
    public void denyAgent(@PathVariable String id) {
        socketHandler.sendDenialToAgent(id);
        agentRepository.deleteById(id);
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

}
