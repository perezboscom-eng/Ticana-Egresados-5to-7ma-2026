package Egresados.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Egresados.iservice.EmpresaIService;
import Egresados.entidades.Empresa;
import Egresados.repository.EmpresaRepository;

@Service
public class EmpresaService implements EmpresaIService {
    @Autowired
    private EmpresaRepository empresaRepository;

    public List<Empresa> findAllEmpresas() {
        return empresaRepository.findAll();
    }

    public List<Empresa> findByCategoria(String categoria) {
        return empresaRepository.findByCategoria(categoria);
    }

    public Empresa saveEmpresa(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    public Empresa updateEmpresa(Long id, Empresa empresa) {
        Empresa existente = empresaRepository.findById(id).orElse(null);
        if (existente == null) {
            return null;
        }
        existente.setCategoria(empresa.getCategoria());
        existente.setNombre(empresa.getNombre());
        existente.setUbicacion(empresa.getUbicacion());
        existente.setCapacidad(empresa.getCapacidad());
        existente.setPrecioDesde(empresa.getPrecioDesde());
        existente.setPrecioHasta(empresa.getPrecioHasta());
        existente.setDescripcion(empresa.getDescripcion());
        existente.setServicios(empresa.getServicios());
        existente.setImagen(empresa.getImagen());
        return empresaRepository.save(existente);
    }

    public void deleteEmpresa(Long id) {
        empresaRepository.deleteById(id);
    }
}
