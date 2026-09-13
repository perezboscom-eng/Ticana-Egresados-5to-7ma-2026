package Egresados.iservice;
import java.util.List;
import Egresados.entidades.Evento;

public interface EventoIService {
    List<Evento> findAllEventos();
    List<Evento> findByPromocion(Long promocionId);
    Evento saveEvento(Evento evento);
    Evento updateEvento(Long id, Evento evento);
    void deleteEvento(Long id);
    Evento inscribirUsuario(Long eventoId, Long usuarioId);
}