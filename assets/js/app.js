/**
 * ---------------------------------------------------------
 * Archivo principal SPA
 * ---------------------------------------------------------
 */

import { loadNavbar } from './components/navbar.js';
import { router } from './router.js';

/**
 * Navega entre rutas sin recargar.
 *
 * @param {string} url
 */
export function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

/**
 * Inicialización principal.
 */
window.addEventListener('DOMContentLoaded', async () => {
    await loadNavbar();
    router();

    /**
     * Intercepta links SPA
     */
    document.body.addEventListener('click', event => {
        const target = event.target;
        if (target.matches('[data-link]')) {
            event.preventDefault();
            navigateTo(target.href);
        }
    });
});

/**
 * Maneja las acciones de ir atrás/adelante en el navegador navegador
 */
window.addEventListener('popstate', router);