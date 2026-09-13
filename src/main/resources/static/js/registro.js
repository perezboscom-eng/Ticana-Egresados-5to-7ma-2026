document.addEventListener('DOMContentLoaded', async () => {
    if (getUsuarioActual()) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('registroForm');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        const password = document.getElementById('password').value;
        const password2 = document.getElementById('password2').value;

        if (password !== password2) {
            errorMsg.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        const colegio = document.getElementById('colegio').value.trim();
        const anio = parseInt(document.getElementById('anioEgreso').value, 10);

        try {
            const promocionId = await buscarOCrearPromocion(colegio, anio);

            const nuevoUsuario = {
                nombreUsuario: document.getElementById('nombreUsuario').value.trim(),
                password: password,
                nombre: document.getElementById('nombre').value.trim(),
                apellido: document.getElementById('apellido').value.trim(),
                email: document.getElementById('email').value.trim(),
                promocion: { id: promocionId }
            };

            await apiPost('/usuarios', nuevoUsuario);
            alert('¡Cuenta creada! Ahora podés iniciar sesión.');
            window.location.href = 'login.html';
        } catch (err) {
            errorMsg.textContent = 'No se pudo crear la cuenta. Probá con otro usuario.';
        }
    });
});

async function buscarOCrearPromocion(colegio, anio) {
    const promociones = await apiGet('/promociones');

    const existente = promociones.find(p =>
        p.anio === anio &&
        (p.colegio || '').trim().toLowerCase() === colegio.toLowerCase()
    );

    if (existente) return existente.id;

    const nueva = await apiPost('/promociones', {
        nombre: `Promoción ${anio}`,
        anio: anio,
        colegio: colegio
    });

    return nueva.id;
}