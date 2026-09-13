let usuarioActual = null;
let empresasCache = [];
let categoriaSeleccionada = '';

function labelCategoria(categoria) {
    if (categoria === 'salon') return `${ICONOS.salon} Salón`;
    if (categoria === 'viaje') return `${ICONOS.viajeProveedor} Viaje`;
    if (categoria === 'buzos') return `${ICONOS.buzos} Buzos`;
    if (categoria === 'catering') return `${ICONOS.cena} Catering`;
    return `${ICONOS.otro} Otro`;
}

document.addEventListener('DOMContentLoaded', async () => {
    usuarioActual = exigirSesion();
    if (!usuarioActual) return;

    document.getElementById('saludoUsuario').textContent =
        `Hola, ${usuarioActual.nombre || usuarioActual.nombreUsuario}`;
    document.getElementById('btnLogout').addEventListener('click', cerrarSesion);

    if (esAdmin(usuarioActual)) {
        document.getElementById('linkAdmin').classList.remove('hidden');
    }

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categoriaSeleccionada = btn.dataset.categoria;
            renderEmpresas();
        });
    });

    await cargarEmpresas();
});

async function cargarEmpresas() {
    try {
        empresasCache = await apiGet('/empresas');
        renderEmpresas();
    } catch (err) {
        document.getElementById('empresasGrid').innerHTML =
            '<p class="empty-msg">No se pudieron cargar los proveedores.</p>';
    }
}

function renderEmpresas() {
    const grid = document.getElementById('empresasGrid');
    const filtradas = categoriaSeleccionada
        ? empresasCache.filter(e => e.categoria === categoriaSeleccionada)
        : empresasCache;

    if (!filtradas.length) {
        grid.innerHTML = '<p class="empty-msg">No hay proveedores cargados todavía.</p>';
        return;
    }

    grid.innerHTML = filtradas.map(e => {
        const tags = (e.servicios || '')
            .split(',').map(s => s.trim()).filter(Boolean)
            .map(s => `<span class="tag-pill">${s}</span>`).join('');

        const precio = (e.precioDesde || e.precioHasta)
            ? `${ICONOS.precio} ${(e.precioDesde || 0).toLocaleString('es-AR')} - ${(e.precioHasta || 0).toLocaleString('es-AR')}`
            : '';

        return `
        <div class="empresa-card">
            <div class="empresa-imagen">
                ${e.imagen ? `<img src="img/${e.imagen}" alt="${e.nombre}">` : `${ICONOS.imagen} Sin foto`}
            </div>
            <span class="categoria-badge">${labelCategoria(e.categoria)}</span>
            <h3>${e.nombre}</h3>
            <p>${ICONOS.ubicacion} ${e.ubicacion || 'Sin ubicación'}</p>
            <p>${ICONOS.capacidad} ${e.capacidad || ''}</p>
            <p class="precio">${precio}</p>
            <p>${e.descripcion || ''}</p>
            <div class="tags-servicios">${tags}</div>
        </div>`;
    }).join('');
}