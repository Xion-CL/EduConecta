import { AuthService } from './services/AuthService.js';
import { SessionService } from './services/SessionService.js';

const authService = new AuthService();

// Función para inicializar la app según la página
function initApp() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        // Si ya está logueado, redirigir al dashboard
        if (SessionService.isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
        setupLogin();
    } else if (currentPage === 'dashboard.html') {
        // Si no está logueado, redirigir al login
        if (!SessionService.isLoggedIn()) {
            window.location.href = 'index.html';
        }
        setupDashboard();
    }
}

// Lógica del Login
function setupLogin() {
    const form = document.getElementById('loginForm');
    const alertContainer = document.getElementById('alertContainer');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rut = document.getElementById('rut').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Limpiar errores previos
        alertContainer.classList.add('d-none');
        form.classList.remove('was-validated');

        try {
            const user = authService.login(rut, email, password);
            // Redirección según rol (Criterio 3)
            window.location.href = `dashboard.html?rol=${user.role}`;
        } catch (error) {
            // Mostrar mensaje de error (Criterio 4)
            alertContainer.textContent = error.message;
            alertContainer.classList.remove('d-none');
            form.classList.add('was-validated');
        }
    });
}

// Lógica del Dashboard
function setupDashboard() {
    const user = authService.getCurrentUser();
    if (!user) return;

    const nameElement = document.getElementById('userName');
    const roleElement = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');

    if (nameElement) nameElement.textContent = user.name;
    if (roleElement) roleElement.textContent = user.role.toUpperCase();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
        });
    }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', initApp);