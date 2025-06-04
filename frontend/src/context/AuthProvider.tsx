import { authApi } from '@/api/impl/authApit';
import { userApi } from '@/api/impl/userApi';
import type { User } from '@/types/User';
import { getToken, removeToken, setToken as storeToken } from '@/utils/auth';
import React, { createContext, useEffect, useState } from 'react'

type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    setUser: (user: User) => void;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  
    const [token, setTokenState] = useState<string | null>(getToken());
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const checkAuth = async  () => {
            const token = getToken();
            if(!token) {
                setLoading(false);
                logout();
                return;
            }
    
            // validate token with backend
            await authApi.validate().then( async (res) => {
                if(res.status === 200) {
                    const userRes: any = await userApi.getSelf();
                    
                    setUser(userRes.data);
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

    const login = (token: string, user: User) => {
        storeToken(token);
        setUser(user);
        setTokenState(token);
    }
    
    const logout = () => {
        removeToken();
        setUser(null);
        setTokenState(null);
    }

    const value: AuthContextType = {
        isAuthenticated: !!token,
        user,
        token,
        login,
        logout,
        loading,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
