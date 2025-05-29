import axiosClient from "../axiosClient";

export const authApi = {
    login: (params: any) => axiosClient.post("auth/login", params),
    validate: () => axiosClient.get("auth/validate")
}