package massage.ruhequelle.controller;

import massage.ruhequelle.model.News;
import massage.ruhequelle.repository.NewsRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsRepository newsRepository;

    public NewsController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @GetMapping
    public List<News> listVisible() {
        return newsRepository.findByVisibleTrueOrderByPublishedAtDesc();
    }
}
