package Egresados.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import Egresados.entidades.Aviso;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByPromocionId(Long promocionId);
}