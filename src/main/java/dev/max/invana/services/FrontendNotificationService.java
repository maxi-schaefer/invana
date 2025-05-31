package dev.max.invana.services;

import dev.max.invana.entities.Agent;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FrontendNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendAgentUpdate(Agent agent) {
        messagingTemplate.convertAndSend("/topic/agent-updates", agent);
    }

}
