package massage.ruhequelle.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class BrevoService {

    private static final String BASE = "https://api.brevo.com/v3";

    @Value("${brevo.api-key:}")
    private String apiKey;

    @Value("${brevo.sms-from:Ruhequelle}")
    private String smsFrom;

    @Value("${notification.email.to:koldakova.anna88@gmail.com}")
    private String senderEmail;

    private final RestTemplate restTemplate;

    /**
     * @return null if Brevo accepted the message; otherwise a skip or failure reason
     */
    public String sendEmailOrError(String toEmail, String toName, String subject, String textContent) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Brevo sendEmail skipped: api key is blank");
            return "api key is blank";
        }
        if (toEmail == null || toEmail.isBlank()) {
            log.warn("Brevo sendEmail skipped: recipient email is blank");
            return "recipient email is blank";
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            String name = toName != null ? toName : "";
            Map<String, Object> sender = Map.of("name", "Ruhequelle", "email", senderEmail);
            Map<String, Object> toEntry = new LinkedHashMap<>();
            toEntry.put("email", toEmail.trim());
            toEntry.put("name", name);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("sender", sender);
            body.put("to", List.of(toEntry));
            body.put("subject", subject);
            body.put("textContent", textContent != null ? textContent : "");

            String url = BASE + "/smtp/email";
            restTemplate.postForObject(url, new HttpEntity<>(body, headers), String.class);
            log.info("Brevo email sent to {}", toEmail);
            return null;
        } catch (Exception e) {
            log.error("Brevo sendEmail failed for {}: {}", toEmail, e.getMessage(), e);
            return e.getMessage();
        }
    }

    public void sendEmail(String toEmail, String toName, String subject, String textContent) {
        sendEmailOrError(toEmail, toName, subject, textContent);
    }

    /**
     * @return null if Brevo accepted the SMS; otherwise a skip or failure reason
     */
    public String sendSmsOrError(String phone, String message) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Brevo sendSms skipped: api key is blank");
            return "api key is blank";
        }
        if (phone == null || phone.isBlank()) {
            log.warn("Brevo sendSms skipped: phone is blank");
            return "phone is blank";
        }
        String formattedPhone = formatPhoneForSms(phone);
        if (formattedPhone.isBlank()) {
            log.warn("Brevo sendSms skipped: phone is blank after formatting");
            return "phone is blank after formatting";
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("sender", smsFrom);
            body.put("recipient", formattedPhone);
            body.put("content", message != null ? message : "");

            String url = BASE + "/transactionalSMS/sms";
            restTemplate.postForObject(url, new HttpEntity<>(body, headers), String.class);
            log.info("Brevo SMS sent to {}", formattedPhone);
            return null;
        } catch (Exception e) {
            log.error("Brevo sendSms failed for {}: {}", formattedPhone, e.getMessage(), e);
            return e.getMessage();
        }
    }

    public void sendSms(String phone, String message) {
        sendSmsOrError(phone, message);
    }

    static String formatPhoneForSms(String raw) {
        if (raw == null) {
            return "";
        }
        String p = raw.replaceAll("[\\s-]", "");
        if (p.isEmpty()) {
            return "";
        }
        if (p.startsWith("+")) {
            return p;
        }
        if (p.startsWith("0")) {
            return "+49" + p.substring(1);
        }
        if (p.startsWith("49")) {
            return "+" + p;
        }
        if (p.startsWith("380")) {
            return "+" + p;
        }
        return p;
    }
}
