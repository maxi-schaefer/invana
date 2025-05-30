/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertTriangle, Check, CheckCircle, Clock, Command, Copy, Download, Eye, EyeOff, FileCog, Key, Monitor, RefreshCw, Save, Server, Shield, UploadCloud, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Badge } from "../ui/badge";
import { type AgentSettings } from "@/types/AgentSettings";
import { agentSettingsApi } from "@/api/impl/agentSettings";
import Loading from "../ui/loading";

export default function AgentSettings() {
    const [showToken, setShowToken] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);
    const [settings, setSettings] = useState<AgentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [collectionInterval, setCollectionInterval] = useState("5"); // default to 5 minutes

    // Load Agent Settings
    useEffect(() => {
        const loadSettings = async() => {
            try {
                const res = await agentSettingsApi.getSettings();
                setSettings(res.data as AgentSettings);
                setCollectionInterval((res.data as AgentSettings).collectionInterval.toString());
                setLoading(false);
            } catch(error) {
                toast.error("Failed to load agent settings");
                console.error("Error loading settings: ", error);
            }
        }
        loadSettings();
    }, []);

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
            version: "1.2.3",
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

    const handleSaveConfig = async () => {
        console.log("Saving agent configuration...");

        const configData: AgentSettings = {
            collectionInterval: parseInt(collectionInterval, 10),
            serverPort: settings?.serverPort || 8080,
            serverUrl: settings?.serverUrl || "",
            customHeadersJson: settings?.customHeadersJson || "",
            detailedLogging: settings?.detailedLogging || false,
            retryAttempts: settings?.retryAttempts || 3,
            timeout: settings?.timeout || 30,
            tlsRequired: settings?.tlsRequired || true,
            token: settings?.token || "",
            id: 1
        }

        try {
            const res = await agentSettingsApi.saveSettings(configData);
            if(res.status !== 200) {
                toast.error("Failed to save agent configuration");
            }

            toast.success("Agent configuration saved successfully!");
        } catch(error) {
            console.error(error);
            toast.error("Failed to save agent configuration")
        }
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
        setSettings({...settings!, token: newToken });
    }

    const handleCopyToken = () => {
        navigator.clipboard.writeText(settings?.token || "");

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

    if(loading) return <Loading />

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
                                            value={settings?.token || ""}
                                            onChange={(e) => setSettings({ ...settings!, token: e.target.value })}
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
                                <Switch checked={settings?.tlsRequired} onCheckedChange={(e) => setSettings({ ...settings!, tlsRequired: e as boolean })} />
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
                                    <Select value={collectionInterval} onValueChange={setCollectionInterval}>
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
                                    <Input id="retry-attempts" type="number" defaultValue={settings?.retryAttempts || 3} onChange={(e) => setSettings({...settings!, retryAttempts: e.target.valueAsNumber })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                                    <Input id="timeout" type="number" defaultValue={settings?.timeout || 3} onChange={(e) => setSettings({...settings!, timeout: e.target.valueAsNumber })} className="max-w-xs" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable detailed logging</Label>
                                    <p className="text-sm text-muted-foreground">Agents will send detailed execution logs</p>
                                </div>
                                <Switch checked={settings?.detailedLogging} onCheckedChange={(e) => setSettings({ ...settings!, detailedLogging: e })} />
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
                                <Input id="server-url" defaultValue={settings?.serverUrl} onChange={(e) => setSettings({ ...settings!, serverUrl: e.target.value })} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="server-port">Ivana Server Port</Label>
                                <Input id="server-port" type="number" defaultValue={settings?.serverPort} onChange={(e) => setSettings({ ...settings!, serverPort: e.target.valueAsNumber })} className="max-w-xs" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="custom-headers">Custom Headers (JSON)</Label>
                                <Textarea
                                    id="custom-headers"
                                    placeholder='{"X-Custom-Header": "value"}'
                                    className="min-h-[80px] font-mono text-sm"
                                    value={settings?.customHeadersJson || ""}
                                    onChange={(e) => setSettings({ ...settings!, customHeadersJson: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Deployment Tab */}
                <TabsContent value="deployment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Agent Deployment
                            </CardTitle>
                            <CardDescription>Download and deploy Ivana agents to your servers</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Universal Download */}
                                <Card className="border-2">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Universal Agent</CardTitle>
                                        <CardDescription>For Linux, Windows and everything which runs python</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button className="w-full" variant={"outline"}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download .py
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Containerized download */}
                                <Card className="border-2">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Docker Agent</CardTitle>
                                        <CardDescription>Containerized deployment</CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <Button className="w-full" variant={"outline"}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Docker Compose
                                        </Button>
                                        <Button className="w-full" variant={"outline"}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Kubernetes YAML
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center text-lg font-medium">
                                    <Command className="h-5 w-5 mr-2 text-muted-foreground" />
                                    Installation Commands
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium">Linux</Label>
                                        <div className="bg-muted p-3 rounded-md mt-1">
                                            <code className="text-sm">
                                                curl -sSL https://ivana.company.com/install.sh | sudo bash -s -- --token {settings?.token}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Agent Status Tab */}
                <TabsContent value="status" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Agent Status Overview
                            </CardTitle>
                            <CardDescription>Monitor the status of all deployed agents</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                {/* Connected Agents */}
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">2</div>
                                    <div className="text-sm text-muted-foreground">Connected</div>
                                </div>

                                {/* Disconnected Agents */}
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">1</div>
                                    <div className="text-sm text-muted-foreground">Disconnected</div>
                                </div>
                                
                                {/* Outdated Agents */}
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">1</div>
                                    <div className="text-sm text-muted-foreground">Outdated</div>
                                </div>
                                
                                {/* Total Agents */}
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-blue-500">4</div>
                                    <div className="text-sm text-muted-foreground">Total</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {
                                    agentStatus.map((agent, index) => (
                                        <div key={index} className="flex border-l-4 border-l-primary items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(agent.status)}
                                                <div>
                                                    <p className="font-medium">{agent.server}</p>
                                                    <p className="text-sm text-muted-foreground">{agent.ip}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">v{agent.version}</p>
                                                    <p className="text-xs text-muted-foreground">{agent.lastSeen}</p>
                                                </div>

                                                <Badge className={getStatusVariant(agent.status)}>{agent.status}</Badge>
                                            </div>
                                        </div>

                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
