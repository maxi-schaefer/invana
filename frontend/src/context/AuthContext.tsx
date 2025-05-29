import { authApi } from '@/api/impl/authApit';
import { getToken, removeToken, setToken as storeToken } from '@/utils/auth';
import React, { createContext, useEffect, useState } from 'react'

type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const checkAuth = async  () => {
            const token = getToken();
            if(!token) {
                setLoading(false);
                return;
            }
    
            // validate token with backend
            await authApi.validate().then((res) => {
                if(res.status === 200) {
                    setTokenState(token);
                } else {
                    removeToken();
                    setTokenState(null);
                }

                setLoading(false)
            }).catch(() => {
                removeToken();
                setTokenState(null);

                setLoading(false)
            });
        }

        checkAuth();
    }, []);

    const login = (token: string) => {
        storeToken(token);
        setTokenState(token);
    }

    const logout = () => {
        removeToken();
        setTokenState(null);
    }

    const value: AuthContextType = {
        isAuthenticated: !!token,
        token,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
