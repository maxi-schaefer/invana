package dev.max.invana.repositories;

import dev.max.invana.entities.AgentSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgentSettingsRepository extends JpaRepository<AgentSettings, Long> {
    Optional<AgentSettings> findFirstByOrderByIdAsc();
}
