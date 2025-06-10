package dev.max.invana.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AgentVersionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;

    private String service;
    private String previousVersion;
    private String currentVersion;
    private String changeType; // "major", "minor", "patch", "downgrade"
    private String status; // "updated", "detected", "rollback"
    private LocalDateTime timestamp = LocalDateTime.now();

}
