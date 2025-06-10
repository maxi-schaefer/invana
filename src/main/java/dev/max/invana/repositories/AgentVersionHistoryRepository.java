package dev.max.invana.repositories;

import dev.max.invana.entities.AgentVersionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgentVersionHistoryRepository extends JpaRepository<AgentVersionHistory, String> {
    List<AgentVersionHistory> findByAgentId(String agentId);
    Optional<AgentVersionHistory> findTopByAgentIdAndServiceOrderByTimestampDesc(String agentId, String service);
}
