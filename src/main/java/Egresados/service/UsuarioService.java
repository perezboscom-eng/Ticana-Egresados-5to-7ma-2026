package Egresados.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Egresados.iservice.UsuarioIService;
import Egresados.entidades.Usuario;
import Egresados.repository.UsuarioRepository;

@Service
public class UsuarioService implements UsuarioIService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> findAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> findByPromocion(Long promocionId) {
        return usuarioRepository.findByPromocionId(promocionId);
    }

    public Usuario saveUsuario(Usuario usuario) {
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("alumno");
        }
        return usuarioRepository.save(usuario);
    }

    public boolean esAdmin(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        
        return usuario != null && "admin".equalsIgnoreCase(usuario.getRol());
    }

    public Usuario login(Usuario usuario) {
        return usuarioRepository.findByNombreUsuarioAndPassword(usuario.getNombreUsuario(), usuario.getPassword());
    }

    public List<Usuario> findParticipantes(Long eventoId) {
        return usuarioRepository.findParticipantes(eventoId);
    }

        public Usuario cambiarRol(Long id, String rol) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return null;
        usuario.setRol(rol);
        return usuarioRepository.save(usuario);
    }
        public boolean eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return false;

        if (usuario.getEventosDelUsuario() != null) {
            usuario.getEventosDelUsuario().clear();
            usuarioRepository.save(usuario);
        }

        usuarioRepository.deleteById(id);
        return true;
    }
}