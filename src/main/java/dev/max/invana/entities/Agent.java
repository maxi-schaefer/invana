package dev.max.invana.entities;

import dev.max.invana.enums.AgentStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

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

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt; 

    private LocalDateTime lastSeen;


}
