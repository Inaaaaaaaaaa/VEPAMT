package com.example.demo.controller;

import com.example.demo.entity.Conference;
import com.example.demo.repository.ConferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conferences")
public class ConferenceController {

    @Autowired
    private ConferenceRepository conferenceRepository;

    // Get all conferences
    @GetMapping
    public List<Conference> getAllConferences() {
        return conferenceRepository.findAll();
    }

    // Get a single conference by ID
    @GetMapping("/{id}")
    public ResponseEntity<Conference> getConferenceById(@PathVariable Integer id) {
        return conferenceRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new conference
    @PostMapping
    public Conference createConference(@RequestBody Conference conference) {
        return conferenceRepository.save(conference);
    }

    // Update an existing conference
    @PutMapping("/{id}")
    public ResponseEntity<Conference> updateConference(@PathVariable Integer id, @RequestBody Conference conferenceDetails) {
        return conferenceRepository.findById(id)
            .map(conference -> {
                conference.setMeetingName(conferenceDetails.getMeetingName());
                conference.setTime(conferenceDetails.getTime());
                conference.setDetails(conferenceDetails.getDetails());
                conference.setDate(conferenceDetails.getDate());
                conference.setStatus(conferenceDetails.getStatus());
                conference.setParticipants(conferenceDetails.getParticipants());
                conference.setFiles(conferenceDetails.getFiles());
                Conference updatedConference = conferenceRepository.save(conference);
                return ResponseEntity.ok(updatedConference);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a conference by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(@PathVariable Integer id) {
        if (conferenceRepository.existsById(id)) {
            conferenceRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // Returns ResponseEntity<Void>
        } else {
            return ResponseEntity.notFound().build(); // Returns ResponseEntity<Void>
        }
    }
}
