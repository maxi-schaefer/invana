package dev.max.invana.controllers;

import dev.max.invana.components.ScriptService;
import dev.max.invana.model.ScriptCategories;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scripts")
@AllArgsConstructor
public class ScriptsController {

    private final ScriptService scriptService;

    @GetMapping
    public ScriptCategories getScripts() {
        return scriptService.getScriptCategories();
    }

}
