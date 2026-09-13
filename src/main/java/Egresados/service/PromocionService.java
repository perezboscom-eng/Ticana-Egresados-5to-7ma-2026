package Egresados.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Egresados.iservice.PromocionIService;
import Egresados.entidades.Promocion;
import Egresados.repository.PromocionRepository;

@Service
public class PromocionService implements PromocionIService {
    @Autowired
    private PromocionRepository promocionRepository;

    public List<Promocion> findAllPromociones() {
        return promocionRepository.findAll();
    }

    public Promocion findById(Long id) {
        return promocionRepository.findById(id).orElse(null);
    }

    public Promocion savePromocion(Promocion promocion) {
        return promocionRepository.save(promocion);
    }
}