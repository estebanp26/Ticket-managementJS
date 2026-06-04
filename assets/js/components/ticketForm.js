export function renderTicketForm(onSubmit, currentTicket = null, tecnicos = [], currentRole = '') {
    const isEdit = !!currentTicket;
    
    // Restricciones de edición para clientes
    const isClienteRestricted = currentRole === 'cliente' && isEdit && (currentTicket.tecnicoId || currentTicket.status === 'cerrado');
    
    // El técnico solo tiene deshabilitados los campos de texto SI está editando un ticket ya existente.
    // Si está creando uno nuevo (isEdit === false), debe poder escribir el nombre, tipo y descripción.
    const isTecnicoRestricted = currentRole === 'tecnico' && isEdit;

    return `
        <form id="ticket-form" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
            <h3>${isEdit ? 'Editar Ticket' : 'Crear Nuevo Ticket'}</h3>
            
            <label>Nombre:</label>
            <input type="text" id="form-name" value="${currentTicket?.name || ''}" required ${isClienteRestricted || isTecnicoRestricted ? 'disabled' : ''}><br><br>
            
            <label>Tipo:</label>
            <input type="text" id="form-type" value="${currentTicket?.type || ''}" required ${isClienteRestricted || isTecnicoRestricted ? 'disabled' : ''}><br><br>
            
            <label>Descripción:</label>
            <textarea id="form-description" required ${isClienteRestricted || isTecnicoRestricted ? 'disabled' : ''}>${currentTicket?.description || ''}</textarea><br><br>
            
            ${currentRole === 'admin' ? `
                <label>Asignar Técnico:</label>
                <select id="form-tecnico">
                    <option value="">Sin asignar</option>
                    ${tecnicos.map(t => `<option value="${t.id}" ${currentTicket?.tecnicoId == t.id ? 'selected' : ''}>${t.username}</option>`).join('')}
                </select><br><br>
            ` : ''}

            ${isEdit && (currentRole === 'admin' || currentRole === 'tecnico') ? `
                <label>Estado:</label>
                <select id="form-status" ${currentRole === 'admin' && !currentTicket.tecnicoId ? 'disabled' : ''}>
                    <option value="abierto" ${currentTicket.status === 'abierto' ? 'selected' : ''}>Abierto</option>
                    <option value="en progreso" ${currentTicket.status === 'en progreso' ? 'selected' : ''}>En Progreso</option>
                    <option value="cerrado" ${currentTicket.status === 'cerrado' ? 'selected' : ''}>Cerrado</option>
                </select><br><br>
            ` : ''}

            ${isClienteRestricted ? '<p style="color:red;">No puedes editar este ticket (ya asignado o cerrado).</p>' : '<button type="submit">Guardar</button>'}
        </form>
    `;
}

export function setupFormSubmit(onSave) {
    const form = document.getElementById('ticket-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('form-name')?.value || '',
            type: document.getElementById('form-type')?.value || '',
            description: document.getElementById('form-description')?.value || '',
            tecnicoId: document.getElementById('form-tecnico')?.value || null,
            status: document.getElementById('form-status')?.value || 'abierto'
        };

        onSave(data);
    });
}