package Egresados.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Egresados.iservice.AvisoIService;
import Egresados.entidades.Aviso;
import Egresados.repository.AvisoRepository;

@Service
public class AvisoService implements AvisoIService {
    @Autowired
    private AvisoRepository avisoRepository;

    public List<Aviso> findAllAvisos() {
        return avisoRepository.findAll();
    }

    public List<Aviso> findByPromocion(Long promocionId) {
        return avisoRepository.findByPromocionId(promocionId);
    }

    public Aviso saveAviso(Aviso aviso) {
        return avisoRepository.save(aviso);
    }

    public Aviso updateAviso(Long id, Aviso aviso) {
        Aviso existente = avisoRepository.findById(id).orElse(null);
        if (existente == null) {
            return null;
        }
        existente.setTitulo(aviso.getTitulo());
        existente.setContenido(aviso.getContenido());
        existente.setFechaPublicacion(aviso.getFechaPublicacion());
        if (aviso.getPromocion() != null) {
            existente.setPromocion(aviso.getPromocion());
        }
        return avisoRepository.save(existente);
    }

    public void deleteAviso(Long id) {
        avisoRepository.deleteById(id);
    }
}