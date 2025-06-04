import type { User } from "@/types/User";
import axiosClient, { baseUrl } from "../axiosClient";
import { getToken } from "@/utils/auth";

export const userApi = {
    getSelf: () =>  axiosClient.get("users/me"),
    updateUser: (id: string | undefined, formData: FormData) => axiosClient.request({
        url: `users/${id}`,
        method: "put",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${getToken()}`
        }
    }),
    getAvatarUrl: (user: User) => `${baseUrl}users/avatars/${user.avatar}`,
} 