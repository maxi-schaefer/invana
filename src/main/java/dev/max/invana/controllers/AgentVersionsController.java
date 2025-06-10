package dev.max.invana.controllers;

import dev.max.invana.entities.AgentVersionHistory;
import dev.max.invana.services.AgentVersionsService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/versions")
@AllArgsConstructor
public class AgentVersionsController {

    private final AgentVersionsService agentVersionService;

    @GetMapping
    public List<AgentVersionHistory> getAll() {
        return agentVersionService.getAllChanges();
    }

    @GetMapping("/{agentId}")
    public List<AgentVersionHistory> getByAgent(@PathVariable String agentId) {
        return agentVersionService.getChangesForAgent(agentId);
    }

}
