package dev.max.invana.configs;

import dev.max.invana.sockets.AgentWebSocketHandler;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@AllArgsConstructor
public class AgentWebSocketConfig implements WebSocketConfigurer {

    private final AgentWebSocketHandler handler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/agent").setAllowedOrigins("*");
    }
}
