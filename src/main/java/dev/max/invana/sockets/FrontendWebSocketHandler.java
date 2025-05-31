package dev.max.invana.sockets;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Collections;
import java.util.Set;

@Controller
public class FrontendWebSocketHandler {

    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    public String handlePing(String message) {
        return "PONG: " + message;
    }

}
