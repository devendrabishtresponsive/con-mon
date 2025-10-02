// context/AuthContext.tsx

'use client';

import { createContext, useEffect, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('cm_loggedInUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    
    const logout = async () => {
        await fetch('/api/auth/logout');
        localStorage.removeItem('cm_loggedInUser');
        setUser(null);
        window.location.href = '/login';
    };
    
    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};