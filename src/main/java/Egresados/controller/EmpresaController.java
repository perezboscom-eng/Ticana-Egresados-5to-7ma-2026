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

import Egresados.entidades.Empresa;
import Egresados.iservice.EmpresaIService;
import Egresados.iservice.UsuarioIService;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {
    @Autowired
    private EmpresaIService empresaService;

    @Autowired
    private UsuarioIService usuarioService;

    @GetMapping
    public List<Empresa> getAllEmpresas() {
        return empresaService.findAllEmpresas();
    }

    @GetMapping("/categoria/{categoria}")
    public List<Empresa> getEmpresasByCategoria(@PathVariable String categoria) {
        return empresaService.findByCategoria(categoria);
    }

    @PostMapping
    public Empresa createEmpresa(@RequestBody Empresa empresa, @RequestParam Long adminId) {
        if (!usuarioService.esAdmin(adminId)) {
            return null;
        }
        return empresaService.saveEmpresa(empresa);
    }

    @PutMapping("/{id}")
    public Empresa updateEmpresa(@PathVariable Long id, @RequestBody Empresa empresa, @RequestParam Long adminId) {
        if (!usuarioService.esAdmin(adminId)) {
            return null;
        }
        return empresaService.updateEmpresa(id, empresa);
    }

    @DeleteMapping("/{id}")
    public void deleteEmpresa(@PathVariable Long id, @RequestParam Long adminId) {
        if (usuarioService.esAdmin(adminId)) {
            empresaService.deleteEmpresa(id);
        }
    }
}