package massage.ruhequelle.controller;

import massage.ruhequelle.dto.BlockSlotRequest;
import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.model.BlockedSlot;
import massage.ruhequelle.repository.BlockedSlotRepository;
import massage.ruhequelle.service.AppointmentService;
import massage.ruhequelle.service.BrevoService;
import massage.ruhequelle.service.GoogleCalendarService;
import massage.ruhequelle.service.NotificationService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AppointmentService appointmentService;
    private final BlockedSlotRepository blockedSlotRepository;
    private final NotificationService notificationService;
    private final BrevoService brevoService;
    private final GoogleCalendarService googleCalendarService;

    public AdminController(
            AppointmentService appointmentService,
            BlockedSlotRepository blockedSlotRepository,
            NotificationService notificationService,
            BrevoService brevoService,
            GoogleCalendarService googleCalendarService
    ) {
        this.appointmentService = appointmentService;
        this.blockedSlotRepository = blockedSlotRepository;
        this.notificationService = notificationService;
        this.brevoService = brevoService;
        this.googleCalendarService = googleCalendarService;
    }

    @GetMapping("/test/sms")
    public ResponseEntity<Map<String, String>> testSms(@RequestParam String phone) {
        String err = brevoService.sendSmsOrError(phone, "Test SMS von Ruhequelle");
        if (err != null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", err));
        }
        return ResponseEntity.ok(Map.of("status", "sent", "to", phone));
    }

    @GetMapping("/test/calendar")
    public ResponseEntity<Map<String, String>> testCalendar() {
        Appointment test = new Appointment();
        test.setFirstName("Test");
        test.setLastName("Ruhequelle");
        test.setEmail("test@ruhequelle.de");
        test.setPhone("+49000000000");
        test.setMassageType("Testmassage");
        test.setDate(LocalDate.now().plusDays(1));
        test.setTime(LocalTime.of(10, 0));
        test.setStatus("confirmed");

        String eventId = googleCalendarService.createEvent(test);
        if (eventId == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Calendar event was not created (check logs and GOOGLE_* env vars)"
                    ));
        }
        return ResponseEntity.ok(Map.of("status", "created", "eventId", eventId));
    }

    @GetMapping("/test/calendar-sync")
    public ResponseEntity<Map<String, String>> testCalendarSync() {
        googleCalendarService.syncCalendarEvents();
        return ResponseEntity.ok(Map.of(
                "status", "synced",
                "message", "Calendar sync triggered"
        ));
    }

    @GetMapping("/test/email")
    public ResponseEntity<Map<String, String>> testEmail(@RequestParam String email) {
        String err = brevoService.sendEmailOrError(email, "Test", "Test Email", "Test von Ruhequelle");
        if (err != null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", err));
        }
        return ResponseEntity.ok(Map.of("status", "sent", "to", email));
    }

    @GetMapping("/appointments")
    public List<Appointment> listAppointments() {
        return appointmentService.findAll();
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        if (appointment.getDate() == null || appointment.getTime() == null) {
            return ResponseEntity.badRequest().body("date and time required");
        }
        if (!appointmentService.isBookable(appointment.getDate(), appointment.getTime())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Slot is not available");
        }
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("confirmed");
        }
        Appointment saved = appointmentService.save(appointment);
        notificationService.notifyNewBooking(saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/appointments/{id}")
    public Appointment updateAppointment(@PathVariable Long id, @RequestBody Appointment patch) {
        return appointmentService.update(id, patch);
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/slots/blocks")
    public List<BlockedSlot> listBlockedSlots() {
        return blockedSlotRepository.findAllByOrderByDateAscTimeAsc();
    }

    @PostMapping("/slots/block")
    public ResponseEntity<?> blockSlot(@RequestBody BlockSlotRequest body) {
        if (body.getDate() == null || body.getTime() == null) {
            return ResponseEntity.badRequest().body("date and time required");
        }
        if (body.getReason() == null || body.getReason().isBlank()) {
            return ResponseEntity.badRequest().body("reason required");
        }
        if (appointmentService.isSlotTaken(body.getDate(), body.getTime())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Slot has an existing appointment");
        }
        if (blockedSlotRepository.existsByDateAndTime(body.getDate(), body.getTime())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Slot is already blocked");
        }
        BlockedSlot slot = new BlockedSlot();
        slot.setDate(body.getDate());
        slot.setTime(body.getTime());
        slot.setReason(body.getReason().trim());
        try {
            BlockedSlot saved = blockedSlotRepository.save(slot);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Slot is already blocked");
        }
    }

    @DeleteMapping("/slots/block/{id}")
    public ResponseEntity<Void> unblockSlot(@PathVariable Long id) {
        if (!blockedSlotRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blocked slot not found");
        }
        blockedSlotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
