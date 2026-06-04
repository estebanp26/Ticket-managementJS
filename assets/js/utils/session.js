import { navigateTo } from '../app.js';
import { setItem, getItem, removeItem } from './storage.js';

let inactivityTimeout;

export function saveSession(user) {
    setItem('user_session', user);
    resetInactivityTimer();
}

export function getSession() {
    return getItem('user_session');
}

export function clearSession() {
    removeItem('user_session');
    clearTimeout(inactivityTimeout);
    navigateTo('/login');
}

export function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    if (getSession()) {
        inactivityTimeout = setTimeout(() => {
            alert('Sesión cerrada por inactividad.');
            clearSession();
        }, 5 * 60 * 1000);
    }
}

['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer);
});