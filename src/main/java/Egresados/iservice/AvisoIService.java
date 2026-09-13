package Egresados.iservice;
import java.util.List;
import Egresados.entidades.Aviso;

public interface AvisoIService {
    List<Aviso> findAllAvisos();
    List<Aviso> findByPromocion(Long promocionId);
    Aviso saveAviso(Aviso aviso);
    Aviso updateAviso(Long id, Aviso aviso);
    void deleteAviso(Long id);
}