import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem('auth');
        return stored ? JSON.parse(stored) : null;
    });

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('auth');
        alert('Sessiyanın müddəti bitdi. Yenidən daxil olun.');
    };

    useEffect(() => {
        if (auth?.expireDate) {
            const now = Date.now();
            const expireTime = new Date(auth.expireDate).getTime();
            const timeout = expireTime - now;

            if (timeout <= 0) {
                logout();
            } else {
                const timer = setTimeout(() => logout(), timeout);
                return () => clearTimeout(timer);
            }
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);