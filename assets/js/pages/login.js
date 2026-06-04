import { authService } from "../services/authService.js";
import { router } from "../router.js";
import { loadNavbar } from "../components/navbar.js";

export async function renderLogin() {
    const container = document.getElementById("content");
    container.innerHTML = `
        <div class="login-container">
            <h2>Sign in</h2>
            <form id="login-form">
                <input type="text" id="username" placeholder="Username . . ." required />
                <input type="password" id="password" placeholder="Password . . ." required />
                <button type="submit">Sign in</button>
                <a href="/register" data-link style="margin-left: 10px;">Create account</a>
            </form>
            <p id="login-error" style="color: red;"></p>
        </div>
    `;

    document
        .getElementById("login-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const errorEl = document.getElementById("login-error");

            try {
                const user = await authService.login(username, password);
                const redirectPath =
                    user.role === "admin"
                        ? "/admin"
                        : user.role === "tech"
                          ? "/tech"
                          : "/client";

                await loadNavbar();

                window.history.pushState(null, null, redirectPath);
                await router();
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });
}
