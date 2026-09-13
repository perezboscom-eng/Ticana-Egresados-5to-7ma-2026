package Egresados.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import Egresados.entidades.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    List<Empresa> findByCategoria(String categoria);
}