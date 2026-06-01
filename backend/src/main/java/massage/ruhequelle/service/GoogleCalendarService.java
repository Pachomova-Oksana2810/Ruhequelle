package massage.ruhequelle.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Channel;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.model.BlockedSlot;
import massage.ruhequelle.repository.AppointmentRepository;
import massage.ruhequelle.repository.BlockedSlotRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "Ruhequelle";
    private static final ZoneId BERLIN = ZoneId.of("Europe/Berlin");
    private static final int EVENT_DURATION_MINUTES = 60;
    private static final int SYNC_DAYS_AHEAD = 30;
    private static final long WEBHOOK_TTL_MS = 7L * 24 * 60 * 60 * 1000;

    private static final List<LocalTime> WORKING_HOURS = List.of(
            LocalTime.of(8, 15),
            LocalTime.of(9, 0),
            LocalTime.of(10, 0),
            LocalTime.of(11, 0),
            LocalTime.of(12, 0),
            LocalTime.of(13, 0),
            LocalTime.of(14, 0),
            LocalTime.of(15, 0),
            LocalTime.of(16, 0),
            LocalTime.of(17, 0),
            LocalTime.of(18, 0)
    );

    @Value("${google.calendar.id:}")
    private String calendarId;

    @Value("${google.service.account.json:}")
    private String serviceAccountJson;

    @Value("${app.webhook.url:}")
    private String webhookUrl;

    private final AppointmentRepository appointmentRepository;
    private final BlockedSlotRepository blockedSlotRepository;

    private Calendar calendarClient;
    private volatile String webhookChannelId;
    private volatile String webhookResourceId;

    public GoogleCalendarService(
            AppointmentRepository appointmentRepository,
            BlockedSlotRepository blockedSlotRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.blockedSlotRepository = blockedSlotRepository;
    }

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
            setupWebhook();
        } catch (Exception e) {
            log.error("Failed to initialize Google Calendar client", e);
        }
    }

    public void setupWebhook() {
        if (calendarClient == null) {
            log.warn("Google Calendar webhook setup skipped: client not initialized");
            return;
        }
        if (webhookUrl == null || webhookUrl.isBlank()) {
            log.warn("Google Calendar webhook setup skipped: app.webhook.url is blank");
            return;
        }
        try {
            stopExistingWebhookChannel();

            String address = webhookUrl.replaceAll("/$", "") + "/api/webhook/google-calendar";
            String channelId = UUID.randomUUID().toString();

            Channel channel = new Channel()
                    .setId(channelId)
                    .setType("web_hook")
                    .setAddress(address)
                    .setExpiration(System.currentTimeMillis() + WEBHOOK_TTL_MS);

            Channel response = calendarClient.events().watch(calendarId, channel).execute();
            webhookChannelId = response.getId();
            webhookResourceId = response.getResourceId();
            log.info("Google Calendar webhook registered: {}", webhookChannelId);
        } catch (Exception e) {
            log.error("Failed to register Google Calendar webhook", e);
        }
    }

    public void syncCalendarEvents() {
        if (calendarClient == null) {
            log.warn("Google Calendar sync skipped: client not initialized");
            return;
        }
        try {
            ZonedDateTime rangeStart = ZonedDateTime.now(BERLIN);
            ZonedDateTime rangeEnd = rangeStart.plusDays(SYNC_DAYS_AHEAD);

            Events events = calendarClient.events()
                    .list(calendarId)
                    .setTimeMin(new DateTime(rangeStart.toInstant().toEpochMilli()))
                    .setTimeMax(new DateTime(rangeEnd.toInstant().toEpochMilli()))
                    .setSingleEvents(true)
                    .setOrderBy("startTime")
                    .execute();

            if (events.getItems() == null) {
                return;
            }

            for (Event event : events.getItems()) {
                syncEventToBlockedSlot(event);
            }
        } catch (Exception e) {
            log.error("Google Calendar sync failed", e);
        }
    }

    private void syncEventToBlockedSlot(Event event) {
        if (event == null || "cancelled".equalsIgnoreCase(event.getStatus())) {
            return;
        }
        EventDateTime start = event.getStart();
        if (start == null) {
            return;
        }

        LocalDate date;
        LocalTime time;
        if (start.getDateTime() != null) {
            ZonedDateTime startZdt = ZonedDateTime.ofInstant(
                    Instant.ofEpochMilli(start.getDateTime().getValue()),
                    BERLIN
            );
            date = startZdt.toLocalDate();
            time = roundToNearestWorkingHour(startZdt.toLocalTime());
        } else if (start.getDate() != null) {
            date = LocalDate.parse(start.getDate().toStringRfc3339());
            time = roundToNearestWorkingHour(LocalTime.of(9, 0));
        } else {
            return;
        }

        if (appointmentRepository.existsByDateAndTime(date, time)) {
            return;
        }
        if (blockedSlotRepository.existsByDateAndTime(date, time)) {
            return;
        }

        String summary = event.getSummary() != null ? event.getSummary() : "Busy";
        BlockedSlot slot = new BlockedSlot();
        slot.setDate(date);
        slot.setTime(time);
        slot.setReason("Google Calendar: " + summary);

        try {
            blockedSlotRepository.save(slot);
            log.info("Slot blocked from Google Calendar: {} {}", date, time);
        } catch (DataIntegrityViolationException e) {
            log.debug("Slot already blocked (concurrent sync): {} {}", date, time);
        }
    }

    private void stopExistingWebhookChannel() {
        if (webhookChannelId == null || webhookResourceId == null) {
            return;
        }
        try {
            Channel stopChannel = new Channel()
                    .setId(webhookChannelId)
                    .setResourceId(webhookResourceId);
            calendarClient.channels().stop(stopChannel).execute();
            log.info("Stopped previous Google Calendar webhook channel: {}", webhookChannelId);
        } catch (Exception e) {
            log.warn("Could not stop previous Google Calendar webhook channel {}", webhookChannelId, e);
        } finally {
            webhookChannelId = null;
            webhookResourceId = null;
        }
    }

    private static LocalTime roundToNearestWorkingHour(LocalTime time) {
        LocalTime nearest = WORKING_HOURS.getFirst();
        long minDiff = Math.abs(Duration.between(time, nearest).toMinutes());
        for (LocalTime slot : WORKING_HOURS) {
            long diff = Math.abs(Duration.between(time, slot).toMinutes());
            if (diff < minDiff) {
                minDiff = diff;
                nearest = slot;
            }
        }
        return nearest;
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
