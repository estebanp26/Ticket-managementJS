import { getSession } from '../utils/session.js';
import { navigateTo } from '../app.js';

export async function renderWelcome() {
    const container = document.getElementById('content');
    const session = getSession();

    container.innerHTML = `
        <div class="welcome-container">
            <h1>Sistema de Gestión de Tickets</h1>
            <p>Bienvenido a la plataforma de soporte técnico.</p>
            ${!session ? '<button id="btn-goto-login">Ir al Login</button>' : '<button id="btn-goto-dash">Ir a mi Panel</button>'}
        </div>
    `;

    if (!session) {
        document.getElementById('btn-goto-login').addEventListener('click', () => navigateTo('/login'));
    } else {
        document.getElementById('btn-goto-dash').addEventListener('click', () => {
            const path = session.role === 'admin' ? '/admin' : session.role === 'tecnico' ? '/tech' : '/client';
            navigateTo(path);
        });
    }
}