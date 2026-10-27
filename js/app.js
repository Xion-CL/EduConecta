import { AuthService } from './services/AuthService.js';
import { SessionService } from './services/SessionService.js';

const authService = new AuthService();

// Función para inicializar la app según la página
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

// Lógica del Login
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
            alertContainer.classList.add('d-none');
            alertContainer.textContent = '';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('🔍 Iniciando validación...');
        
        const rut = rutInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Limpiar estado previo
        alertContainer.classList.add('d-none');
        alertContainer.textContent = '';
        [rutInput, emailInput, passwordInput].forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        let hasError = false;

        // Validar RUT manualmente
        if (!rut || !ValidatorRut(rut)) {
            rutInput.classList.add('is-invalid');
            hasError = true;
            console.log('❌ RUT inválido:', rut);
        } else {
            rutInput.classList.add('is-valid');
            console.log('✅ RUT válido:', rut);
        }

        // Validar correo manualmente
        if (!email || !ValidatorEmail(email)) {
            emailInput.classList.add('is-invalid');
            hasError = true;
            console.log('❌ Correo inválido:', email);
        } else {
            emailInput.classList.add('is-valid');
            console.log('✅ Correo válido:', email);
        }

        // Validar contraseña manualmente
        if (!password || !ValidatorPassword(password)) {
            passwordInput.classList.add('is-invalid');
            hasError = true;
            console.log('❌ Contraseña inválida');
        } else {
            passwordInput.classList.add('is-valid');
            console.log('✅ Contraseña válida');
        }

        if (hasError) {
            alertContainer.textContent = 'Por favor, corrige los errores marcados.';
            alertContainer.classList.remove('d-none');
            return;
        }

        // Si todo está válido, intentar login
        try {
            const user = authService.login(rut, email, password);
            console.log('✅ Login exitoso:', user);
            window.location.href = `dashboard.html?rol=${user.role}`;
        } catch (error) {
            console.error('❌ Error de credenciales:', error.message);
            alertContainer.textContent = error.message;
            alertContainer.classList.remove('d-none');
            // No marcar campos como inválidos si el error es de credenciales
        }
    });
}

// Validadores simples (puedes importar desde Validator.js si prefieres)
function ValidatorRut(rut) {
    rut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
    const body = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    if (body.length < 7 || !/^\d+$/.test(body)) return false;

    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i)) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const expectedDv = 11 - (sum % 11);
    const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();
    
    return calculatedDv === dv;
}

function ValidatorEmail(email) {
    const domainRegex = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|inacapmail\.cl)$/i;
    return domainRegex.test(email);
}

function ValidatorPassword(password) {
    return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
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

document.addEventListener('DOMContentLoaded', initApp);