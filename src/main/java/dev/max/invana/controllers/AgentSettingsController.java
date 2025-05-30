package dev.max.invana.controllers;

import dev.max.invana.entities.AgentSettings;
import dev.max.invana.services.AgentSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class AgentSettingsController {

    @Autowired
    private AgentSettingsService service;

    @PostMapping
    public ResponseEntity<AgentSettings> save(@RequestBody AgentSettings settings) {
        AgentSettings updated = service.saveSettings(settings);

        // TODO: write settings to the agent
        System.out.println("saving config: " + updated);

        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public AgentSettings get() {
        return service.getSettings();
    }

}
