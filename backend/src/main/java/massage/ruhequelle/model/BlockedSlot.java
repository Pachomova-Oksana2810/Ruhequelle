package massage.ruhequelle.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(
        name = "blocked_slots",
        uniqueConstraints = @UniqueConstraint(columnNames = {"slot_date", "slot_time"}),
        indexes = @Index(name = "idx_blocked_slots_batch_id", columnList = "batch_id")
)
public class BlockedSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name = "slot_time", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;

    @Column(nullable = false, length = 255)
    private String reason;

    /** Shared by all slots created together (e.g. a vacation range). */
    @Column(name = "batch_id", length = 36)
    private String batchId;
}
