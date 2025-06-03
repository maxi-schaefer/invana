package dev.max.invana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dev.max.invana.components.ScriptService;
import dev.max.invana.entities.Agent;
import dev.max.invana.enums.AgentStatus;
import dev.max.invana.model.Script;
import dev.max.invana.model.ScriptCategories;
import dev.max.invana.repositories.AgentRepository;
import dev.max.invana.sockets.AgentWebSocketHandler;
import dev.max.invana.sockets.ScriptWebSocketHandler;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/scripts")
@AllArgsConstructor
public class ScriptsController {

    private final ScriptService scriptService;
    private final ScriptWebSocketHandler socketHandler;
    private final AgentWebSocketHandler agentWebSocketHandler;
    private final AgentRepository agentRepository;
    private final ObjectMapper mapper;

    @GetMapping
    public ScriptCategories getScripts() {
        return scriptService.getScripts();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/customs/{id}")
    public ResponseEntity<String> deleteCustomScript(@PathVariable String id) {
        try {
            boolean deleted = scriptService.deleteCustomScriptById(id);
            if(!deleted) {
                return ResponseEntity.status(404).body("Script not found or not a custom script");
            }

            socketHandler.notifyUpdate(scriptService.getScripts());

            List<Agent> agents = agentRepository.findAll().stream().filter(a -> a.getStatus() != AgentStatus.PENDING).toList();
            for(Agent agent : agents) {
                ScriptCategories scripts = scriptService.getScripts();

                ObjectNode root = mapper.createObjectNode();
                root.put("change", "script");
                root.set("payload", mapper.valueToTree(scripts));

                String json = mapper.writeValueAsString(root);
                agentWebSocketHandler.sendToAgent(agent, json);
            }

            return ResponseEntity.ok("Custom script deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to delete custom script");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<String> addScript(@RequestBody Script newScript) {
        try {
            if(newScript.getId() == null || newScript.getId().isEmpty()) {
                newScript.setId(UUID.randomUUID().toString());
            }

            scriptService.addScriptToCategory(newScript);
            socketHandler.notifyUpdate(scriptService.getScripts());

            List<Agent> agents = agentRepository.findAll().stream().filter(a -> a.getStatus() != AgentStatus.PENDING).toList();
            for(Agent agent : agents) {
                ScriptCategories scripts = scriptService.getScripts();

                ObjectNode root = mapper.createObjectNode();
                root.put("change", "script");
                root.set("payload", mapper.valueToTree(scripts));

                String json = mapper.writeValueAsString(root);
                agentWebSocketHandler.sendToAgent(agent, json);
            }


            return ResponseEntity.ok("Script added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid category");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save script");
        }
    }

}
