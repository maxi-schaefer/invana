package dev.max.invana.entities;

import dev.max.invana.enums.AgentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String hostname;
    private String ip;
    private String environment;
    private String os;
    private String version;
    private int services;

    @Enumerated(EnumType.STRING)
    private AgentStatus status;

    private LocalDateTime lastSeen;


}
