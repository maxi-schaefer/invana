package dev.max.invana.response;

import dev.max.invana.entities.AgentSettings;
import lombok.Data;

@Data
public class SaveAgentSettingsResponse {

    private AgentSettings agentSettings;
    private String message;

}
