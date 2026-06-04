import { ticketService } from '../services/ticketService.js';
import { renderTicketCard } from '../components/ticketCard.js';
import { renderTicketForm, setupFormSubmit } from '../components/ticketForm.js';
import { getSession } from '../utils/session.js';

export async function renderTechnical() {
    const container = document.getElementById('content');
    const session = getSession();

    container.innerHTML = `
        <h2>Technical Panel</h2>
        <div id="form-container"></div>
        <h3>My Assigned Tickets</h3>
        <div id="tickets-list">Loading your tickets...</div>
    `;

    const formContainer = document.getElementById('form-container');
    const listContainer = document.getElementById('tickets-list');

    async function loadDashboard() {
        const allTickets = await ticketService.getAll();
        // Filtrar solo los asignados a este técnico
        const myTickets = allTickets.filter(t => t.tecnicoId == session.id);

        // Formulario de creación automática de asignación
        formContainer.innerHTML = renderTicketForm(null, null, [], 'tech');
        setupFormSubmit(async (data) => {
            // Regla de negocio: Se le asigna automáticamente como responsable al crear
            const newTicket = {
                name: data.name,
                type: data.type,
                description: data.description,
                status: 'open',
                clienteId: 'creado_por_soporte',
                tecnicoId: session.id
            };
            await ticketService.create(newTicket);
            loadDashboard();
        });

        // Listar sus tickets
        listContainer.innerHTML = myTickets.map(ticket => 
            renderTicketCard(ticket, 'tech', 
                // Acción Editar (Solo estado)
                (t) => {
                    formContainer.innerHTML = renderTicketForm(async (updatedData) => {
                        await ticketService.update(t.id, { ...t, status: updatedData.status });
                        loadDashboard();
                    }, t, [], 'tech');
                    setupFormSubmit(async (updatedData) => {
                        await ticketService.update(t.id, { ...t, status: updatedData.status });
                        loadDashboard();
                    });
                }, 
                null
            )
        ).join('') || '<p>No tienes tickets asignados en este momento.</p>';
    }

    await loadDashboard();
}