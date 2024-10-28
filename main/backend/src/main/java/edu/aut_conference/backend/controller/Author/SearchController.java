package edu.aut_conference.backend.controller.Author;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.aut_conference.backend.service.Author.SearchService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/suggestions")
    public Map<String, List<?>> searchSuggestions(@RequestParam(required = false) String entityType, @RequestParam String query) {
        return searchService.search(entityType, query);
    }
}
