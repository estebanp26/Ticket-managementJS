export function renderTicketForm(
    onSubmit,
    currentTicket = null,
    tecnicos = [],
    currentRole = "",
) {
    const isEdit = !!currentTicket;

    // Client cannot edit the ticket
    const isClienteRestricted =
        currentRole === "client" &&
        isEdit &&
        (currentTicket.tecnicoId || currentTicket.status === "closed");

    // If the ticket already exists the tech cannot edit the text but just the status.
    // If is creating a new ticket (isEdit === false), the tech can edit all fields.
    const isTecnicoRestricted = currentRole === "tech" && isEdit;

    return `
        <form id="ticket-form">
            <h3>${isEdit ? "Edit ticket" : "Create new ticket"}</h3>
            
            <label>Cliente name:</label>
            <input type="text" id="form-name" value="${currentTicket?.name || ""}" required ${isClienteRestricted || isTecnicoRestricted ? "disabled" : ""}><br><br>
            
            <label>Type:</label>
            <input type="text" id="form-type" value="${currentTicket?.type || ""}" required ${isClienteRestricted || isTecnicoRestricted ? "disabled" : ""}><br><br>
            
            <label>Description:</label>
            <textarea id="form-description" required ${isClienteRestricted || isTecnicoRestricted ? "disabled" : ""}>${currentTicket?.description || ""}</textarea><br><br>
            
            ${
                currentRole === "admin"
                    ? `
                <label>Assign Technician:</label>
                <select id="form-tecnico">
                    <option value="">Not assigned</option>
                    ${tecnicos.map((t) => `<option value="${t.id}" ${currentTicket?.tecnicoId == t.id ? "selected" : ""}>${t.username}</option>`).join("")}
                </select><br><br>
            `
                    : ""
            }

            ${
                isEdit && (currentRole === "admin" || currentRole === "tech")
                    ? `
                <label>Status:</label>
                <select id="form-status" ${currentRole === "admin" && !currentTicket.tecnicoId ? "disabled" : ""}>
                    <option value="open" ${currentTicket.status === "open" ? "selected" : ""}>Open</option>
                    <option value="in Progress" ${currentTicket.status === "in Progress" ? "selected" : ""}>In Progress</option>
                    <option value="closed" ${currentTicket.status === "closed" ? "selected" : ""}>Closed</option>
                </select><br><br>
            `
                    : ""
            }

            ${isClienteRestricted ? '<p style="color:red;">You cannot edit this ticket (already assigned or closed).</p>' : '<button type="submit">Submit</button>'}
        </form>
    `;
}

export function setupFormSubmit(onSave) {
    const form = document.getElementById("ticket-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("form-name")?.value || "",
            type: document.getElementById("form-type")?.value || "",
            description:
                document.getElementById("form-description")?.value || "",
            tecnicoId: document.getElementById("form-tecnico")?.value || null,
            status: document.getElementById("form-status")?.value || "open",
        };

        onSave(data);
    });
}
