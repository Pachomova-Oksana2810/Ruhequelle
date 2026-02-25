package massage.ruhequelle.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SlotDto {
    private String date;
    private String time;
    private  boolean available;
}
