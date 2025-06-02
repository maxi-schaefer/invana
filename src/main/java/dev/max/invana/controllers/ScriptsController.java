package dev.max.invana.controllers;

import dev.max.invana.components.ScriptService;
import dev.max.invana.model.Script;
import dev.max.invana.model.ScriptCategories;
import dev.max.invana.sockets.ScriptWebSocketHandler;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/scripts")
@AllArgsConstructor
public class ScriptsController {

    private final ScriptService scriptService;
    private final ScriptWebSocketHandler socketHandler;

    @GetMapping
    public ScriptCategories getScripts() {
        return scriptService.getScripts();
    }

    @PostMapping
    public ResponseEntity<String> addScript(@RequestBody Script newScript) {
        try {
            scriptService.addScriptToCategory(newScript);
            socketHandler.notifyUpdate(scriptService.getScripts());

            return ResponseEntity.ok("Script added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid category");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save script");
        }
    }

}
