package edu.aut_conference.backend.repository.Organizer;

import edu.aut_conference.backend.model.Shared.FinalDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinalDecisionRepository extends JpaRepository<FinalDecision, Long> {
    // 根据 submissionId 查找 FinalDecision
    List<FinalDecision> findBySubmissionId(Long submissionId);
}
