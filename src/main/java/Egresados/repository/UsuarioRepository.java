package Egresados.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import Egresados.entidades.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByPromocionId(Long promocionId);
    Usuario findByNombreUsuarioAndPassword(String nombreUsuario, String password);

    @Query("SELECT u FROM Usuario u JOIN u.EventosDelUsuario e WHERE e.id = :eventoId")
    List<Usuario> findParticipantes(@Param("eventoId") Long eventoId);
}