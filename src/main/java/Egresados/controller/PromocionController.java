package Egresados.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Egresados.entidades.Promocion;
import Egresados.iservice.PromocionIService;

@RestController
@RequestMapping("/api/promociones")
public class PromocionController {
    @Autowired
    private PromocionIService promocionService;

    @GetMapping
    public List<Promocion> getAllPromociones() {
        return promocionService.findAllPromociones();
    }

    @GetMapping("/{id}")
    public Promocion getPromocionById(@PathVariable Long id) {
        return promocionService.findById(id);
    }

    @PostMapping
    public Promocion createPromocion(@RequestBody Promocion promocion) {
        return promocionService.savePromocion(promocion);
    }
}