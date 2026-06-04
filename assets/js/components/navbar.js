import { getSession } from '../utils/session.js';
import { authService } from '../services/authService.js';

export async function loadNavbar() {
    const navbar = document.getElementById('navbar');
    const session = getSession();

    let navLinks = `<a href="/" data-link>Inicio</a>`;

    if (session) {
        if (session.role === 'admin') navLinks += `<a href="/admin" data-link>Admin Panel</a>`;
        if (session.role === 'tecnico') navLinks += `<a href="/tech" data-link>Mis Tickets (Técnico)</a>`;
        if (session.role === 'cliente') navLinks += `<a href="/client" data-link>Mis Tickets (Cliente)</a>`;
        
        // BOTÓN DE CERRAR SESIÓN
        navLinks += `<button id="btn-logout" style="margin-left: 15px;">Cerrar Sesión (${session.username})</button>`;
    } else {
        navLinks += `<a href="/login" data-link>Login</a>`;
    }

    navbar.innerHTML = `<nav class="navbar">${navLinks}</nav>`;

    // Asignar el evento al botón si existe en el DOM
    if (session) {
        document.getElementById('btn-logout').addEventListener('click', () => {
            authService.logout(); // Esto limpia la sesión y redirige a /login
            loadNavbar();         // Redibuja el navbar sin el botón de logout
        });
    }
}