package edu.aut_conference.backend.controller.Author;

import edu.aut_conference.backend.model.Author.Event;
import edu.aut_conference.backend.service.Author.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getCalendar(@PathVariable int year, @PathVariable int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<LocalDate> calendarDates = eventService.getCalendarDates(startDate);
        List<Event> events = eventService.getEventsForMonth(startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("calendarDates", calendarDates);

        Map<String, List<Event>> eventsByDate = new HashMap<>();
        for (Event event : events) {
            String dateKey = event.getDueDate().toString();
            eventsByDate.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(event);
        }

        for (Map.Entry<String, List<Event>> entry : eventsByDate.entrySet()) {
            List<Event> dayEvents = entry.getValue();
            dayEvents.sort(Comparator.comparing(Event::getDueTime));
            if (dayEvents.size() > 2) {
                dayEvents = dayEvents.subList(0, 2);
            }
            eventsByDate.put(entry.getKey(), dayEvents);
        }

        response.put("events", eventsByDate);

        return ResponseEntity.ok(response);
    }
}
