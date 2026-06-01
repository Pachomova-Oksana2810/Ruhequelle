package massage.ruhequelle.controller;

import lombok.extern.slf4j.Slf4j;
import massage.ruhequelle.service.GoogleCalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook")
@Slf4j
public class GoogleCalendarWebhookController {

    private final GoogleCalendarService googleCalendarService;

    public GoogleCalendarWebhookController(GoogleCalendarService googleCalendarService) {
        this.googleCalendarService = googleCalendarService;
    }

    @PostMapping("/google-calendar")
    public ResponseEntity<Void> handleGoogleCalendarWebhook(
            @RequestHeader(value = "X-Goog-Channel-Id", required = false) String channelId,
            @RequestHeader(value = "X-Goog-Resource-State", required = false) String resourceState
    ) {
        try {
            log.debug(
                    "Google Calendar webhook received: channelId={}, resourceState={}",
                    channelId,
                    resourceState
            );
            if ("sync".equalsIgnoreCase(resourceState)) {
                return ResponseEntity.ok().build();
            }
            if ("exists".equalsIgnoreCase(resourceState)) {
                googleCalendarService.syncCalendarEvents();
            }
        } catch (Exception e) {
            log.error("Google Calendar webhook handling failed", e);
        }
        return ResponseEntity.ok().build();
    }
}
