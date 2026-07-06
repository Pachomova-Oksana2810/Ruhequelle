package massage.ruhequelle.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 512)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 1024)
    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime publishedAt;

    @Column(nullable = false)
    private boolean visible = true;

    @PrePersist
    void onCreate() {
        if (publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }
}
