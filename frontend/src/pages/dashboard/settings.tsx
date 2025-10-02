import DashboardHeader from "@/components/dashboard/dashboard-header";
import SettingsMail from "@/components/settings/SettingsMail";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Network } from "lucide-react";
import { useState } from "react";

export default function ApplianceSettings() {
    const [viewState, setViewState] = useState("appliance");
    
    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between flex-col md:flex-row">
                <DashboardHeader title="Appliance Settings" description="Manage your invana appliance settings" />            
            </div>

            <div className="flex gap-4 flex-col md:flex-row w-full">
                <Tabs value={viewState} onValueChange={(value) => setViewState(value)}>
                    <TabsList className="w-xs grid grid-cols-2">
                        <TabsTrigger value="appliance"><Network className="w-5 h-5"/> Appliance</TabsTrigger>
                        <TabsTrigger value="mail"><Mail className="w-5 h-5"/> Email</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {
                viewState === "mail" ? (
                    <SettingsMail />
                ) : (
                    <></>
                )
            }

        </div>
    )
}