package massage.ruhequelle.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "gallery_items")
public class GalleryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GalleryItemType type;

    @Column(nullable = false, length = 1024)
    private String url;

    @Column(length = 512)
    private String caption;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false)
    private boolean visible = true;
}
