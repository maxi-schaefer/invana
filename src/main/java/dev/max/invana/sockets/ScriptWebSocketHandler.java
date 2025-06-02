package dev.max.invana.sockets;

import dev.max.invana.model.Script;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ScriptWebSocketHandler {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public void notifyUpdate(Script script) {
        simpMessagingTemplate.convertAndSend("/topci/script-updates", script);
    }

}
