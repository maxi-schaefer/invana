package dev.max.invana.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.max.invana.model.ScriptCategories;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
@Getter
public class ScriptService {

    private final ScriptCategories scriptCategories;

    public ScriptService() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        InputStream is = getClass().getClassLoader().getResourceAsStream("scripts.json");
        scriptCategories = objectMapper.readValue(is, ScriptCategories.class);
    }

}
