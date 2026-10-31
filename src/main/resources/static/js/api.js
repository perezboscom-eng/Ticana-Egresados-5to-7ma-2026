const API_BASE = '/api';

async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`Error ${res.status} al consultar ${path}`);
    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Error ${res.status} al enviar a ${path}`);
    return res.status === 204 ? null : res.json();
}

async function apiPut(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Error ${res.status} al actualizar ${path}`);
    return res.status === 204 ? null : res.json();
}

async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error ${res.status} al eliminar ${path}`);
}

function getUsuarioActual() {
    const raw = localStorage.getItem('usuarioActual');
    return raw ? JSON.parse(raw) : null;
}

function setUsuarioActual(usuario) {
    const { password, ...seguro } = usuario;
    localStorage.setItem('usuarioActual', JSON.stringify(seguro));
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'login.html';
}

function exigirSesion() {
    const usuario = getUsuarioActual();
    if (!usuario) {
        window.location.href = 'login.html';
        return null;
    }
    return usuario;
}

function esAdmin(usuario) {
    return usuario && usuario.rol && usuario.rol.toLowerCase() === 'admin';
}

async function cargarSubtituloPromocion(usuario) {
    const el = document.getElementById('promoSubtitulo');
    if (!el || !usuario || !usuario.promocion || !usuario.promocion.id) return;
    try {
        const promo = await apiGet(`/promociones/${usuario.promocion.id}`);
        const colegio = promo.colegio ? `${promo.colegio} — ` : '';
        el.textContent = `${colegio}${promo.nombre} (${promo.anio})`;
    } catch (err) {
        console.error(err);
    }
}