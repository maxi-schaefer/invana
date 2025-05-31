package dev.max.invana.controllers;

import dev.max.invana.dtos.AgentAcceptDto;
import dev.max.invana.dtos.AgentRegistrationDto;
import dev.max.invana.entities.Agent;
import dev.max.invana.enums.AgentStatus;
import dev.max.invana.repositories.AgentRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/agents")
@AllArgsConstructor
public class AgentController {

    private final AgentRepository agentRepository;

    @Transactional
    @PostMapping("/{id}/deny")
    public void denyAgent(@PathVariable String id) {
        agentRepository.deleteById(id);
    }

    @PostMapping("/{id}/accept")
    public Agent acceptAgent(@PathVariable String id, @RequestBody AgentAcceptDto body) {
        Agent agent = agentRepository.findById(id).orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setName(body.getName());
        agent.setEnvironment(body.getEnvironment());
        agent.setStatus(AgentStatus.CONNECTED);
        agent.setLastSeen(LocalDateTime.now());
        return agentRepository.save(agent);
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
