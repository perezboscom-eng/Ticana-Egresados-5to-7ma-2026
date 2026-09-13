package Egresados.iservice;
import java.util.List;
import Egresados.entidades.Empresa;

public interface EmpresaIService {
    List<Empresa> findAllEmpresas();
    List<Empresa> findByCategoria(String categoria);
    Empresa saveEmpresa(Empresa empresa);
    Empresa updateEmpresa(Long id, Empresa empresa);
    void deleteEmpresa(Long id);
}
