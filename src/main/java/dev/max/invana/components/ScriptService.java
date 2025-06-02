package dev.max.invana.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.model.ScriptCategories;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@Getter
@AllArgsConstructor
public class ScriptService {

    private final ObjectMapper obj;
    private final Path jsonPath = Paths.get("./scripts.json"); // For development, production use maybe /opt/invana

    public ScriptCategories getScripts() {
        try {
            return obj.readValue(Files.newInputStream(jsonPath), ScriptCategories.class);
        } catch (IOException e) {
            throw new RuntimeException("Error whilst reading " + jsonPath);
        }
    }

}
