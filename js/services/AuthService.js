import { User } from '../models/user.js';
import { Validator } from '../utils/Validator.js';
import { SessionService } from './SessionService.js';

export class AuthService {
    constructor() {
            // Base de datos simulada de usuarios (RUTs VERIFICADOS)
    this.users = [
        new User('11.111.111-1', 'admin@inacap.cl', 'Admin123', 'admin', 'Fernando Mancilla'),
        new User('12.345.678-5', 'profe@inacapmail.cl', 'Profe123', 'docente', 'Luis Tihuel'),
        new User('9.999.999-3', 'alumno@inacapmail.cl', 'Alumno123', 'estudiante', 'Benjamín Aguayo')
    ];
    }

    login(rut, email, password) {
        // 1. Validar formatos
        if (!Validator.validateRut(rut)) {
            throw new Error('El RUT ingresado no es válido.');
        }
        if (!Validator.validateInstitutionalEmail(email)) {
            throw new Error('El correo debe ser institucional (@inacap.cl o @inacapmail.cl).');
        }
        if (!Validator.validatePassword(password)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.');
        }

        // 2. Buscar usuario en la "base de datos"
        const user = this.users.find(u => 
            u.rut === rut && u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        // 3. Validar credenciales
        if (!user) {
            throw new Error('Credenciales incorrectas. Verifica tu RUT, correo o contraseña.');
        }

        // 4. Guardar sesión y retornar usuario
        SessionService.saveSession(user);
        return user;
    }

    logout() {
        SessionService.clearSession();
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return SessionService.getSession();
    }
}