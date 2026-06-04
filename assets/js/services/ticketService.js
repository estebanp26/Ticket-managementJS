import { httpClient } from './httpClient.js';

export const ticketService = {
    async getAll() {
        const response = await httpClient.data.get('/tickets');
        return response.data;
    },
    async getById(id) {
        const response = await httpClient.data.get(`/tickets/${id}`);
        return response.data;
    },
    async create(ticketData) {
        const response = await httpClient.data.post('/tickets', ticketData);
        return response.data;
    },
    async update(id, ticketData) {
        const response = await httpClient.data.put(`/tickets/${id}`, ticketData);
        return response.data;
    },
    async delete(id) {
        const response = await httpClient.data.delete(`/tickets/${id}`);
        return response.data;
    }
};