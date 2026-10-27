export class Validator {
    // Valida RUT chileno (formato y dígito verificador)
    static validateRut(rut) {
        console.log('🔍 Validando RUT:', rut);
        
        if (!rut || typeof rut !== 'string') {
            console.log('❌ RUT vacío o no es string');
            return false;
        }
        
        // Limpiar RUT (quitar puntos y espacios)
        rut = rut.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
        
        // Separar cuerpo y dígito verificador
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1);
        
        // Validar que el cuerpo tenga al menos 7 dígitos y sean todos números
        if (body.length < 7 || !/^\d+$/.test(body)) {
            console.log('❌ RUT inválido: cuerpo incorrecto');
            return false;
        }
        
        // Calcular dígito verificador
        let sum = 0;
        let multiplier = 2;
        
        // Recorrer de derecha a izquierda
        for (let i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body.charAt(i)) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        
        const remainder = sum % 11;
        const expectedDv = 11 - remainder;
        
        // Calcular DV esperado
        let calculatedDv;
        if (expectedDv === 11) {
            calculatedDv = '0';
        } else if (expectedDv === 10) {
            calculatedDv = 'K';
        } else {
            calculatedDv = expectedDv.toString();
        }
        
        const isValid = calculatedDv === dv;
        console.log('✅ RUT válido:', isValid, '| DV calculado:', calculatedDv, '| DV ingresado:', dv);
        
        return isValid;
    }

    // Valida correo institucional (MÁS ESTRICTO)
    static validateInstitutionalEmail(email) {
        console.log('🔍 Validando correo:', email);
        
        if (!email || typeof email !== 'string') {
            console.log('❌ Correo vacío');
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
        console.log('🔍 Validando contraseña, longitud:', password ? password.length : 0);
        
        if (!password || password.length < 8) {
            console.log('❌ Contraseña muy corta (< 8 caracteres)');
            return false;
        }
        
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        console.log('Mayúscula:', hasUppercase, 'Minúscula:', hasLowercase, 'Número:', hasNumber);
        
        const isValid = hasLowercase && hasUppercase && hasNumber;
        console.log('✅ Contraseña válida:', isValid);
        
        return isValid;
    }
}