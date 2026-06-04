import { ticketService } from '../services/ticketService.js';
import { renderTicketCard } from '../components/ticketCard.js';
import { renderTicketForm, setupFormSubmit } from '../components/ticketForm.js';
import { getSession } from '../utils/session.js';

export async function renderClient() {
    const container = document.getElementById('content');
    const session = getSession();

    container.innerHTML = `
        <h2>Dashboard</h2>
        <div id="form-container"></div>
        <h3>Incidences history</h3>
        <div id="tickets-list">Loading your requests...</div>
    `;

    const formContainer = document.getElementById('form-container');
    const listContainer = document.getElementById('tickets-list');

    async function loadDashboard() {
        const allTickets = await ticketService.getAll();
        // Filtrar solo los creados por este cliente
        const myTickets = allTickets.filter(t => t.clienteId == session.id);

        // Formulario de creación limpia para cliente
        formContainer.innerHTML = renderTicketForm(null, null, [], 'client');
        setupFormSubmit(async (data) => {
            const newTicket = {
                name: data.name,
                type: data.type,
                description: data.description,
                status: 'open',
                clienteId: session.id,
                tecnicoId: null // Espera asignación de un admin
            };
            await ticketService.create(newTicket);
            loadDashboard();
        });

        // Listar sus tickets
        listContainer.innerHTML = myTickets.map(ticket => 
            renderTicketCard(ticket, 'client', 
                // Acción Editar (Solo si cumple la regla de negocio)
                (t) => {
                    formContainer.innerHTML = renderTicketForm(async (updatedData) => {
                        await ticketService.update(t.id, { ...t, name: updatedData.name, type: updatedData.type, description: updatedData.description });
                        loadDashboard();
                    }, t, [], 'client');
                    setupFormSubmit(async (updatedData) => {
                        await ticketService.update(t.id, { ...t, name: updatedData.name, type: updatedData.type, description: updatedData.description });
                        loadDashboard();
                    });
                }, 
                null
            )
        ).join('') || '<p>There is not any incidence reported yet.</p>';
    }

    await loadDashboard();
}