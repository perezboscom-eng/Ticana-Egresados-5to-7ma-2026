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

import Egresados.entidades.Aviso;
import Egresados.iservice.AvisoIService;
import Egresados.iservice.UsuarioIService;

@RestController
@RequestMapping("/api/avisos")
public class AvisoController {
    @Autowired
    private AvisoIService avisoService;

    @Autowired
    private UsuarioIService usuarioService;

    @GetMapping
    public List<Aviso> getAllAvisos() {
        return avisoService.findAllAvisos();
    }

    @GetMapping("/promocion/{promocionId}")
    public List<Aviso> getAvisosByPromocion(@PathVariable Long promocionId) {
        return avisoService.findByPromocion(promocionId);
    }

    @PostMapping
    public Aviso createAviso(@RequestBody Aviso aviso) {
        return avisoService.saveAviso(aviso);
    }

    @PutMapping("/{id}")
    public Aviso updateAviso(@PathVariable Long id, @RequestBody Aviso aviso, @RequestParam Long adminId) {
        if (!usuarioService.esAdmin(adminId)) {
            return null;
        }
        return avisoService.updateAviso(id, aviso);
    }

    @DeleteMapping("/{id}")
    public void deleteAviso(@PathVariable Long id, @RequestParam Long adminId) {
        if (usuarioService.esAdmin(adminId)) {
            avisoService.deleteAviso(id);
        }
    }
}