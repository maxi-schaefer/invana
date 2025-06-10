package dev.max.invana.services;

import dev.max.invana.entities.Agent;
import dev.max.invana.entities.AgentVersionHistory;
import dev.max.invana.repositories.AgentRepository;
import dev.max.invana.repositories.AgentVersionHistoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AgentVersionsService {

    private final AgentVersionHistoryRepository historyRepository;

    public void saveVersionChange(Agent agent, String service, String prev, String current, String change, String status) {
        AgentVersionHistory entry = new AgentVersionHistory();
        entry.setAgent(agent);
        entry.setService(service);
        entry.setPreviousVersion(prev);
        entry.setCurrentVersion(current);
        entry.setChangeType(change);
        entry.setStatus(status);
        historyRepository.save(entry);
    }

    public List<AgentVersionHistory> getAllChanges() {
        return historyRepository.findAll();
    }

    public List<AgentVersionHistory> getChangesForAgent(String agentId) {
        return historyRepository.findByAgentId(agentId);
    }

}
