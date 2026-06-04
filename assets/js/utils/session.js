import { navigateTo } from '../app.js';

let inactivityTimeout;

export function saveSession(user) {
    localStorage.setItem('user_session', JSON.stringify(user));
    resetInactivityTimer();
}

export function getSession() {
    return JSON.parse(localStorage.getItem('user_session'));
}

export function clearSession() {
    localStorage.removeItem('user_session');
    clearTimeout(inactivityTimeout);
    navigateTo('/login');
}

export function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    if (getSession()) {
        inactivityTimeout = setTimeout(() => {
            alert('Sesión cerrada por inactividad.');
            clearSession();
        }, 5 * 60 * 1000); // 5 minutos
    }
}

// Registrar eventos globales para detectar actividad
['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer);
});