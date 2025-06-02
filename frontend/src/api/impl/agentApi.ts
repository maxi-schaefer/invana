import axiosClient from "../axiosClient";

export const agentApi = {
    acceptAgent: (id: string, params: any) => axiosClient.post(`agents/${id}/accept`, params),
    denyAgent: (id: string) => axiosClient.post(`agents/${id}/deny`),
    getPending: () => axiosClient.get("agents/pending"),
    getAgents: () => axiosClient.get("agents"),
    updateAgent: (id: string, params: any) => axiosClient.put(`agents/${id}`, params)
}