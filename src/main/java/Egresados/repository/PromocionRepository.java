package Egresados.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import Egresados.entidades.Promocion;

public interface PromocionRepository extends JpaRepository<Promocion, Long> {
}