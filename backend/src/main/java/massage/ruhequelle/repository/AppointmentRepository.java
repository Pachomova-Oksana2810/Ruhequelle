package massage.ruhequelle.repository;

import massage.ruhequelle.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByDateAndTime(LocalDate date, LocalTime time);

    List<Appointment> findByDateBetween(LocalDate start, LocalDate end);

    @Query(
            "SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a "
                    + "WHERE a.date = :date AND a.time = :time AND a.id <> :excludeId"
    )
    boolean existsOtherAtDateTimeExcluding(
            @Param("date") LocalDate date,
            @Param("time") LocalTime time,
            @Param("excludeId") Long excludeId
    );
}
