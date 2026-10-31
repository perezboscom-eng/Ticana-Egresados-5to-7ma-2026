# Plataforma para Egresados

Proyecto institucional de Acevedo Castañares, Corvalan, Perez Bosco - MZ-5to-7ma-2026.

Plataforma web para el egreso de una promoción: eventos (viaje, cena, otros), avisos y proveedores (salones, viajes, buzos, catering). Incluye un panel de administración para gestionar todo.

**Tecnologías:** Java 17, Spring Boot, MySQL, HTML/CSS/JS puro.

## Cómo ejecutarlo

1. Instalar Java 17 y MySQL.
2. Crear la base de datos corriendo el script `Egresados_bd.sql` en MySQL.
3. Revisar usuario y contraseña de MySQL en `src/main/resources/application.properties`.
4. Iniciar la aplicación:

   ```
   ./mvnw spring-boot:run
   ```

   En Windows (PowerShell): `.\mvnw.cmd spring-boot:run`

5. Abrir `http://localhost:8081/login.html`.

## Primer administrador

Registrarse desde la web y luego, en MySQL:

    UPDATE Usuario SET rol = 'admin' WHERE nombreUsuario = 'TU_USUARIO';

## Imágenes

Los eventos y proveedores usan imágenes de `src/main/resources/static/img/`. En el panel de administración se escribe el nombre del archivo (por ejemplo `bariloche.webp`). Después de agregar una imagen hay que reiniciar la aplicación.