/**
 * Helpers reutilizables
 */

// Carga contenido HTML asíncronamente
export async function loadHTML(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Error cargando HTML: ${path}`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        return '<h2>Error cargando contenido</h2>';
    }
}