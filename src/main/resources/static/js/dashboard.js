let usuarioActual = null;
let avisosCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    usuarioActual = exigirSesion();
    if (!usuarioActual) return;

    document.getElementById('saludoUsuario').textContent =
        `Hola, ${usuarioActual.nombre || usuarioActual.nombreUsuario}`;
    document.getElementById('btnLogout').addEventListener('click', cerrarSesion);

    if (esAdmin(usuarioActual)) {
        document.getElementById('linkAdmin').classList.remove('hidden');
        document.getElementById('btnNuevoAviso').classList.remove('hidden');
        document.getElementById('btnNuevoAviso').addEventListener('click', crearAvisoRapido);
    }

    await cargarPromocion();
    await cargarAvisos();
});

async function cargarPromocion() {
    if (!usuarioActual.promocion || !usuarioActual.promocion.id) return;
    try {
        const promo = await apiGet(`/promociones/${usuarioActual.promocion.id}`);
        const subtitulo = document.getElementById('promoSubtitulo');
        if (subtitulo) {
            const colegio = promo.colegio ? `${promo.colegio} — ` : '';
            subtitulo.textContent = `${colegio}${promo.nombre} (${promo.anio})`;
        }
    } catch (err) {
        console.error(err);
    }
}

/* ---------- AVISOS ---------- */

async function cargarAvisos() {
    const contenedor = document.getElementById('avisosList');
    try {
        const promoId = usuarioActual.promocion ? usuarioActual.promocion.id : null;
        avisosCache = promoId
            ? await apiGet(`/avisos/promocion/${promoId}`)
            : await apiGet('/avisos');
        renderAvisos();
    } catch (err) {
        contenedor.innerHTML = '<p class="empty-msg">No se pudieron cargar los avisos.</p>';
    }
}

function renderAvisos() {
    const contenedor = document.getElementById('avisosList');
    if (!avisosCache.length) {
        contenedor.innerHTML = '<p class="empty-msg">Todavía no hay avisos publicados.</p>';
        return;
    }

    const admin = esAdmin(usuarioActual);

    contenedor.innerHTML = avisosCache.map(a => `
        <div class="aviso-item">
            <h3>${a.titulo}</h3>
            <p>${a.contenido}</p>
            <small>${a.fechaPublicacion || ''}</small>
            ${admin ? `
                <div class="acciones-admin">
                    <button class="btn-editar" onclick="editarAvisoRapido(${a.id})">${ICONOS.editar} Editar</button>
                    <button class="btn-eliminar" onclick="eliminarAvisoRapido(${a.id})">${ICONOS.eliminar} Eliminar</button>
                </div>` : ''}
        </div>
    `).join('');
}

async function crearAvisoRapido() {
    const titulo = prompt('Título del aviso:');
    if (!titulo) return;
    const contenido = prompt('Contenido del aviso:');
    if (!contenido) return;
    const fechaPublicacion = prompt('Fecha (dd/mm/aaaa):', new Date().toLocaleDateString('es-AR'));

    const promoId = usuarioActual.promocion ? usuarioActual.promocion.id : null;
    try {
        await apiPost('/avisos', { titulo, contenido, fechaPublicacion, promocion: promoId ? { id: promoId } : null });
        await cargarAvisos();
    } catch (err) {
        alert('No se pudo crear el aviso.');
    }
}

async function editarAvisoRapido(id) {
    const aviso = avisosCache.find(a => a.id === id);
    if (!aviso) return;

    const titulo = prompt('Título:', aviso.titulo);
    if (titulo === null) return;
    const contenido = prompt('Contenido:', aviso.contenido);
    if (contenido === null) return;

    try {
        await apiPut(`/avisos/${id}?adminId=${usuarioActual.id}`, {
            titulo, contenido, fechaPublicacion: aviso.fechaPublicacion,
            promocion: aviso.promocion
        });
        await cargarAvisos();
    } catch (err) {
        alert('No se pudo editar el aviso.');
    }
}

async function eliminarAvisoRapido(id) {
    if (!confirm('¿Eliminar este aviso?')) return;
    try {
        await apiDelete(`/avisos/${id}?adminId=${usuarioActual.id}`);
        await cargarAvisos();
    } catch (err) {
        alert('No se pudo eliminar el aviso.');
    }
}