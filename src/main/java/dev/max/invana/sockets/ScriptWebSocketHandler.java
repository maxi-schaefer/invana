package dev.max.invana.sockets;

import dev.max.invana.model.Script;
import dev.max.invana.model.ScriptCategories;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ScriptWebSocketHandler {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public void notifyUpdate(ScriptCategories scripts) {
        simpMessagingTemplate.convertAndSend("/topic/script-updates", scripts);
    }

}
