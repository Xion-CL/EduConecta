export class Validator {
    // Valida RUT chileno (formato y dígito verificador)
    static validateRut(rut) {
        console.log('🔍 Validando RUT:', rut);
        
        if (!rut || typeof rut !== 'string') {
            console.log('❌ RUT vacío o no es string');
            return false;
        }
        
        // Limpiar RUT
        rut = rut.replace(/\s/g, '').replace(/\./g, '').toUpperCase();
        
        // Debe tener al menos 7 dígitos + DV
        if (rut.length < 8) {
            console.log('❌ RUT muy corto');
            return false;
        }
        
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1);
        
        // El cuerpo debe ser solo números
        if (!/^\d+$/.test(body)) {
            console.log('❌ RUT contiene letras en el cuerpo');
            return false;
        }
        
        // Calcular dígito verificador
        let sum = 0;
        let multiplier = 2;
        
        for (let i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body.charAt(i)) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        
        const expectedDv = 11 - (sum % 11);
        const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();
        
        const isValid = calculatedDv === dv;
        console.log('✅ RUT válido:', isValid, '- DV calculado:', calculatedDv, '- DV ingresado:', dv);
        
        return isValid;
    }

    // Valida correo institucional (MÁS ESTRICTO)
    static validateInstitutionalEmail(email) {
        console.log('🔍 Validando correo:', email);
        
        if (!email || typeof email !== 'string') {
            console.log(' Correo vacío');
            return false;
        }
        
        // Regex estricto: debe tener formato válido Y dominio institucional
        const domainRegex = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|inacapmail\.cl)$/i;
        
        const isValid = domainRegex.test(email);
        console.log('✅ Correo institucional válido:', isValid);
        
        return isValid;
    }

    // Valida contraseña segura
    static validatePassword(password) {
        console.log(' Validando contraseña, longitud:', password ? password.length : 0);
        
        if (!password || password.length < 8) {
            console.log('❌ Contraseña muy corta (< 8 caracteres)');
            return false;
        }
        
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        console.log('Mayúscula:', hasLowercase, 'Minúscula:', hasUppercase, 'Número:', hasNumber);
        
        const isValid = hasLowercase && hasUppercase && hasNumber;
        console.log('✅ Contraseña válida:', isValid);
        
        return isValid;
    }
}