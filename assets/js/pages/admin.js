import { ticketService } from '../services/ticketService.js';
import { userService } from '../services/userService.js';
import { renderTicketCard } from '../components/ticketCard.js';
import { renderTicketForm, setupFormSubmit } from '../components/ticketForm.js';
import { getSession } from '../utils/session.js';

export async function renderAdmin() {
    const container = document.getElementById('content');
    const session = getSession();
    
    container.innerHTML = `
        <h2>Panel de Administración (Control Total)</h2>
        <div id="form-container"></div>
        <h3>Todos los Tickets del Sistema</h3>
        <div id="tickets-list">Cargando tickets...</div>
    `;

    const formContainer = document.getElementById('form-container');
    const listContainer = document.getElementById('tickets-list');

    async function loadDashboard() {
        const tickets = await ticketService.getAll();
        const tecnicos = await userService.getTecnicos();

        // Renderizar formulario vacío para creación
        formContainer.innerHTML = renderTicketForm(async (data) => {
            // Regla de negocio: Solo permite cambiar estado si ya tiene técnico asignado
            if (data.status !== 'abierto' && !data.tecnicoId) {
                alert('No se puede cambiar el estado si el ticket no tiene un técnico asignado.');
                return;
            }
            await ticketService.create({ ...data, clienteId: session.id });
            loadDashboard();
        }, null, tecnicos, 'admin');
        setupFormSubmit(async (data) => {
            if (data.status !== 'abierto' && !data.tecnicoId) {
                alert('No se puede cambiar el estado si el ticket no tiene un técnico asignado.');
                return;
            }
            await ticketService.create({ ...data, clienteId: session.id });
            loadDashboard();
        });

        // Listar todos los tickets
        listContainer.innerHTML = tickets.map(ticket => 
            renderTicketCard(ticket, 'admin', 
                // Acción Editar
                (t) => {
                    formContainer.innerHTML = renderTicketForm(async (updatedData) => {
                        if (updatedData.status !== 'abierto' && !updatedData.tecnicoId) {
                            alert('No se puede cambiar el estado si el ticket no tiene un técnico asignado.');
                            return;
                        }
                        await ticketService.update(t.id, { ...t, ...updatedData });
                        loadDashboard();
                    }, t, tecnicos, 'admin');
                    setupFormSubmit(async (updatedData) => {
                        if (updatedData.status !== 'abierto' && !updatedData.tecnicoId) {
                            alert('No se puede cambiar el estado si el ticket no tiene un técnico asignado.');
                            return;
                        }
                        await ticketService.update(t.id, { ...t, ...updatedData });
                        loadDashboard();
                    });
                },
                // Acción Eliminar
                async (id) => {
                    if (confirm('¿Seguro que deseas eliminar este ticket?')) {
                        await ticketService.delete(id);
                        loadDashboard();
                    }
                }
            )
        ).join('') || '<p>No hay tickets registrados.</p>';
    }

    await loadDashboard();
}