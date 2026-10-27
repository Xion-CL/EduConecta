export class Validator {
    // Valida RUT chileno (formato y dígito verificador)
    static validateRut(rut) {
        if (!rut || typeof rut !== 'string') return false;
        rut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1);
        
        if (body.length < 7) return false;

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

    // Valida correo institucional (ej. @inacap.cl o @inacapmail.cl)
    static validateInstitutionalEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const domainRegex = /@(inacap\.cl|inacapmail\.cl)$/i;
        return emailRegex.test(email) && domainRegex.test(email);
    }

    // Valida contraseña segura
    static validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }
}