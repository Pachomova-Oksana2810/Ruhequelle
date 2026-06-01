package massage.ruhequelle.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import massage.ruhequelle.model.Appointment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;

@Service
@Slf4j
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "Ruhequelle";
    private static final ZoneId BERLIN = ZoneId.of("Europe/Berlin");
    private static final int EVENT_DURATION_MINUTES = 60;

    @Value("${google.calendar.id:}")
    private String calendarId;

    @Value("${google.service.account.json:}")
    private String serviceAccountJson;

    private Calendar calendarClient;

    @PostConstruct
    void init() {
        if (serviceAccountJson == null || serviceAccountJson.isBlank()) {
            log.warn("Google Calendar init skipped: GOOGLE_SERVICE_ACCOUNT_JSON is blank");
            return;
        }
        if (calendarId == null || calendarId.isBlank()) {
            log.warn("Google Calendar init skipped: GOOGLE_CALENDAR_ID is blank");
            return;
        }
        try {
            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8)))
                    .createScoped(Collections.singleton(CalendarScopes.CALENDAR));

            calendarClient = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName(APPLICATION_NAME)
                    .build();
            log.info("Google Calendar client initialized for calendar: {}", calendarId);
        } catch (Exception e) {
            log.error("Failed to initialize Google Calendar client", e);
        }
    }

    public String createEvent(Appointment appointment) {
        if (calendarClient == null) {
            log.warn("Google Calendar createEvent skipped: client not initialized");
            return null;
        }
        try {
            Event event = buildEvent(appointment);
            Event created = calendarClient.events()
                    .insert(calendarId, event)
                    .execute();
            String eventId = created.getId();
            log.info("Google Calendar event created: {}", eventId);
            return eventId;
        } catch (Exception e) {
            log.error("Google Calendar createEvent failed for appointment id={}", appointment.getId(), e);
            return null;
        }
    }

    public void deleteEvent(String eventId) {
        if (calendarClient == null) {
            log.warn("Google Calendar deleteEvent skipped: client not initialized");
            return;
        }
        if (eventId == null || eventId.isBlank()) {
            log.debug("Google Calendar deleteEvent skipped: eventId is blank");
            return;
        }
        try {
            calendarClient.events().delete(calendarId, eventId).execute();
            log.info("Google Calendar event deleted: {}", eventId);
        } catch (Exception e) {
            log.error("Google Calendar deleteEvent failed for eventId={}", eventId, e);
        }
    }

    public void updateEvent(String eventId, Appointment appointment) {
        if (calendarClient == null) {
            log.warn("Google Calendar updateEvent skipped: client not initialized");
            return;
        }
        if (eventId == null || eventId.isBlank()) {
            log.debug("Google Calendar updateEvent skipped: eventId is blank");
            return;
        }
        try {
            Event event = buildEvent(appointment);
            calendarClient.events().update(calendarId, eventId, event).execute();
            log.info("Google Calendar event updated: {}", eventId);
        } catch (Exception e) {
            log.error("Google Calendar updateEvent failed for eventId={}", eventId, e);
        }
    }

    private Event buildEvent(Appointment appointment) {
        ZonedDateTime start = ZonedDateTime.of(appointment.getDate(), appointment.getTime(), BERLIN);
        ZonedDateTime end = start.plusMinutes(EVENT_DURATION_MINUTES);

        EventDateTime startDateTime = new EventDateTime()
                .setDateTime(new DateTime(start.toInstant().toEpochMilli()))
                .setTimeZone(BERLIN.getId());
        EventDateTime endDateTime = new EventDateTime()
                .setDateTime(new DateTime(end.toInstant().toEpochMilli()))
                .setTimeZone(BERLIN.getId());

        String firstName = nullToEmpty(appointment.getFirstName());
        String lastName = nullToEmpty(appointment.getLastName());
        String massageType = nullToEmpty(appointment.getMassageType());
        String phone = nullToEmpty(appointment.getPhone());
        String email = nullToEmpty(appointment.getEmail());

        return new Event()
                .setSummary("Massage: " + firstName + " " + lastName + " - " + massageType)
                .setDescription("Tel: " + phone + "\nEmail: " + email)
                .setStart(startDateTime)
                .setEnd(endDateTime);
    }

    private static String nullToEmpty(String value) {
        return value != null ? value : "";
    }
}
