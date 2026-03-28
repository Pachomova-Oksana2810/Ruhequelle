package massage.ruhequelle.service;

import massage.ruhequelle.model.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    Appointment save(Appointment appointment);

    List<Appointment> findAll();
    Appointment findById(Long id);
    boolean isSlotTaken(LocalDate date, LocalTime time);
    List<Appointment> findBetween(LocalDate start, LocalDate end);

    boolean isSlotBlocked(LocalDate date, LocalTime time);

    boolean isBookable(LocalDate date, LocalTime time);

    boolean canRescheduleTo(Long appointmentId, LocalDate date, LocalTime time);

    void deleteById(Long id);

    Appointment update(Long id, Appointment patch);
}
