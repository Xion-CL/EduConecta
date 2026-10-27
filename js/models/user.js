export class User {
    constructor(rut, email, password, role, name) {
        this.rut = rut;
        this.email = email;
        this.password = password; // En producción real, esto iría hasheado
        this.role = role;
        this.name = name;
    }
}