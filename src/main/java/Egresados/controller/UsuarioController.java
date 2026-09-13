package Egresados.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Egresados.entidades.Usuario;
import Egresados.iservice.UsuarioIService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioIService usuarioService;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.findAllUsuarios();
    }

    @GetMapping("/promocion/{promocionId}")
    public List<Usuario> getUsuariosByPromocion(@PathVariable Long promocionId) {
        return usuarioService.findByPromocion(promocionId);
    }

    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        return usuarioService.saveUsuario(usuario);
    }

        @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        return usuarioService.login(usuario);
    }

        @PutMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(@PathVariable Long id, @RequestParam String rol, @RequestParam Long adminId) {
        if (!usuarioService.esAdmin(adminId)) {
            return ResponseEntity.status(403).body("No tenés permisos de administrador.");
        }
        Usuario actualizado = usuarioService.cambiarRol(id, rol);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id, @RequestParam Long adminId) {
        if (!usuarioService.esAdmin(adminId)) {
            return ResponseEntity.status(403).body("No tenés permisos de administrador.");
        }
        if (id.equals(adminId)) {
            return ResponseEntity.badRequest().body("No podés eliminar tu propia cuenta de administrador.");
        }
        boolean eliminado = usuarioService.eliminarUsuario(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}