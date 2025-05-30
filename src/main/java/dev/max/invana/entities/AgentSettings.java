package dev.max.invana.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class AgentSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private boolean tlsRequired;
    private int collectionInterval;
    private int retryAttempts;
    private int timeout;
    private boolean detailedLogging;
    private String serverUrl;
    private int serverPort;

    @Lob
    private String customHeadersJson;

}
