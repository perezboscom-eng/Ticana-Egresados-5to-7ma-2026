package Egresados.iservice;
import java.util.List;
import Egresados.entidades.Usuario;

public interface UsuarioIService {
    List<Usuario> findAllUsuarios();
    List<Usuario> findByPromocion(Long promocionId);
    Usuario saveUsuario(Usuario usuario);
    Usuario login(Usuario usuario);
    boolean esAdmin(Long usuarioId);
    List<Usuario> findParticipantes(Long eventoId);
    Usuario cambiarRol(Long id, String rol);
    boolean eliminarUsuario(Long id);
}