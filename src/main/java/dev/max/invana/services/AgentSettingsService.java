package dev.max.invana.services;

import dev.max.invana.entities.AgentSettings;
import dev.max.invana.repositories.AgentSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AgentSettingsService {

    // Default settings values from properties
    @Value("${ivana.default.agent.token:default-token}")
    private String defaultToken;

    @Value("${ivana.default.agent.tls:true}")
    private boolean defaultTls;

    @Value("${ivana.default.agent.interval:5}")
    private int defaultInterval;

    @Value("${ivana.default.agent.retries:3}")
    private int defaultRetries;

    @Value("${ivana.default.agent.timeout:30}")
    private int defaultTimeout;

    @Value("${ivana.default.agent.logging:false}")
    private boolean defaultLogging;

    @Value("${ivana.default.server.url:http://localhost}")
    private String defaultServerUrl;

    @Value("${ivana.default.server.port:8080}")
    private int defaultServerPort;

    @Autowired
    private AgentSettingsRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AgentSettings saveSettings(AgentSettings settings) {
        AgentSettings existing = getSettings();

        existing.setToken(settings.getToken());
        existing.setTlsRequired(settings.isTlsRequired());
        existing.setCollectionInterval(settings.getCollectionInterval());
        existing.setRetryAttempts(settings.getRetryAttempts());
        existing.setTimeout(settings.getTimeout());
        existing.setDetailedLogging(settings.isDetailedLogging());
        existing.setServerUrl(settings.getServerUrl());
        existing.setServerPort(settings.getServerPort());

        return repository.save(existing);
    }

    public AgentSettings getSettings() {

        return repository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    AgentSettings defaultSettings = new AgentSettings();
                    defaultSettings.setToken(defaultToken);
                    defaultSettings.setTlsRequired(defaultTls);
                    defaultSettings.setCollectionInterval(defaultInterval);
                    defaultSettings.setRetryAttempts(defaultRetries);
                    defaultSettings.setTimeout(30);
                    defaultSettings.setDetailedLogging(false);
                    defaultSettings.setServerUrl(defaultServerUrl);
                    defaultSettings.setServerPort(8080);
                    return repository.save(defaultSettings);
                });
    }

    public boolean isValidToken(String token) {
        AgentSettings settings = getSettings();
        return settings != null && token.equalsIgnoreCase(settings.getToken());
    }

}
