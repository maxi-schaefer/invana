import axiosClient from "../axiosClient";

export const versionHistoryApi = {
    getAllVersionHistories: () => axiosClient.get("versions"),
}