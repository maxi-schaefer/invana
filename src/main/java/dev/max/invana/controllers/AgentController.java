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

    @PostMapping("/register")
    public Agent registerAgent(@RequestBody AgentRegistrationDto req) {
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

        return agentRepository.save(agent);
    }

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

    @PostMapping("/heartbeat")
    public Agent heartbeat(@RequestBody Map<String, String> body) {
        String ip = body.get("ip");

        Agent agent = agentRepository.findAll()
                .stream()
                .filter(a -> a.getIp().equalsIgnoreCase(ip) && a.getStatus() != AgentStatus.PENDING)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Agent not registered or pending"));

        agent.setLastSeen(LocalDateTime.now());
        agent.setStatus(AgentStatus.CONNECTED);

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
