import { getSession } from "../utils/session.js";
import { authService } from "../services/authService.js";

export async function loadNavbar() {
    const navbar = document.getElementById("navbar");
    const session = getSession();

    let navLinks = "<h1>RIWI Technical support</h1>";

    if (session) {
        if (session.role === "admin")
            navLinks += `<a href="/admin" data-link>Admin Panel</a>`;
        if (session.role === "tech")
            navLinks += `<a href="/tech" data-link>Technical Panel</a>`;
        if (session.role === "client")
            navLinks += `<a href="/client" data-link>Mis Tickets (Cliente)</a>`;

        // Close Session button
        navLinks += `<button id="btn-logout" style="margin-left: 15px;">Close session (${session.username})</button>`;
    } else {
        navLinks += `<a href="/login" data-link>Login</a>`;
    }

    navbar.innerHTML = `<nav class="navbar">${navLinks}</nav>`;

    // Assign the event to the button if it exist in the DOM
    if (session) {
        document.getElementById("btn-logout").addEventListener("click", () => {
            authService.logout();
            loadNavbar();
        });
    }
}
