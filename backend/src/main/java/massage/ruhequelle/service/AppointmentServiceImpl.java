package massage.ruhequelle.service;

import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.repository.AppointmentRepository;
import massage.ruhequelle.repository.BlockedSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final GoogleCalendarService googleCalendarService;

    public AppointmentServiceImpl(
            AppointmentRepository repository,
            BlockedSlotRepository blockedSlotRepository,
            GoogleCalendarService googleCalendarService
    ) {
        this.repository = repository;
        this.blockedSlotRepository = blockedSlotRepository;
        this.googleCalendarService = googleCalendarService;
    }

    @Override
    public Appointment save(Appointment appointment) {
        Appointment saved = repository.save(appointment);
        String eventId = googleCalendarService.createEvent(saved);
        if (eventId != null) {
            saved.setGoogleCalendarEventId(eventId);
            saved = repository.save(saved);
        }
        return saved;
    }

    @Override
    public List<Appointment> findAll() {
        return repository.findAll();
    }

    @Override
    public Appointment findById(Long id) {
        return repository.findById(id).orElseThrow();
    }

    @Override
    public boolean isSlotTaken(LocalDate date, LocalTime time) {
        return repository.existsByDateAndTime(date, time);
    }

    @Override
    public List<Appointment> findBetween(LocalDate start, LocalDate end) {
        return repository.findByDateBetween(start, end);
    }

    @Override
    public boolean isSlotBlocked(LocalDate date, LocalTime time) {
        return blockedSlotRepository.existsByDateAndTime(date, time);
    }

    @Override
    public boolean isBookable(LocalDate date, LocalTime time) {
        return !repository.existsByDateAndTime(date, time) && !blockedSlotRepository.existsByDateAndTime(date, time);
    }

    @Override
    public boolean canRescheduleTo(Long appointmentId, LocalDate date, LocalTime time) {
        Appointment current = repository.findById(appointmentId).orElseThrow();
        if (current.getDate().equals(date) && current.getTime().equals(time)) {
            return true;
        }
        if (blockedSlotRepository.existsByDateAndTime(date, time)) {
            return false;
        }
        return !repository.existsOtherAtDateTimeExcluding(date, time, appointmentId);
    }

    @Override
    public void deleteById(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Appointment not found"));
        googleCalendarService.deleteEvent(appointment.getGoogleCalendarEventId());
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public Appointment update(Long id, Appointment patch) {
        Appointment existing = repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
        LocalDate newDate = patch.getDate() != null ? patch.getDate() : existing.getDate();
        LocalTime newTime = patch.getTime() != null ? patch.getTime() : existing.getTime();
        if (!existing.getDate().equals(newDate) || !existing.getTime().equals(newTime)) {
            if (!canRescheduleTo(id, newDate, newTime)) {
                throw new ResponseStatusException(CONFLICT, "Slot is not available");
            }
        }
        if (patch.getFirstName() != null) {
            existing.setFirstName(patch.getFirstName());
        }
        if (patch.getLastName() != null) {
            existing.setLastName(patch.getLastName());
        }
        if (patch.getEmail() != null) {
            existing.setEmail(patch.getEmail());
        }
        if (patch.getPhone() != null) {
            existing.setPhone(patch.getPhone());
        }
        if (patch.getMassageType() != null) {
            existing.setMassageType(patch.getMassageType());
        }
        if (patch.getDate() != null) {
            existing.setDate(patch.getDate());
        }
        if (patch.getTime() != null) {
            existing.setTime(patch.getTime());
        }
        if (patch.getStatus() != null) {
            existing.setStatus(patch.getStatus());
        }
        Appointment updated = repository.save(existing);
        googleCalendarService.updateEvent(updated.getGoogleCalendarEventId(), updated);
        return updated;
    }
}
