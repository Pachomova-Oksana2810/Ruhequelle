package massage.ruhequelle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RuhequelleApplication {

    public static void main(String[] args) {
        SpringApplication.run(RuhequelleApplication.class, args);
    }

}
