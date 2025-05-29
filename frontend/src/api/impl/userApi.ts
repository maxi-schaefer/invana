import axiosClient from "../axiosClient";

export const userApi = {
    getSelf: () =>  axiosClient.get("users/me"),
} 