import { httpClient } from "../services/httpClient.js";
import { loadNavbar } from "../components/navbar.js";
import { router } from "../router.js";

export async function createClient() {
    const container = document.getElementById("content");
    container.innerHTML = `
    <form class="create-client">
        <h3>Create new client</h3>
        <label>Username:</label>
        <input type="text" id="form-username" required><br><br>

        <label>Password:</label>
        <input type="password" id="form-password" required><br><br>

        <button type="submit">Submit</button>
    </form>
    `;

    document
        .querySelector(".create-client")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document
                .getElementById("form-username")
                .value.trim();
            const password = document
                .getElementById("form-password")
                .value.trim();
            const response = await httpClient.auth.post("/users", {
                username,
                password,
                role: "client",
            });
            if (response.status === 201) {
                await loadNavbar();
                window.history.pushState(null, null, "/login");
                await router();
            } else {
                alert("Error creating client");
            }
        });
}
