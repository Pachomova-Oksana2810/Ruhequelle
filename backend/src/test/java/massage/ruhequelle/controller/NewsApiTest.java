package massage.ruhequelle.controller;

import massage.ruhequelle.repository.NewsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NewsApiTest {

    private static final String ADMIN_PASSWORD = "test-admin-password";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NewsRepository newsRepository;

    @BeforeEach
    void clearNews() {
        newsRepository.deleteAll();
    }

    @Test
    void publicNewsIsOrderedNewestFirstAndHidesInvisibleItems() throws Exception {
        mockMvc.perform(post("/api/admin/news")
                        .header("X-Admin-Password", ADMIN_PASSWORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Older news",
                                  "content": "First item",
                                  "imageUrl": "https://example.com/old.jpg",
                                  "visible": true,
                                  "publishedAt": "2024-01-01T10:00:00"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/admin/news")
                        .header("X-Admin-Password", ADMIN_PASSWORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Newest news",
                                  "content": "Second item",
                                  "imageUrl": "https://example.com/new.jpg",
                                  "visible": true,
                                  "publishedAt": "2026-08-25T12:00:00"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.visible").value(true));

        mockMvc.perform(post("/api/admin/news")
                        .header("X-Admin-Password", ADMIN_PASSWORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Hidden news",
                                  "content": "Should not appear",
                                  "visible": false
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/news").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("Newest news"))
                .andExpect(jsonPath("$[0].content").value("Second item"))
                .andExpect(jsonPath("$[0].imageUrl").value("https://example.com/new.jpg"))
                .andExpect(jsonPath("$[0].publishedAt").value("2026-08-25T12:00:00"))
                .andExpect(jsonPath("$[0].visible").value(true))
                .andExpect(jsonPath("$[0].id").isNumber())
                .andExpect(jsonPath("$[1].title").value("Older news"));
    }

    @Test
    void publicNewsDoesNotRequireAdminPassword() throws Exception {
        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void adminNewsCreateRequiresPassword() throws Exception {
        mockMvc.perform(post("/api/admin/news")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Nope","content":"Nope","visible":true}
                                """))
                .andExpect(status().isForbidden());
    }
}
