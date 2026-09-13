package Egresados.entidades;
import jakarta.persistence.*;

@Entity
public class Promocion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private int anio;
    private String colegio;

    public Promocion() {
    }

    public Promocion(String nombre, int anio) {
        this.nombre = nombre;
        this.anio = anio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getAnio() {
        return anio;
    }

    public void setAnio(int anio) {
        this.anio = anio;
    }

    public String getColegio() {
        return colegio;
    }
    public void setColegio(String colegio) {
        this.colegio = colegio;
    }

}
