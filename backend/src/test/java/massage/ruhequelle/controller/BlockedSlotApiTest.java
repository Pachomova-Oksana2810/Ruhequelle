package massage.ruhequelle.controller;

import massage.ruhequelle.model.Appointment;
import massage.ruhequelle.repository.AppointmentRepository;
import massage.ruhequelle.repository.BlockedSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BlockedSlotApiTest {

    private static final String ADMIN_PASSWORD = "test-admin-password";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BlockedSlotRepository blockedSlotRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @BeforeEach
    void clear() {
        blockedSlotRepository.deleteAll();
        appointmentRepository.deleteAll();
    }

    @Test
    void blocksSingleSlotWhenTimeIsProvided() throws Exception {
        mockMvc.perform(post("/api/admin/slots/block")
                        .header("X-Admin-Password", ADMIN_PASSWORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "date": "2026-10-05",
                                  "time": "10:00",
                                  "reason": "Pause"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.created").value(1))
                .andExpect(jsonPath("$.allDay").value(false))
                .andExpect(jsonPath("$.reason").value("Pause"));

        assertEquals(1, blockedSlotRepository.count());
    }

    @Test
    void blocksAllWorkingHoursInDateRangeWithoutTime() throws Exception {
        mockMvc.perform(post("/api/admin/slots/block")
                        .header("X-Admin-Password", ADMIN_PASSWORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "date": "2026-10-05",
                                  "endDate": "2026-10-06",
                                  "reason": "Urlaub"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.created").value(22))
                .andExpect(jsonPath("$.allDay").value(true))
                .andExpect(jsonPath("$.reason").value("Urlaub"))
                .andExpect(jsonPath("$.batchId").isString());

        mockMvc.perform(get("/api/appointments/availability?start=2026-10-05&end=2026-10-06"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.available == true)]", hasSize(0)));

        String batchId = blockedSlotRepository.findAll().getFirst().getBatchId();
        mockMvc.perform(delete("/api/admin/slots/block/batch/" + batchId)
                        .header("X-Admin-Password", ADMIN_PASSWORD))
                .andExpect(status().isNoContent());

        assertEquals(0, blockedSlotRepository.count());
    }

    @Test
    void skipsExistingAppointmentsWhenBlockingRange() throws Exception {
        Appointment appointment = new Appointment();
        appointment.setFirstName("Anna");
        appointment.setLastName("Test");
        appointment.setEmail("anna@example.com");
        appointment.setPhone("+49000000000");
        appointment.setMassageType("Test");
        appointment.setDate(LocalDate.of(2026, 10, 5));
        appointment.setTime(LocalTime.of(10, 0));
        appointment.setStatus("confirmed");
        appointmentRepository.save(appointment);

        mockMvc.perform(post("/api/admin/slots/block")
                        .header("X-Admin-Password", ADMIN_PASSWORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "date": "2026-10-05",
                                  "endDate": "2026-10-05",
                                  "reason": "Urlaub"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.created").value(10))
                .andExpect(jsonPath("$.skippedTaken").value(1));
    }
}
