/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertTriangle, Check, CheckCircle, Clock, Copy, Eye, EyeOff, FileCog, Key, Monitor, RefreshCcw, RefreshCw, Save, Server, UploadCloud, XCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function AgentSettings() {
    const [showToken, setShowToken] = useState(false);
    const [agentToken, setAgentToken] = useState("ivana_agent_token_neu1us76eh");
    const [isUpdating, setIsUpdating] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);

    // Mockup data
    const agentStatus = [
        {
            server: "prod-web-01",
            status: "connected",
            version: "1.2.3",
            lastSeen: "2 minutes ago",
            ip: "10.0.1.10"
        },
        {
            server: "prod-api-02",
            status: "connected",
            version: "1.2.3",
            lastSeen: "1 minute ago",
            ip: "10.0.1.20"
        },
        {
            server: "staging-db-01",
            status: "disconnected",
            lastSeen: "2 hours ago",
            ip: "10.0.2.10"
        },
        {
            server: "dev-app-01",
            status: "outdated",
            version: "1.1.5",
            lastSeen: "5 minutes ago",
            ip: "10.0.3.10"
        }
    ]

    const handleSaveConfig = () => {
        console.log("Saving agent configuration...")
        // Implement saving config
    };

    const handleSaveAndUpdate = async () => {
        setIsUpdating(true);
        console.log("Saving configuration and updating all servers...");
        // Implementation for saving and updating all servers
        setTimeout(() => {
            setIsUpdating(false);
        }, 3000);
    };

    const handleGenerateToken = () => {
        const newToken = `ivana_agent_token_${Math.random().toString(36).substring(2, 15)}`
        setAgentToken(newToken);
    }

    const handleCopyToken = () => {
        navigator.clipboard.writeText(agentToken);

        toast.success("Copied agent token to clipboard!")

        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 3000);
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "connected":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "disconnected":
                return <XCircle className="h-4 w-4 text-red-500" />
            case "outdated":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            default:
                return <XCircle className="h-4 w-4 text-gray-500" />
        }
  }

  const getStatusVariant = (status: string) => {
        switch (status) {
            case "connected":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "disconnected":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            case "outdated":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
  }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Agent Settings</h1>
                <p className="text-muted-foreground">Configure and manage Ivana agents across your infrastructure</p>
            </div>

            <Tabs defaultValue="configuration" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="configuration"><FileCog className="h-4 w-4" /> Configuration</TabsTrigger>
                    <TabsTrigger value="deployment"><UploadCloud className="h-4 w-4" /> Deployment</TabsTrigger>
                    <TabsTrigger value="status"><Monitor className="h-4 w-4" /> Agent Status</TabsTrigger>
                </TabsList>

                {/* Configuration Tab */}
                <TabsContent value="configuration" className="space-y-6">
                    <div className="flex gap-3">
                        <div className="flex ml-auto gap-2">
                            <Button onClick={handleSaveConfig}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Configuration
                            </Button>
                            <Button onClick={handleSaveAndUpdate} disabled={isUpdating} className="bg-primary hover:bg-primary/90">
                                {isUpdating ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                )}
                                Save & Update All Servers
                            </Button>
                        </div>
                    </div>

                    {/* Authentication Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Authentication
                            </CardTitle>
                            <CardDescription>Configure agent authentication and security</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="agent-token">Agent Token</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            id="agent-token"
                                            type={showToken ? "text" : "password"}
                                            value={agentToken}
                                            onChange={(e) => setAgentToken(e.target.value)}
                                            className="pr-20"
                                        />

                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                            <Button type="button" variant={"ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setShowToken(!showToken)}>
                                                {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </Button>

                                            <Button type="button" variant={"ghost"} size={"sm"} className="h-6 w-6 p-0" onClick={handleCopyToken}>
                                                {copiedToken ?  <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button variant={"outline"} onClick={handleGenerateToken}>Generate New Token</Button>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    This token is used by agents to authenticate with the Iavana server
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0 5">
                                    <Label>Require TLS encryption</Label>
                                    <p className="text-sm text-muted-foreground">Force encrypted connections from agents</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Collection Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock  className="h-5 w-5"/>
                                Collection Settings
                            </CardTitle>
                            <CardDescription>Configure how agents collect and report data</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="collection-interval">Collection Interval</Label>
                                    <Select defaultValue="5">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Every 1 minute</SelectItem>
                                            <SelectItem value="5">Every 5 minutes</SelectItem>
                                            <SelectItem value="15">Every 15 minutes</SelectItem>
                                            <SelectItem value="30">Every 30 minutes</SelectItem>
                                            <SelectItem value="60">Every hour</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="retry-attempts">Retry Attempts</Label>
                                    <Input id="retry-attempts" type="number" defaultValue={3} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                                    <Input id="timeout" type="number" defaultValue={30} className="max-w-xs" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable detailed logging</Label>
                                    <p className="text-sm text-muted-foreground">Agents will send detailed execution logs</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Server Settings Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="h-5 w-5" />
                                Server Configuration
                            </CardTitle>
                            <CardDescription>Configure server connection settings</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="server-url">Ivana Server URL</Label>
                                <Input id="server-url" defaultValue={"https://ivana.company.com"} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="server-port">Ivana Server Port</Label>
                                <Input id="server-port" type="number" defaultValue={8080} className="max-w-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="custom-headers">Custom Headers (JSON)</Label>
                                <Textarea
                                    id="custom-headers"
                                    placeholder='{"X-Custom-Header": "value"}'
                                    className="min-h-[80px] font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
