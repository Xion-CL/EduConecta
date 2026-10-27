export class SessionService {
    static saveSession(user) {
        const sessionData = {
            rut: user.rut,
            email: user.email,
            role: user.role,
            name: user.name,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('educonecta_session', JSON.stringify(sessionData));
    }

    static getSession() {
        const data = localStorage.getItem('educonecta_session');
        return data ? JSON.parse(data) : null;
    }

    static clearSession() {
        localStorage.removeItem('educonecta_session');
    }

    static isLoggedIn() {
        return this.getSession() !== null;
    }
}