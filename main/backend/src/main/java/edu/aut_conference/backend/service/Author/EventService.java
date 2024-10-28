package edu.aut_conference.backend.service.Author;

import edu.aut_conference.backend.model.Author.Event;
import edu.aut_conference.backend.repository.Author.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<LocalDate> getCalendarDates(LocalDate date) {
        List<LocalDate> calendarDates = new ArrayList<>();
        YearMonth yearMonth = YearMonth.from(date);
        int daysInMonth = yearMonth.lengthOfMonth();

        LocalDate firstOfMonth = date.withDayOfMonth(1);
        int prevMonthDaysToShow = firstOfMonth.getDayOfWeek().getValue() % 7;
        for (int i = prevMonthDaysToShow; i > 0; i--) {
            calendarDates.add(firstOfMonth.minusDays(i));
        }

        for (int i = 1; i <= daysInMonth; i++) {
            calendarDates.add(firstOfMonth.withDayOfMonth(i));
        }

        int nextMonthDaysToShow = 42 - calendarDates.size();
        LocalDate firstOfNextMonth = firstOfMonth.plusMonths(1);
        for (int i = 1; i <= nextMonthDaysToShow; i++) {
            calendarDates.add(firstOfNextMonth.withDayOfMonth(i));
        }

        return calendarDates;
    }

    public List<Event> getEventsForMonth(LocalDate startDate, LocalDate endDate) {
        return eventRepository.findByDueDateBetween(startDate.minusDays(7), endDate.plusDays(7));
    }
}
