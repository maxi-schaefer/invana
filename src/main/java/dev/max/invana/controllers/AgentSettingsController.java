package dev.max.invana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.components.AgentWebSocketHandler;
import dev.max.invana.entities.AgentSettings;
import dev.max.invana.services.AgentSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class AgentSettingsController {

    @Autowired
    private AgentSettingsService service;

    @Autowired
    private AgentWebSocketHandler socketHandler;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<AgentSettings> updateSettings(@RequestBody AgentSettings settings) {
        AgentSettings updated = service.saveSettings(settings);

        try {
            String json = objectMapper.writeValueAsString(updated);
            socketHandler.broadcastConfig(json);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("saving config: " + updated);

        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public AgentSettings get() {
        return service.getSettings();
    }

}
