package edu.aut_conference.backend.service.Author;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//import edu.aut_conference.backend.repository.Author.ConferenceRepository;
import edu.aut_conference.backend.repository.Author.MessageRepository;
import edu.aut_conference.backend.repository.Author.SubmissionRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    //@Autowired
    //private MessageRepository messageRepository;


    @Autowired
    private SubmissionRepository submissionRepository;

   // @Autowired
    //private ConferenceRepository conferenceRepository;
    @Autowired
    private MessageRepository messageRepository;


    public Map<String, List<?>> search(String entityType, String keyword) {
        Map<String, List<?>> results = new HashMap<>();

        if (entityType == null || entityType.isEmpty()) {
            // 全局搜索所有实体
            List<?> messages = messageRepository.searchByKeyword(keyword);

            List<?> submissions = submissionRepository.searchByKeyword(keyword);
         //   List<?> conferences = conferenceRepository.searchByKeyword(keyword);

            results.put("messages", messages);

            results.put("submissions", submissions);
         //   results.put("conferences", conferences);

        } else {
            // 单独搜索指定类型的实体
            switch (entityType) {
                case "message":
                  results.put("messages", messageRepository.searchByKeyword(keyword));
                    break;

                case "submission":
                    results.put("submissions", submissionRepository.searchByKeyword(keyword));
                    break;
                case "conference":
                //    results.put("conferences", conferenceRepository.searchByKeyword(keyword));
                    break;

                default:
                    throw new IllegalArgumentException("Unknown entity type: " + entityType);
            }
        }

        return results;
    }
}
