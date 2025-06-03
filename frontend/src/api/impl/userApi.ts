import type { User } from "@/types/User";
import axiosClient, { baseUrl } from "../axiosClient";

export const userApi = {
    getSelf: () =>  axiosClient.get("users/me"),
    updateUser: (id: string, params: any) => axiosClient.put(`users/${id}`, params),
    getAvatarUrl: (user: User) => `${baseUrl}users/avatars/${user.avatar}`,
} 