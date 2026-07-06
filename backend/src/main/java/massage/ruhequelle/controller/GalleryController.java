package massage.ruhequelle.controller;

import massage.ruhequelle.model.GalleryItem;
import massage.ruhequelle.repository.GalleryItemRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryItemRepository galleryItemRepository;

    public GalleryController(GalleryItemRepository galleryItemRepository) {
        this.galleryItemRepository = galleryItemRepository;
    }

    @GetMapping
    public List<GalleryItem> listVisible() {
        return galleryItemRepository.findByVisibleTrueOrderBySortOrderAsc();
    }
}
