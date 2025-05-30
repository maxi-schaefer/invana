import type { AgentSettings } from "@/types/AgentSettings";
import axiosClient from "../axiosClient";

export const agentSettingsApi = {
    getSettings: () => axiosClient.get("settings"),
    saveSettings: (settings: AgentSettings | null) => axiosClient.post("settings", settings)
}