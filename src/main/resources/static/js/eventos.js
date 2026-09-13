let usuarioActual = null;
let eventosCache = [];
let tipoSeleccionado = '';

document.addEventListener('DOMContentLoaded', async () => {
    usuarioActual = exigirSesion();
    if (!usuarioActual) return;

    document.getElementById('saludoUsuario').textContent =
        `Hola, ${usuarioActual.nombre || usuarioActual.nombreUsuario}`;
    document.getElementById('btnLogout').addEventListener('click', cerrarSesion);

    if (esAdmin(usuarioActual)) {
        document.getElementById('linkAdmin').classList.remove('hidden');
        document.getElementById('btnNuevoEvento').classList.remove('hidden');
        document.getElementById('btnNuevoEvento').addEventListener('click', crearEventoRapido);
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tipoSeleccionado = btn.dataset.tipo;
            renderEventos();
        });
    });

    await cargarEventos();
});

function labelTipo(tipo) {
    if (tipo === 'viaje') return `${ICONOS.viaje} Viaje de egresados`;
    if (tipo === 'cena') return `${ICONOS.cena} Cena de egresados`;
    return `${ICONOS.otro} Otro evento`;
}

async function cargarEventos() {
    try {
        const promoId = usuarioActual.promocion ? usuarioActual.promocion.id : null;
        eventosCache = promoId
            ? await apiGet(`/eventos/promocion/${promoId}`)
            : await apiGet('/eventos');
        renderEventos();
    } catch (err) {
        document.getElementById('eventosGrid').innerHTML =
            '<p class="empty-msg">No se pudieron cargar los eventos.</p>';
    }
}

function renderEventos() {
    const grid = document.getElementById('eventosGrid');
    const filtrados = tipoSeleccionado
        ? eventosCache.filter(e => e.tipo === tipoSeleccionado)
        : eventosCache;

    if (!filtrados.length) {
        grid.innerHTML = '<p class="empty-msg">No hay eventos para mostrar.</p>';
        return;
    }

    const admin = esAdmin(usuarioActual);

    grid.innerHTML = filtrados.map(e => `
        <div class="evento-card">
            <div class="evento-imagen">
                ${e.imagen ? `<img src="img/${e.imagen}" alt="${e.nombre}">` : `${ICONOS.imagen} Imagen del lugar`}
            </div>
            <h3>${labelTipo(e.tipo)}</h3>
            <p><strong>${e.nombre}</strong></p>
            <p>${ICONOS.calendario} ${e.fecha || 'A confirmar'}</p>
            <p>${ICONOS.ubicacion} ${e.lugar || 'A confirmar'}</p>
            <p class="precio">${ICONOS.precio} ${e.precio ? e.precio.toLocaleString('es-AR') : 'Gratis'}</p>
            <p>${e.descripcion || ''}</p>
            <div class="acciones">
                <button class="btn-inscribirse" onclick="inscribirme(${e.id})">Anotarme</button>
                ${admin ? `
                    <button class="btn-editar" onclick="editarEventoRapido(${e.id})">${ICONOS.editar} Editar</button>
                    <button class="btn-eliminar" onclick="eliminarEventoRapido(${e.id})">${ICONOS.eliminar} Eliminar</button>
                ` : ''}
            </div>
            <ul class="participantes-list" id="participantes-${e.id}"></ul>
        </div>
    `).join('');
}

async function inscribirme(eventoId) {
    try {
        await apiPost(`/eventos/${eventoId}/inscribir/${usuarioActual.id}`, {});
        alert('¡Te anotaste correctamente!');
        verParticipantes(eventoId);
    } catch (err) {
        alert('No se pudo completar la inscripción.');
    }
}

async function verParticipantes(eventoId) {
    try {
        const participantes = await apiGet(`/eventos/${eventoId}/participantes`);
        const ul = document.getElementById(`participantes-${eventoId}`);
        if (!ul) return;
        ul.innerHTML = participantes.map(u => `<li>${u.nombre} ${u.apellido}</li>`).join('');
    } catch (err) {
        console.error(err);
    }
}

async function crearEventoRapido() {
    const tipo = prompt('Tipo (viaje / cena / otro):', 'otro');
    if (!tipo) return;
    const nombre = prompt('Nombre del evento:');
    if (!nombre) return;
    const fecha = prompt('Fecha (dd/mm/aaaa):');
    const lugar = prompt('Lugar:');
    const precio = parseFloat(prompt('Precio:', '0')) || 0;
    const descripcion = prompt('Descripción:');

    const promoId = usuarioActual.promocion ? usuarioActual.promocion.id : null;
    try {
        await apiPost('/eventos', {
            tipo, nombre, fecha, lugar, precio, descripcion,
            promocion: promoId ? { id: promoId } : null
        });
        await cargarEventos();
    } catch (err) {
        alert('No se pudo crear el evento.');
    }
}

async function editarEventoRapido(id) {
    const evento = eventosCache.find(e => e.id === id);
    if (!evento) return;

    const nombre = prompt('Nombre:', evento.nombre);
    if (nombre === null) return;
    const fecha = prompt('Fecha:', evento.fecha || '');
    const lugar = prompt('Lugar:', evento.lugar || '');
    const precio = parseFloat(prompt('Precio:', evento.precio ?? 0)) || 0;
    const descripcion = prompt('Descripción:', evento.descripcion || '');

    try {
        await apiPut(`/eventos/${id}?adminId=${usuarioActual.id}`, {
            tipo: evento.tipo, nombre, fecha, lugar, precio, descripcion,
            imagen: evento.imagen, promocion: evento.promocion
        });
        await cargarEventos();
    } catch (err) {
        alert('No se pudo editar el evento.');
    }
}

async function eliminarEventoRapido(id) {
    if (!confirm('¿Eliminar este evento?')) return;
    try {
        await apiDelete(`/eventos/${id}?adminId=${usuarioActual.id}`);
        await cargarEventos();
    } catch (err) {
        alert('No se pudo eliminar el evento.');
    }
}