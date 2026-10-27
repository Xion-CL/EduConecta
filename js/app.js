import { AuthService } from './services/AuthService.js';
import { SessionService } from './services/SessionService.js';
import { Validator } from './utils/Validator.js';

const authService = new AuthService();

function initApp() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        if (SessionService.isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
        setupLogin();
    } else if (currentPage === 'dashboard.html') {
        if (!SessionService.isLoggedIn()) {
            window.location.href = 'index.html';
        }
        setupDashboard();
    }
}

function setupLogin() {
    const form = document.getElementById('loginForm');
    const alertContainer = document.getElementById('alertContainer');
    const rutInput = document.getElementById('rut');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!form) return;

    // Limpiar validaciones cuando el usuario escribe
    [rutInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid', 'is-valid');
            if (alertContainer) {
                alertContainer.classList.add('d-none');
                alertContainer.textContent = '';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('🔍 Iniciando validación...');
        
        const rut = rutInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Limpiar estado previo
        if (alertContainer) {
            alertContainer.classList.add('d-none');
            alertContainer.textContent = '';
        }
        [rutInput, emailInput, passwordInput].forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        let errorMessage = '';
        let hasError = false;

        // Validar RUT
        if (!Validator.validateRut(rut)) {
            rutInput.classList.add('is-invalid');
            errorMessage = 'El RUT ingresado no es válido.';
            hasError = true;
            console.log('❌ Error: RUT inválido');
        } else {
            rutInput.classList.add('is-valid');
        }

        // Validar correo (SOLO si el RUT está bien)
        if (!hasError && !Validator.validateInstitutionalEmail(email)) {
            emailInput.classList.add('is-invalid');
            errorMessage = 'El correo debe ser institucional (@inacap.cl o @inacapmail.cl).';
            hasError = true;
            console.log('❌ Error: Correo no institucional');
        } else if (!hasError) {
            emailInput.classList.add('is-valid');
        }

        // Validar contraseña (SOLO si RUT y correo están bien)
        if (!hasError && !Validator.validatePassword(password)) {
            passwordInput.classList.add('is-invalid');
            errorMessage = 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.';
            hasError = true;
            console.log('❌ Error: Contraseña inválida');
        } else if (!hasError) {
            passwordInput.classList.add('is-valid');
        }

        // Si hay error de validación, mostrar mensaje
        if (hasError) {
            if (alertContainer) {
                alertContainer.textContent = errorMessage;
                alertContainer.classList.remove('d-none');
            }
            return;
        }

        // Si todo está válido, intentar login
        console.log('✅ Todas las validaciones pasaron. Intentando login...');
        try {
            const user = authService.login(rut, email, password);
            console.log('✅ Login exitoso:', user);
            
            // Redirección según rol
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 300);
            
        } catch (error) {
            console.error('❌ Error de credenciales:', error.message);
            if (alertContainer) {
                alertContainer.textContent = error.message;
                alertContainer.classList.remove('d-none');
            }
            // No marcar campos como inválidos si es error de credenciales
        }
    });
}

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

document.addEventListener('DOMContentLoaded', initApp);