import axiosClient from "../axiosClient";

export const scriptApi = {
    getScripts: () => axiosClient.get("scripts"),
    addScript: (params) => axiosClient.post("scripts", params),
    deleteScript: (id: string) => axiosClient.delete(`scripts/customs/${id}`),
}