import axiosClient from "../axiosClient";

export const scriptApi = {
    getScripts: () => axiosClient.get("scripts")
}