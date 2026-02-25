package massage.ruhequelle.repository;

import massage.ruhequelle.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByDateAndTime(LocalDate date, LocalTime time);
    List<Appointment> findByDateBetween(LocalDate start, LocalDate end);
}
