package dev.max.invana.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.sockets.AgentWebSocketHandler;
import dev.max.invana.entities.AgentSettings;
import dev.max.invana.response.SaveAgentSettingsResponse;
import dev.max.invana.services.AgentSettingsService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@Slf4j
@AllArgsConstructor
public class AgentSettingsController {

    private AgentSettingsService service;
    private AgentWebSocketHandler socketHandler;
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> updateSettings(@RequestBody AgentSettings settings) {
        AgentSettings updated = service.saveSettings(settings);

        try {
            String json = objectMapper.writeValueAsString(updated);
            socketHandler.broadcastConfig(json);
        } catch (Exception e) {
            e.printStackTrace();
        }

        log.info("Saving config: " + updated);

        SaveAgentSettingsResponse res = new SaveAgentSettingsResponse();
        res.setAgentSettings(updated);
        res.setMessage("Agent config updated and deployed to " + socketHandler.getRegisteredAgents().size() + " agent" + (socketHandler.getRegisteredAgents().size() > 1 ? "s" : ""));

        return ResponseEntity.ok(res);
    }

    @GetMapping
    public AgentSettings get() {
        return service.getSettings();
    }

}
