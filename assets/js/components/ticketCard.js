export function renderTicketCard(ticket, currentRole, onEdit, onDelete) {
    const containerId = `ticket-${ticket.id}`;
    
    // Determinar si el cliente puede editar
    const canClienteEdit = currentRole === 'cliente' && !ticket.tecnicoId && ticket.status !== 'cerrado';
    
    // Botones visibles según rol
    let buttons = '';
    if (currentRole === 'admin') {
        buttons = `<button class="btn-edit">Editar/Asignar</button> <button class="btn-delete" style="color:red;">Eliminar</button>`;
    } else if (currentRole === 'tecnico' || canClienteEdit) {
        buttons = `<button class="btn-edit">Editar</button>`;
    }

    setTimeout(() => {
        const card = document.getElementById(containerId);
        if (!card) return;
        card.querySelector('.btn-edit')?.addEventListener('click', () => onEdit(ticket));
        card.querySelector('.btn-delete')?.addEventListener('click', () => onDelete(ticket.id));
    }, 0);

    return `
        <div id="${containerId}" style="border: 1px solid #777; padding: 10px; margin: 10px 0; border-radius: 5px;">
            <h4>${ticket.name} [${ticket.type}]</h4>
            <p>${ticket.description}</p>
            <p><strong>Estado:</strong> ${ticket.status}</p>
            <p><strong>Cliente ID:</strong> ${ticket.clienteId}</p>
            <p><strong>Técnico Asignado ID:</strong> ${ticket.tecnicoId || 'Ninguno'}</p>
            ${buttons}
        </div>
    `;
}