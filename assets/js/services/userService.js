import { httpClient } from './httpClient.js';

export const userService = {
    async getTecnicos() {
        const response = await httpClient.auth.get('/users?role=tech');
        return response.data;
    }
};