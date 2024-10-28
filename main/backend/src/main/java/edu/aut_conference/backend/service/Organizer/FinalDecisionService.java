package edu.aut_conference.backend.service.Organizer;

import edu.aut_conference.backend.model.Shared.FinalDecision;
import edu.aut_conference.backend.repository.Organizer.FinalDecisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FinalDecisionService {

    @Autowired
    private FinalDecisionRepository finalDecisionRepository;

    public FinalDecision saveFinalDecision(FinalDecision finalDecision) {
        return finalDecisionRepository.save(finalDecision);
    }

    public Optional<FinalDecision> getFinalDecisionById(Long id) {
        return finalDecisionRepository.findById(id);
    }

    public List<FinalDecision> getFinalDecisionsBySubmissionId(Long submissionId) {
        return finalDecisionRepository.findBySubmissionId(submissionId);
    }
}
