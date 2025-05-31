package dev.max.invana.dtos;

import dev.max.invana.enums.AgentMessageType;
import lombok.Data;

@Data
public class AgentWebSocketMessage {
    private AgentMessageType type;
    private Object payload;
}
