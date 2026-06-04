import { httpClient } from './httpClient.js';
import { saveSession, clearSession } from '../utils/session.js';

export const authService = {
    async login(username, password) {
        const response = await httpClient.auth.get(`/users?username=${username}&password=${password}`);
        const user = response.data[0];
        if (user) {
            saveSession({ id: user.id, username: user.username, role: user.role });
            return user;
        }
        throw new Error("Invalid credentials");
    },
    logout() {
        clearSession();
    }
};