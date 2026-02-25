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
}
