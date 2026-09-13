package Egresados.service;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Egresados.iservice.EventoIService;
import Egresados.entidades.Evento;
import Egresados.entidades.Usuario;
import Egresados.repository.EventoRepository;
import Egresados.repository.UsuarioRepository;

@Service
public class EventoService implements EventoIService {
    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Evento> findAllEventos() {
        return eventoRepository.findAll();
    }

    public List<Evento> findByPromocion(Long promocionId) {
        return eventoRepository.findByPromocionId(promocionId);
    }

    public Evento saveEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    public Evento updateEvento(Long id, Evento evento) {
        Evento existente = eventoRepository.findById(id).orElse(null);
        if (existente == null) {
            return null;
        }
        existente.setTipo(evento.getTipo());
        existente.setNombre(evento.getNombre());
        existente.setFecha(evento.getFecha());
        existente.setLugar(evento.getLugar());
        existente.setPrecio(evento.getPrecio());
        existente.setDescripcion(evento.getDescripcion());
        if (evento.getPromocion() != null) {
            existente.setPromocion(evento.getPromocion());
        }
        return eventoRepository.save(existente);
    }

    public void deleteEvento(Long id) {
        eventoRepository.deleteById(id);
    }

    public Evento inscribirUsuario(Long eventoId, Long usuarioId) {
        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (evento == null || usuario == null) {
            return null;
        }

        List<Evento> eventos = usuario.getEventosDelUsuario();
        if (eventos == null) {
            eventos = new ArrayList<>();
        }

        boolean yaInscripto = false;
        for (Evento e : eventos) {
            if (e.getId().equals(evento.getId())) {
                yaInscripto = true;
                break;
            }
        }
        if (!yaInscripto) {
            eventos.add(evento);
        }

        usuario.setEventosDelUsuario(eventos);
        usuarioRepository.save(usuario);
        return evento;
    }
}