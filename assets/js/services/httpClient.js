// Asegúrate de tener Axios importado en tu index.html o instálalo vía CDN/npm
const authAPI = axios.create({ baseURL: 'http://localhost:3001' });
const dataAPI = axios.create({ baseURL: 'http://localhost:3002' });

export const httpClient = {
    auth: {
        get: (url) => authAPI.get(url),
        post: (url, data) => authAPI.post(url, data)
    },
    data: {
        get: (url) => dataAPI.get(url),
        post: (url, data) => dataAPI.post(url, data),
        put: (url, data) => dataAPI.put(url, data),
        delete: (url) => dataAPI.delete(url)
    }
};