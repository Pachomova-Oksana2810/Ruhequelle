package massage.ruhequelle.controller;

import massage.ruhequelle.dto.BlockSlotRequest;
import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.model.BlockedSlot;
import massage.ruhequelle.repository.BlockedSlotRepository;
import massage.ruhequelle.service.AppointmentService;
import massage.ruhequelle.service.NotificationService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AppointmentService appointmentService;
    private final BlockedSlotRepository blockedSlotRepository;
    private final NotificationService notificationService;

    public AdminController(
            AppointmentService appointmentService,
            BlockedSlotRepository blockedSlotRepository,
            NotificationService notificationService
    ) {
        this.appointmentService = appointmentService;
        this.blockedSlotRepository = blockedSlotRepository;
        this.notificationService = notificationService;
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
