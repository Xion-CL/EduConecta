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
    const rutInput = document.getElementById('rut');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!form) return;

    // Limpiar alertas cuando el usuario escribe
    [rutInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            alertContainer.classList.add('d-none');
            alertContainer.textContent = '';
            input.classList.remove('is-invalid', 'is-valid');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('📝 Intentando login...');
        
        const rut = rutInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Limpiar estado previo
        alertContainer.classList.add('d-none');
        alertContainer.textContent = '';
        [rutInput, emailInput, passwordInput].forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        try {
            console.log(' Datos ingresados - RUT:', rut, '| Email:', email, '| Password length:', password.length);
            
            const user = authService.login(rut, email, password);
            
            console.log('✅ Login exitoso:', user);
            // Redirección según rol (Criterio 3)
            window.location.href = `dashboard.html?rol=${user.role}`;
            
        } catch (error) {
            console.error('❌ Error de validación:', error.message);
            
            // Mostrar mensaje de error (Criterio 4)
            alertContainer.textContent = error.message;
            alertContainer.classList.remove('d-none');
            
            // Marcar campos inválidos
            if (error.message.includes('RUT')) {
                rutInput.classList.add('is-invalid');
            } else if (error.message.includes('correo')) {
                emailInput.classList.add('is-invalid');
            } else if (error.message.includes('contraseña')) {
                passwordInput.classList.add('is-invalid');
            }
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