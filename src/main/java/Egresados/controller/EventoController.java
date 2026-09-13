package Egresados.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Egresados.entidades.Evento;
import Egresados.entidades.Usuario;
import Egresados.iservice.EventoIService;
import Egresados.iservice.UsuarioIService;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {
    @Autowired
    private EventoIService eventoService;

    @Autowired
    private UsuarioIService usuarioService;

    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoService.findAllEventos();
    }

    @GetMapping("/promocion/{promocionId}")
    public List<Evento> getEventosByPromocion(@PathVariable Long promocionId) {
        return eventoService.findByPromocion(promocionId);
    }

    @PostMapping
    public Evento createEvento(@RequestBody Evento evento) {
        return eventoService.saveEvento(evento);
    }

    @PutMapping("/{id}")
    public Evento updateEvento(@PathVariable Long id, @RequestBody Evento evento, @RequestParam Long adminId) {
        if (!usuarioService.esAdmin(adminId)) {
            return null;
        }
        return eventoService.updateEvento(id, evento);
    }

    @DeleteMapping("/{id}")
    public void deleteEvento(@PathVariable Long id, @RequestParam Long adminId) {
        if (usuarioService.esAdmin(adminId)) {
            eventoService.deleteEvento(id);
        }
    }

    @PostMapping("/{eventoId}/inscribir/{usuarioId}")
    public Evento inscribirUsuario(@PathVariable Long eventoId, @PathVariable Long usuarioId) {
        return eventoService.inscribirUsuario(eventoId, usuarioId);
    }

    @GetMapping("/{eventoId}/participantes")
    public List<Usuario> getParticipantes(@PathVariable Long eventoId) {
        return usuarioService.findParticipantes(eventoId);
    }
}