package massage.ruhequelle.repository;

import massage.ruhequelle.model.BlockedSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BlockedSlotRepository extends JpaRepository<BlockedSlot, Long> {

    boolean existsByDateAndTime(LocalDate date, LocalTime time);

    List<BlockedSlot> findByDateBetween(LocalDate start, LocalDate end);

    List<BlockedSlot> findAllByOrderByDateAscTimeAsc();
}
