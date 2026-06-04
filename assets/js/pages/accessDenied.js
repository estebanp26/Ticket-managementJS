import { navigateTo } from '../app.js';

export async function renderAccessDenied() {
    document.getElementById('content').innerHTML = `
        <div class="denied-container" style="text-align: center; margin-top: 50px;">
            <h1 style="color: red;">🔒 Acceso Denegado</h1>
            <p>No tienes los permisos requeridos para visualizar esta sección.</p>
            <button id="btn-denied-back">Volver al Inicio</button>
        </div>
    `;

    document.getElementById('btn-denied-back').addEventListener('click', () => navigateTo('/'));
}