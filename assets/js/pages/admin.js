import { ticketService } from "../services/ticketService.js";
import { userService } from "../services/userService.js";
import { renderTicketCard } from "../components/ticketCard.js";
import { renderTicketForm, setupFormSubmit } from "../components/ticketForm.js";
import { getSession } from "../utils/session.js";

export async function renderAdmin() {
    const container = document.getElementById("content");
    const session = getSession();

    container.innerHTML = `
        <h2>Admin Panel</h2>
        <div id="form-container"></div>
        <h3>Total System tickets</h3>
        <div id="tickets-list">Loading tickets...</div>
    `;

    const formContainer = document.getElementById("form-container");
    const listContainer = document.getElementById("tickets-list");

    async function loadDashboard() {
        const tickets = await ticketService.getAll();
        const tecnicos = await userService.getTecnicos();

        // Renderizar formulario vacío para creación
        formContainer.innerHTML = renderTicketForm(
            async (data) => {
                // Regla de negocio: Solo permite cambiar estado si ya tiene técnico asignado
                if (data.status !== "open" && !data.tecnicoId) {
                    alert(
                        "It isn't possible to change the status if the ticket doesn't have a technician assigned.",
                    );
                    return;
                }
                await ticketService.create({ ...data, clienteId: session.id });
                loadDashboard();
            },
            null,
            tecnicos,
            "admin",
        );
        setupFormSubmit(async (data) => {
            if (data.status !== "open" && !data.tecnicoId) {
                alert(
                    "It isn't possible to change the status if the ticket doesn't have a technician assigned.",
                );
                return;
            }
            await ticketService.create({ ...data, clienteId: session.id });
            loadDashboard();
        });

        // Listar todos los tickets
        listContainer.innerHTML =
            tickets
                .map((ticket) =>
                    renderTicketCard(
                        ticket,
                        "admin",
                        // Acción Editar
                        (t) => {
                            formContainer.innerHTML = renderTicketForm(
                                async (updatedData) => {
                                    if (
                                        updatedData.status !== "open" &&
                                        !updatedData.tecnicoId
                                    ) {
                                        alert(
                                            "It isn't possible to change the status if the ticket doesn't have a technician assigned.",
                                        );
                                        return;
                                    }
                                    await ticketService.update(t.id, {
                                        ...t,
                                        ...updatedData,
                                    });
                                    loadDashboard();
                                },
                                t,
                                tecnicos,
                                "admin",
                            );
                            setupFormSubmit(async (updatedData) => {
                                if (
                                    updatedData.status !== "open" &&
                                    !updatedData.tecnicoId
                                ) {
                                    alert(
                                        "It isn't possible to change the status if the ticket doesn't have a technician assigned.",
                                    );
                                    return;
                                }
                                await ticketService.update(t.id, {
                                    ...t,
                                    ...updatedData,
                                });
                                loadDashboard();
                            });
                        },
                        // Acción Eliminar
                        async (id) => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this ticket?",
                                )
                            ) {
                                await ticketService.delete(id);
                                loadDashboard();
                            }
                        },
                    ),
                )
                .join("") || "<p>There is not any ticket yet ...</p>";
    }

    await loadDashboard();
}
