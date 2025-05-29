import { authApi } from "@/api/impl/authApit";

export const getToken = () => localStorage.getItem("token");

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
}

export const removeToken = () => {
    localStorage.removeItem("token");
}

export const isAuthenticated = async () => {
    if(!getToken()) return false;

    try {
        const res = await authApi.validate();
        return res.status === 200;
    } catch(e) {
        return false;
    }
}