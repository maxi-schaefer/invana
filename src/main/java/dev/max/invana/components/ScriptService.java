package dev.max.invana.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.model.Script;
import dev.max.invana.model.ScriptCategories;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@Getter
@RequiredArgsConstructor
public class ScriptService {

    private ScriptCategories cached;
    private final ObjectMapper obj;
    private final Path jsonPath = Paths.get("./scripts.json"); // For development, production use maybe /opt/invana

    @PostConstruct
    public void init() {
        reload();
    }

    public void reload() {
        try {
            cached = obj.readValue(Files.newInputStream(jsonPath), ScriptCategories.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to reload scripts.json", e);
        }
    }

    public ScriptCategories getScripts() {
        try {
            return cached = obj.readValue(Files.newInputStream(jsonPath), ScriptCategories.class);
        } catch (IOException e) {
            throw new RuntimeException("Error whilst reading " + jsonPath);
        }
    }

    public synchronized void addScriptToCategory(Script script) throws IOException {
        cached.getCustoms().add(script);

        try(Writer writer = Files.newBufferedWriter(jsonPath)) {
            obj.writerWithDefaultPrettyPrinter().writeValue(writer, cached);
        }
    }

}
