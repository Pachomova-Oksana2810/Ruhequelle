package massage.ruhequelle.controller;

import massage.ruhequelle.model.GalleryItem;
import massage.ruhequelle.model.News;
import massage.ruhequelle.model.SpaService;
import massage.ruhequelle.repository.GalleryItemRepository;
import massage.ruhequelle.repository.NewsRepository;
import massage.ruhequelle.repository.SpaServiceRepository;
import massage.ruhequelle.service.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminCmsController {

    private final NewsRepository newsRepository;
    private final SpaServiceRepository spaServiceRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final CloudinaryService cloudinaryService;

    public AdminCmsController(
            NewsRepository newsRepository,
            SpaServiceRepository spaServiceRepository,
            GalleryItemRepository galleryItemRepository,
            CloudinaryService cloudinaryService
    ) {
        this.newsRepository = newsRepository;
        this.spaServiceRepository = spaServiceRepository;
        this.galleryItemRepository = galleryItemRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/news")
    public List<News> listAllNews() {
        return newsRepository.findAllByOrderByPublishedAtDesc();
    }

    @PostMapping("/news")
    public News createNews(@RequestBody News news) {
        news.setId(null);
        return newsRepository.save(news);
    }

    @PutMapping("/news/{id}")
    public News updateNews(@PathVariable Long id, @RequestBody News patch) {
        News existing = newsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found"));
        if (patch.getTitle() != null) {
            existing.setTitle(patch.getTitle());
        }
        if (patch.getContent() != null) {
            existing.setContent(patch.getContent());
        }
        if (patch.getImageUrl() != null) {
            existing.setImageUrl(patch.getImageUrl());
        }
        existing.setVisible(patch.isVisible());
        return newsRepository.save(existing);
    }

    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found");
        }
        newsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/services")
    public List<SpaService> listAllServices() {
        return spaServiceRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/services")
    public SpaService createService(@RequestBody SpaService service) {
        service.setId(null);
        if (service.getSortOrder() == null) {
            service.setSortOrder(0);
        }
        return spaServiceRepository.save(service);
    }

    @PutMapping("/services/{id}")
    public SpaService updateService(@PathVariable Long id, @RequestBody SpaService patch) {
        SpaService existing = spaServiceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        if (patch.getName() != null) {
            existing.setName(patch.getName());
        }
        if (patch.getDescription() != null) {
            existing.setDescription(patch.getDescription());
        }
        if (patch.getPrice() != null) {
            existing.setPrice(patch.getPrice());
        }
        if (patch.getImageUrl() != null) {
            existing.setImageUrl(patch.getImageUrl());
        }
        if (patch.getDurationMinutes() != null) {
            existing.setDurationMinutes(patch.getDurationMinutes());
        }
        if (patch.getSortOrder() != null) {
            existing.setSortOrder(patch.getSortOrder());
        }
        existing.setVisible(patch.isVisible());
        return spaServiceRepository.save(existing);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        if (!spaServiceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }
        spaServiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/gallery")
    public List<GalleryItem> listAllGallery() {
        return galleryItemRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/gallery")
    public GalleryItem createGalleryItem(@RequestBody GalleryItem item) {
        item.setId(null);
        if (item.getSortOrder() == null) {
            item.setSortOrder(0);
        }
        return galleryItemRepository.save(item);
    }

    @PutMapping("/gallery/{id}")
    public GalleryItem updateGalleryItem(@PathVariable Long id, @RequestBody GalleryItem patch) {
        GalleryItem existing = galleryItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gallery item not found"));
        if (patch.getType() != null) {
            existing.setType(patch.getType());
        }
        if (patch.getUrl() != null) {
            existing.setUrl(patch.getUrl());
        }
        if (patch.getCaption() != null) {
            existing.setCaption(patch.getCaption());
        }
        if (patch.getSortOrder() != null) {
            existing.setSortOrder(patch.getSortOrder());
        }
        existing.setVisible(patch.isVisible());
        return galleryItemRepository.save(existing);
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<Void> deleteGalleryItem(@PathVariable Long id) {
        if (!galleryItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gallery item not found");
        }
        galleryItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        if (!cloudinaryService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", "Cloudinary is not configured"));
        }
        try {
            String url = cloudinaryService.upload(file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }
}
