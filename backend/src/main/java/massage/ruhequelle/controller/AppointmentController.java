package massage.ruhequelle.controller;

import massage.ruhequelle.dto.SlotDto;
import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.repository.AppointmentRepository;
import massage.ruhequelle.service.AppointmentService;
import massage.ruhequelle.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class AppointmentController {


    private final AppointmentService service;
    private final NotificationService notificationService;

    public AppointmentController(AppointmentService service, NotificationService notificationService) {
        this.service = service;
        this.notificationService = notificationService;
    }

    private final List<LocalTime> workingHours = List.of(
            LocalTime.of(9,0),
            LocalTime.of(10,0),
            LocalTime.of(11,0),
            LocalTime.of(13, 0),
            LocalTime.of(14, 0),
            LocalTime.of(15, 0),
            LocalTime.of(16, 0),
            LocalTime.of(17, 0)
    );

    @GetMapping("/availability")
    public List<SlotDto> getAvailability(@RequestParam String start, @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        List<Appointment> appointments = service.findBetween(startDate, endDate);

        Map<LocalDate, List<LocalTime>>  busy = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getDate,
                        Collectors.mapping(Appointment::getTime, Collectors.toList())));

        List<SlotDto> result = new ArrayList<>();

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            for (LocalTime time : workingHours) {
                boolean available = !busy
                        .getOrDefault(current, List.of())
                        .contains(time);

                result.add(new SlotDto(
                        current.toString(),
                        time.format(DateTimeFormatter.ofPattern("HH:mm")),
                        available));
            }
            current = current.plusDays(1);
        }
        return result;

    }


    @PostMapping
    public ResponseEntity<?> save(@RequestBody Appointment appointment) {
        if (service.isSlotTaken(appointment.getDate(), appointment.getTime())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Slot is already taken");
        }
        Appointment saved = service.save(appointment);
        notificationService.notifyNewBooking(saved);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<Appointment> findAll() {
        return service.findAll();
    }

    @GetMapping("/calendar/{id}")
    public ResponseEntity<byte[]> exportCalendar(@PathVariable Long id) {
        Appointment app = service.findById(id);

        LocalDate startDate = LocalDate.parse(app.getDate().format(DateTimeFormatter.BASIC_ISO_DATE));
        LocalTime startTime = LocalTime.parse(app.getTime().format(DateTimeFormatter.ofPattern("HHmmss")));

        String ics =
                        "BEGIN:VCALENDAR\n" +
                        "VERSION:2.0\n" +
                        "BEGIN:VEVENT\n" +
                        "SUMMARY:Massage Termin\n" +
                        "DTSTART:" + startDate + "T" + startTime + "\n" +
                        "END:VEVENT\n" +
                        "END:VCALENDAR";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointment.ics")
                .body(ics.getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping("/calendar")
    public ResponseEntity<byte[]> exportCalendarFeed() {
        List<Appointment> appointments = service.findAll();

        StringBuilder builder = new StringBuilder();
        builder.append("BEGIN:VCALENDAR\n");
        builder.append("VERSION:2.0\n");

        DateTimeFormatter dateFormatter = DateTimeFormatter.BASIC_ISO_DATE;
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HHmmss");

        for (Appointment app : appointments) {
            builder.append("BEGIN:VEVENT\n");
            builder.append("SUMMARY:Massage Termin\n");
            builder.append("DTSTART:")
                    .append(app.getDate().format(dateFormatter))
                    .append("T")
                    .append(app.getTime().format(timeFormatter))
                    .append("\n");
            builder.append("END:VEVENT\n");
        }

        builder.append("END:VCALENDAR");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointments.ics")
                .body(builder.toString().getBytes(StandardCharsets.UTF_8));
    }


}
