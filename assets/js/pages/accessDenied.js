import { navigateTo } from '../app.js';

export async function renderAccessDenied() {
    document.getElementById('content').innerHTML = `
        <div class="denied-container" style="text-align: center; margin-top: 50px;">
            <h1 style="color: red;">Access Denied</h1>
            <p>You do not have the required permissions to view this section.</p>
            <button id="btn-denied-back">Back to Home</button>
        </div>
    `;

    document.getElementById('btn-denied-back').addEventListener('click', () => navigateTo('/'));
}