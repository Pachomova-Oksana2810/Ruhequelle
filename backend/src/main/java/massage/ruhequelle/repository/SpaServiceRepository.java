package massage.ruhequelle.repository;

import massage.ruhequelle.model.SpaService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpaServiceRepository extends JpaRepository<SpaService, Long> {

    List<SpaService> findByVisibleTrueOrderBySortOrderAsc();

    List<SpaService> findAllByOrderBySortOrderAsc();
}
