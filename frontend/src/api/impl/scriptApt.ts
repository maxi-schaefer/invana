import axiosClient from "../axiosClient";

export const scriptApi = {
    getScripts: () => axiosClient.get("scripts"),
    addScript: (params) => axiosClient.post("scripts", params),
    deleteScript: (category: string, name: string) => axios.delete(`/api/scripts/${category}/${encodeURIComponent(name)}`),
}