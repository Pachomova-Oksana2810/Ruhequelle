package massage.ruhequelle.controller;

import massage.ruhequelle.model.SpaService;
import massage.ruhequelle.repository.SpaServiceRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class SpaServicesController {

    private final SpaServiceRepository spaServiceRepository;

    public SpaServicesController(SpaServiceRepository spaServiceRepository) {
        this.spaServiceRepository = spaServiceRepository;
    }

    @GetMapping
    public List<SpaService> listVisible() {
        return spaServiceRepository.findByVisibleTrueOrderBySortOrderAsc();
    }
}
