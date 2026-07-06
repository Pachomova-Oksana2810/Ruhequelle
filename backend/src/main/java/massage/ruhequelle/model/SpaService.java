package massage.ruhequelle.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cms_services")
public class SpaService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 512)
    private String name;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 128)
    private String price;

    @Column(length = 1024)
    private String imageUrl;

    private Integer durationMinutes;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false)
    private boolean visible = true;
}
