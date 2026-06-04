export function renderTicketCard(ticket, currentRole, onEdit, onDelete) {
    const containerId = `ticket-${ticket.id}`;

    // Determinar si el cliente puede editar
    const canClienteEdit =
        currentRole === "client" &&
        !ticket.tecnicoId &&
        ticket.status !== "closed";

    // Botones visibles según rol
    let buttons = "";
    if (currentRole === "admin") {
        buttons = `<button class="btn-edit">Edit/Assign</button> <button class="btn-delete">Delete</button>`;
    } else if (currentRole === "tech" || canClienteEdit) {
        buttons = `<button class="btn-edit">Edit</button>`;
    }

    setTimeout(() => {
        const card = document.getElementById(containerId);
        if (!card) return;
        card.querySelector(".btn-edit")?.addEventListener("click", () =>
            onEdit(ticket),
        );
        card.querySelector(".btn-delete")?.addEventListener("click", () =>
            onDelete(ticket.id),
        );
    }, 0);

    return `
        <div id="${containerId}" class="tk-created">
            <div class="tk-information">
                <p><strong>User Name:</strong> ${ticket.name}</p> 
                <p><strong>Type: </strong>[${ticket.type}]</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Client ID:</strong> ${ticket.clienteId}</p>
                <p><strong>Technician Assigned ID:</strong> ${ticket.tecnicoId || "None"}</p>
                <p><strong>Description: </strong>${ticket.description}</p>
            </div>
            <div class="btns">${buttons}</div>
        </div>
    `;
}
