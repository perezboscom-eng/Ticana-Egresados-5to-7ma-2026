package Egresados.iservice;
import java.util.List;
import Egresados.entidades.Promocion;

public interface PromocionIService {
    List<Promocion> findAllPromociones();
    Promocion findById(Long id);
    Promocion savePromocion(Promocion promocion);
}