import { renderLogin } from './pages/login.js';
import { renderWelcome } from './pages/welcome.js';
import { renderAdmin } from './pages/admin.js';
import { renderTechnical } from './pages/technical.js';
import { renderClient } from './pages/client.js';
import { renderAccessDenied } from './pages/accessDenied.js';
import { getSession, resetInactivityTimer } from './utils/session.js';

const routes = {
    '/': { render: renderWelcome, roles: ['admin', 'tecnico', 'cliente'] },
    '/login': { render: renderLogin, roles: [] },
    '/admin': { render: renderAdmin, roles: ['admin'] },
    '/tech': { render: renderTechnical, roles: ['tecnico'] },
    '/client': { render: renderClient, roles: ['cliente'] },
    '/denied': { render: renderAccessDenied, roles: [] }
};

function setActiveLink(path) {
    document.querySelectorAll('.navbar a[data-link]').forEach(link => {
        link.classList.remove('active');
        const url = new URL(link.href, window.location.origin);
        if (url.pathname === path) link.classList.add('active');
    });
}

export async function router() {
    const path = window.location.pathname;
    const route = routes[path];
    const container = document.getElementById('content');
    
    container.innerHTML = '';
    setActiveLink(path);
    resetInactivityTimer();

    if (!route) {
        container.innerHTML = `<section><h2>404 - Página no encontrada</h2></section>`;
        return;
    }

    const session = getSession();

    // Redirección si no está autenticado
    if (route.roles.length > 0 && !session) {
        window.history.pushState(null, null, '/login');
        await renderLogin();
        return;
    }

    // Redirección si ya está logueado e intenta ir a /login
    if (path === '/login' && session) {
        const redirectPath = session.role === 'admin' ? '/admin' : session.role === 'tecnico' ? '/tech' : '/client';
        window.history.pushState(null, null, redirectPath);
        await router();
        return;
    }

    // Verificación de Rol (Middleware)
    if (route.roles.length > 0 && !route.roles.includes(session.role)) {
        window.history.pushState(null, null, '/denied');
        await renderAccessDenied();
        return;
    }

    await route.render();
}