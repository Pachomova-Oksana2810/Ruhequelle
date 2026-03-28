package massage.ruhequelle.service;

import massage.ruhequelle.model.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

import java.util.Map;
import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate;

    @Value("${notification.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${notification.email.to:koldakova.anna88@gmail.com}")
    private String emailTo;

    @Value("${notification.telegram.enabled:true}")
    private boolean telegramEnabled;

    @Value("${notification.telegram.bot-token:}")
    private String telegramBotToken;

    @Value("${notification.telegram.chat-id:}")
    private String telegramChatId;

    public NotificationService(JavaMailSender mailSender, RestTemplate restTemplate) {
        this.mailSender = mailSender;
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    public void logConfig() {
        log.info("Notification config: emailEnabled={}, telegramEnabled={}, hasTelegramToken={}, hasTelegramChatId={}",
                emailEnabled, telegramEnabled,
                telegramBotToken != null && !telegramBotToken.isBlank(),
                telegramChatId != null && !telegramChatId.isBlank());
    }

    public void sendReminder(Appointment appointment) {
        String firstName = appointment.getFirstName() != null ? appointment.getFirstName() : "";
        String lastName = appointment.getLastName() != null ? appointment.getLastName() : "";
        String dateStr = appointment.getDate().format(DATE_FMT);
        String timeStr = appointment.getTime().format(TIME_FMT);
        String treatment = appointment.getMassageType() != null ? appointment.getMassageType() : "—";

        try {
            String subject = "Erinnerung: Ihr Massagetermin morgen – Ruhequelle";
            String body =
                    "Guten Tag " + firstName + " " + lastName + ",\n\n"
                            + "wir möchten Sie an Ihren Massagetermin morgen erinnern:\n\n"
                            + "Datum: " + dateStr + "\n"
                            + "Uhrzeit: " + timeStr + " Uhr\n"
                            + "Behandlung: " + treatment + "\n\n"
                            + "Adresse: Neustadt 23A, 56068 Koblenz\n\n"
                            + "Bei Fragen oder falls Sie absagen müssen, melden Sie sich bitte rechtzeitig.\n\n"
                            + "Bis morgen!\n"
                            + "Ihr Ruhequelle-Team";

            String clientEmail = appointment.getEmail();
            if (emailEnabled && clientEmail != null && !clientEmail.isBlank()) {
                try {
                    sendReminderEmailToClient(clientEmail, subject, body);
                    log.info(
                            "Reminder email sent to client {} for appointment id={}",
                            clientEmail,
                            appointment.getId()
                    );
                } catch (Exception e) {
                    log.error(
                            "Failed to send reminder email for appointment id={}: {}",
                            appointment.getId(),
                            e.getMessage(),
                            e
                    );
                }
            } else if (emailEnabled) {
                log.debug("Reminder email skipped: empty client email for appointment id={}", appointment.getId());
            }

            boolean hasTelegram = telegramBotToken != null && !telegramBotToken.isBlank()
                    && telegramChatId != null && !telegramChatId.isBlank();
            if (telegramEnabled && hasTelegram) {
                try {
                    String ownerMessage = String.format(
                            "⏰ Erinnerung gesendet an %s %s für morgen %s um %s Uhr – %s",
                            firstName,
                            lastName,
                            dateStr,
                            timeStr,
                            treatment
                    );
                    postTelegramMessageToOwner(ownerMessage);
                    log.info(
                            "Reminder Telegram notification sent for appointment id={}",
                            appointment.getId()
                    );
                } catch (Exception e) {
                    log.error(
                            "Failed to send reminder Telegram for appointment id={}: {}",
                            appointment.getId(),
                            e.getMessage(),
                            e
                    );
                }
            } else {
                log.debug(
                        "Reminder Telegram skipped: enabled={}, hasToken={}, hasChatId={}",
                        telegramEnabled,
                        telegramBotToken != null && !telegramBotToken.isBlank(),
                        telegramChatId != null && !telegramChatId.isBlank()
                );
            }

            log.info(
                    "Reminder processed for appointment id={} ({} {})",
                    appointment.getId(),
                    firstName,
                    lastName
            );
        } catch (Exception e) {
            log.error(
                    "Unexpected error in sendReminder for appointment id={}: {}",
                    appointment.getId(),
                    e.getMessage(),
                    e
            );
        }
    }

    public void notifyNewBooking(Appointment appointment) {
        String subject = "Neue Buchung: Ruhequelle";
        String body = buildMessage(appointment);
        log.info("Sending booking notifications for appointment: {} {} at {} {}",
                appointment.getFirstName(), appointment.getLastName(),
                appointment.getDate(), appointment.getTime());

        if (emailEnabled) {
            sendEmail(subject, body);
        } else {
            log.debug("Email notifications disabled");
        }
        boolean hasTelegram = telegramBotToken != null && !telegramBotToken.isBlank()
                && telegramChatId != null && !telegramChatId.isBlank();
        if (telegramEnabled && hasTelegram) {
            sendTelegram("📅 " + subject + "\n\n" + body);
        } else {
            log.warn("Telegram skipped: enabled={}, hasToken={}, hasChatId={}",
                    telegramEnabled, telegramBotToken != null && !telegramBotToken.isBlank(),
                    telegramChatId != null && !telegramChatId.isBlank());
        }
    }

    private String buildMessage(Appointment a) {
        return String.format(
                "Neue Terminbuchung:\n\n" +
                "Name: %s %s\n" +
                "E-Mail: %s\n" +
                "Telefon: %s\n" +
                "Behandlung: %s\n" +
                "Datum: %s\n" +
                "Uhrzeit: %s",
                a.getFirstName(), a.getLastName(),
                a.getEmail(), a.getPhone(),
                a.getMassageType() != null ? a.getMassageType() : "—",
                a.getDate().format(DATE_FMT),
                a.getTime().format(TIME_FMT)
        );
    }

    private void sendEmail(String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(emailTo);
            msg.setSubject(subject);
            msg.setText(body);
            msg.setFrom(emailTo);
            mailSender.send(msg);
            log.info("Booking notification email sent to {}", emailTo);
        } catch (Exception e) {
            log.error("Failed to send booking email: {}. Check MAIL_PASSWORD (use Gmail App Password if 2FA enabled)", e.getMessage(), e);
        }
    }

    private void sendReminderEmailToClient(String clientEmail, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(clientEmail);
        msg.setSubject(subject);
        msg.setText(body);
        msg.setFrom(emailTo);
        mailSender.send(msg);
    }

    private void postTelegramMessageToOwner(String text) {
        String url = "https://api.telegram.org/bot" + telegramBotToken + "/sendMessage";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                Map.of("chat_id", telegramChatId, "text", text),
                headers
        );
        restTemplate.postForObject(url, request, String.class);
    }

    private void sendTelegram(String text) {
        try {
            String url = "https://api.telegram.org/bot" + telegramBotToken + "/sendMessage";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                    Map.of("chat_id", telegramChatId, "text", text),
                    headers
            );
            restTemplate.postForObject(url, request, String.class);
            log.info("Booking notification sent to Telegram chat {}", telegramChatId);
        } catch (Exception e) {
            log.error("Failed to send Telegram notification: {}. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID", e.getMessage(), e);
        }
    }
}
