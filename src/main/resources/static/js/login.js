document.addEventListener('DOMContentLoaded', () => {
    if (getUsuarioActual()) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombreUsuario, password })
            });

            const usuario = await res.json();

            if (!usuario) {
                errorMsg.textContent = 'Usuario o contraseña incorrectos.';
                return;
            }

            setUsuarioActual(usuario);
            window.location.href = 'index.html';
        } catch (err) {
            errorMsg.textContent = 'No se pudo conectar con el servidor.';
        }
    });
});