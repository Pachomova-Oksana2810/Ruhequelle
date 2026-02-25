package massage.ruhequelle.service;

import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;
    public AppointmentServiceImpl(AppointmentRepository repository) {
        this.repository = repository;
    }
    @Override
    public Appointment save(Appointment appointment) {
        return repository.save(appointment);
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
}
