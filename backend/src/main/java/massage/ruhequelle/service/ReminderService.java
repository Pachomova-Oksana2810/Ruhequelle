package massage.ruhequelle.service;

import massage.ruhequelle.model.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);
    private static final ZoneId BERLIN = ZoneId.of("Europe/Berlin");

    private final AppointmentService appointmentService;
    private final NotificationService notificationService;

    public ReminderService(AppointmentService appointmentService, NotificationService notificationService) {
        this.appointmentService = appointmentService;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 9 * * *", zone = "Europe/Berlin")
    public void remindTomorrow() {
        LocalDate tomorrow = LocalDate.now(BERLIN).plusDays(1);
        List<Appointment> appointments = appointmentService.findBetween(tomorrow, tomorrow);
        for (Appointment appointment : appointments) {
            try {
                notificationService.sendReminder(appointment);
            } catch (Exception e) {
                log.error(
                        "Reminder failed for appointment id={}: {}",
                        appointment.getId(),
                        e.getMessage(),
                        e
                );
            }
        }
    }
}
