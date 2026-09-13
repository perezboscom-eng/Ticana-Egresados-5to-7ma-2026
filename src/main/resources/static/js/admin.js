let usuarioActual = null;

document.addEventListener('DOMContentLoaded', async () => {
    usuarioActual = exigirSesion();
    if (!usuarioActual) return;

    if (!esAdmin(usuarioActual)) {
        alert('No tenés permisos de administrador.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('btnLogout').addEventListener('click', cerrarSesion);

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    document.getElementById('eventoForm').addEventListener('submit', guardarEvento);
    document.getElementById('avisoForm').addEventListener('submit', guardarAviso);
    document.getElementById('empresaForm').addEventListener('submit', guardarEmpresa);

    document.getElementById('btnCancelarEvento').addEventListener('click', resetEventoForm);
    document.getElementById('btnCancelarAviso').addEventListener('click', resetAvisoForm);
    document.getElementById('btnCancelarEmpresa').addEventListener('click', resetEmpresaForm);

    await cargarEventosAdmin();
    await cargarAvisosAdmin();
    await cargarEmpresasAdmin();
    await cargarUsuariosAdmin();
});

function promocionIdActual() {
    return usuarioActual.promocion ? usuarioActual.promocion.id : null;
}

/* ---------- EVENTOS ---------- */

async function cargarEventosAdmin() {
    const promoId = promocionIdActual();
    const eventos = promoId ? await apiGet(`/eventos/promocion/${promoId}`) : await apiGet('/eventos');
    const tbody = document.getElementById('eventosTableBody');
    tbody.innerHTML = eventos.map(e => `
        <tr>
            <td>${e.tipo}</td>
            <td>${e.nombre}</td>
            <td>${e.fecha || ''}</td>
            <td>${e.lugar || ''}</td>
            <td>${e.precio ?? ''}</td>
            <td>
                <button class="btn-editar" onclick="editarEvento(${e.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEvento(${e.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
    window._eventosAdmin = eventos;
}

function editarEvento(id) {
    const evento = window._eventosAdmin.find(e => e.id === id);
    if (!evento) return;
    document.getElementById('eventoId').value = evento.id;
    document.getElementById('eventoTipo').value = evento.tipo;
    document.getElementById('eventoNombre').value = evento.nombre;
    document.getElementById('eventoFecha').value = evento.fecha || '';
    document.getElementById('eventoLugar').value = evento.lugar || '';
    document.getElementById('eventoPrecio').value = evento.precio ?? '';
    document.getElementById('eventoImagen').value = evento.imagen || '';
    document.getElementById('eventoDescripcion').value = evento.descripcion || '';
}

function resetEventoForm() {
    document.getElementById('eventoForm').reset();
    document.getElementById('eventoId').value = '';
}

async function guardarEvento(e) {
    e.preventDefault();
    const id = document.getElementById('eventoId').value;
    const promoId = promocionIdActual();

    const evento = {
        tipo: document.getElementById('eventoTipo').value,
        nombre: document.getElementById('eventoNombre').value,
        fecha: document.getElementById('eventoFecha').value,
        lugar: document.getElementById('eventoLugar').value,
        precio: parseFloat(document.getElementById('eventoPrecio').value) || 0,
        imagen: document.getElementById('eventoImagen').value,
        descripcion: document.getElementById('eventoDescripcion').value,
        promocion: promoId ? { id: promoId } : null
    };

    try {
        if (id) {
            await apiPut(`/eventos/${id}?adminId=${usuarioActual.id}`, evento);
        } else {
            await apiPost('/eventos', evento);
        }
        resetEventoForm();
        await cargarEventosAdmin();
    } catch (err) {
        alert('No se pudo guardar el evento.');
    }
}

async function eliminarEvento(id) {
    if (!confirm('¿Eliminar este evento?')) return;
    try {
        await apiDelete(`/eventos/${id}?adminId=${usuarioActual.id}`);
        await cargarEventosAdmin();
    } catch (err) {
        alert('No se pudo eliminar el evento.');
    }
}

/* ---------- AVISOS ---------- */

async function cargarAvisosAdmin() {
    const promoId = promocionIdActual();
    const avisos = promoId ? await apiGet(`/avisos/promocion/${promoId}`) : await apiGet('/avisos');
    const tbody = document.getElementById('avisosTableBody');
    tbody.innerHTML = avisos.map(a => `
        <tr>
            <td>${a.titulo}</td>
            <td>${a.contenido}</td>
            <td>${a.fechaPublicacion || ''}</td>
            <td>
                <button class="btn-editar" onclick="editarAviso(${a.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarAviso(${a.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
    window._avisosAdmin = avisos;
}

function editarAviso(id) {
    const aviso = window._avisosAdmin.find(a => a.id === id);
    if (!aviso) return;
    document.getElementById('avisoId').value = aviso.id;
    document.getElementById('avisoTitulo').value = aviso.titulo;
    document.getElementById('avisoContenido').value = aviso.contenido;
    document.getElementById('avisoFecha').value = aviso.fechaPublicacion || '';
}

function resetAvisoForm() {
    document.getElementById('avisoForm').reset();
    document.getElementById('avisoId').value = '';
}

async function guardarAviso(e) {
    e.preventDefault();
    const id = document.getElementById('avisoId').value;
    const promoId = promocionIdActual();

    const aviso = {
        titulo: document.getElementById('avisoTitulo').value,
        contenido: document.getElementById('avisoContenido').value,
        fechaPublicacion: document.getElementById('avisoFecha').value,
        promocion: promoId ? { id: promoId } : null
    };

    try {
        if (id) {
            await apiPut(`/avisos/${id}?adminId=${usuarioActual.id}`, aviso);
        } else {
            await apiPost('/avisos', aviso);
        }
        resetAvisoForm();
        await cargarAvisosAdmin();
    } catch (err) {
        alert('No se pudo guardar el aviso.');
    }
}

async function eliminarAviso(id) {
    if (!confirm('¿Eliminar este aviso?')) return;
    try {
        await apiDelete(`/avisos/${id}?adminId=${usuarioActual.id}`);
        await cargarAvisosAdmin();
    } catch (err) {
        alert('No se pudo eliminar el aviso.');
    }
}

/* ---------- EMPRESAS / PROVEEDORES ---------- */

async function cargarEmpresasAdmin() {
    const empresas = await apiGet('/empresas');
    const tbody = document.getElementById('empresasTableBody');
    tbody.innerHTML = empresas.map(emp => `
        <tr>
            <td>${emp.categoria}</td>
            <td>${emp.nombre}</td>
            <td>${emp.ubicacion || ''}</td>
            <td>${emp.precioDesde ?? ''} - ${emp.precioHasta ?? ''}</td>
            <td>
                <button class="btn-editar" onclick="editarEmpresa(${emp.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEmpresa(${emp.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
    window._empresasAdmin = empresas;
}

function editarEmpresa(id) {
    const empresa = window._empresasAdmin.find(e => e.id === id);
    if (!empresa) return;
    document.getElementById('empresaId').value = empresa.id;
    document.getElementById('empresaCategoria').value = empresa.categoria;
    document.getElementById('empresaNombre').value = empresa.nombre;
    document.getElementById('empresaUbicacion').value = empresa.ubicacion || '';
    document.getElementById('empresaCapacidad').value = empresa.capacidad || '';
    document.getElementById('empresaPrecioDesde').value = empresa.precioDesde ?? '';
    document.getElementById('empresaPrecioHasta').value = empresa.precioHasta ?? '';
    document.getElementById('empresaImagen').value = empresa.imagen || '';
    document.getElementById('empresaServicios').value = empresa.servicios || '';
    document.getElementById('empresaDescripcion').value = empresa.descripcion || '';
}

function resetEmpresaForm() {
    document.getElementById('empresaForm').reset();
    document.getElementById('empresaId').value = '';
}

async function guardarEmpresa(e) {
    e.preventDefault();
    const id = document.getElementById('empresaId').value;

    const empresa = {
        categoria: document.getElementById('empresaCategoria').value,
        nombre: document.getElementById('empresaNombre').value,
        ubicacion: document.getElementById('empresaUbicacion').value,
        capacidad: document.getElementById('empresaCapacidad').value,
        precioDesde: parseFloat(document.getElementById('empresaPrecioDesde').value) || 0,
        precioHasta: parseFloat(document.getElementById('empresaPrecioHasta').value) || 0,
        imagen: document.getElementById('empresaImagen').value,
        servicios: document.getElementById('empresaServicios').value,
        descripcion: document.getElementById('empresaDescripcion').value
    };

    try {
        if (id) {
            await apiPut(`/empresas/${id}?adminId=${usuarioActual.id}`, empresa);
        } else {
            await apiPost(`/empresas?adminId=${usuarioActual.id}`, empresa);
        }
        resetEmpresaForm();
        await cargarEmpresasAdmin();
    } catch (err) {
        alert('No se pudo guardar el proveedor.');
    }
}

async function eliminarEmpresa(id) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try {
        await apiDelete(`/empresas/${id}?adminId=${usuarioActual.id}`);
        await cargarEmpresasAdmin();
    } catch (err) {
        alert('No se pudo eliminar el proveedor.');
    }
}

function previsualizarImagen(idCampo, idPreview) {
    const nombreArchivo = document.getElementById(idCampo).value.trim();
    const preview = document.getElementById(idPreview);

    if (!nombreArchivo) {
        preview.innerHTML = '';
        return;
    }

    const img = new Image();
    img.onload = () => {
        preview.innerHTML = `<img src="img/${nombreArchivo}" style="max-width:120px;max-height:90px;display:block;margin-top:6px;border-radius:6px;">`;
    };
    img.onerror = () => {
        preview.innerHTML = '⚠️ No se encontró ese archivo en la carpeta img ).';
        preview.style.color = '#b3392f';
    };
    img.src = `img/${nombreArchivo}`;
}

async function cargarUsuariosAdmin() {
    const usuarios = await apiGet('/usuarios');
    const tbody = document.getElementById('usuariosTableBody');

    tbody.innerHTML = usuarios.map(u => {
        const promo = u.promocion
            ? `${u.promocion.colegio ? u.promocion.colegio + ' - ' : ''}${u.promocion.nombre} (${u.promocion.anio})`
            : 'Sin promoción';
        const esAdminUsuario = (u.rol || '').toLowerCase() === 'admin';
        const esUnoMismo = u.id === usuarioActual.id;

        return `
        <tr>
            <td>${u.nombre} ${u.apellido}</td>
            <td>${u.nombreUsuario}</td>
            <td>${promo}</td>
            <td>${u.rol || 'alumno'}</td>
            <td>
                ${esAdminUsuario
                    ? `<button class="btn-eliminar" onclick="cambiarRolUsuario(${u.id}, 'alumno')">Quitar admin</button>`
                    : `<button class="btn-editar" onclick="cambiarRolUsuario(${u.id}, 'admin')">Hacer admin</button>`}
                ${esUnoMismo
                    ? ''
                    : `<button class="btn-eliminar" onclick="eliminarUsuarioAdmin(${u.id})">Eliminar</button>`}
            </td>
        </tr>`;
    }).join('');
}

async function cambiarRolUsuario(id, nuevoRol) {
    if (!confirm(`¿Seguro que querés cambiar el rol de este usuario a "${nuevoRol}"?`)) return;
    try {
        await apiPut(`/usuarios/${id}/rol?rol=${nuevoRol}&adminId=${usuarioActual.id}`, {});
        await cargarUsuariosAdmin();
    } catch (err) {
        alert('No se pudo cambiar el rol.');
    }
}

async function eliminarUsuarioAdmin(id) {
    if (!confirm('¿Seguro que querés eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
        await apiDelete(`/usuarios/${id}?adminId=${usuarioActual.id}`);
        await cargarUsuariosAdmin();
    } catch (err) {
        alert('No se pudo eliminar el usuario.');
    }
}