package edu.aut_conference.backend.controller.Organizer;

import edu.aut_conference.backend.model.Shared.FinalDecision;
import edu.aut_conference.backend.service.Author.SubmissionService;
import edu.aut_conference.backend.service.Organizer.FinalDecisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/final-decisions")
public class FinalDecisionController {

    @Autowired
    private FinalDecisionService finalDecisionService;

    @Autowired
    private SubmissionService submissionService;

    // 增加新的 FinalDecision
    @PostMapping
public ResponseEntity<FinalDecision> addFinalDecision(@RequestBody FinalDecision finalDecision) {
    try {
        finalDecision.setCommentTime(LocalDateTime.now());
        FinalDecision savedDecision = finalDecisionService.saveFinalDecision(finalDecision);

        // Update the status of the related submission to 'completed'
        if ("Accept".equals(finalDecision.getDecision()) || "Reject".equals(finalDecision.getDecision())) {
            submissionService.updateSubmissionStatus(finalDecision.getSubmissionId(), "completed");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedDecision);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}


    // 根据 submissionId 获取 FinalDecision 列表
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<FinalDecision>> getFinalDecisionsBySubmissionId(@PathVariable Long submissionId) {
        List<FinalDecision> finalDecisions = finalDecisionService.getFinalDecisionsBySubmissionId(submissionId);
        if (finalDecisions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(finalDecisions);
    }

    // 根据决策 ID 获取单个 FinalDecision
    @GetMapping("/{id}")
    public ResponseEntity<FinalDecision> getFinalDecisionById(@PathVariable Long id) {
        Optional<FinalDecision> finalDecision = finalDecisionService.getFinalDecisionById(id);
        if (finalDecision.isPresent()) {
            return ResponseEntity.ok(finalDecision.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}