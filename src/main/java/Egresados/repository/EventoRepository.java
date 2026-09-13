package Egresados.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import Egresados.entidades.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByPromocionId(Long promocionId);
}