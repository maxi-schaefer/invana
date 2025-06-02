import type ServerType from "@/types/ServerType";
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, LayoutGrid, List, Plus, XIcon } from "lucide-react";
import { getBadgeStyle } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { agentApi } from "@/api/impl/agentApi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketProvider";
import { isAdmin } from "@/utils/auth";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/types/User";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import AgentCardGrid from "../agent-view/AgentCardGrid";
import AgentCardList from "../agent-view/AgentCardList";
import Loading from "../ui/loading";

export default function AgentInventory() {
    const [servers, setServers] = useState<ServerType[]>([]);
    const [pendingServers, setPendingServers] = useState<ServerType[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewState, setViewState] = useState("columns");
    const [loading, setLoading] = useState(true);
    const { client } = useSocket();
    const { user } = useAuth();

    const fetchServers = async () => {
        try {
            const res = await agentApi.getAgents();

            setLoading(false);
            
            setServers(res.data as ServerType[]);
        } catch(error) {
            console.error(error);
        }
    }
    
    const fetchPendingServers = async () => {
        try {
            const res = await agentApi.getPending();

            setLoading(false);

            setPendingServers(res.data as ServerType[]);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        
        fetchServers();
        fetchPendingServers();

        if(client !== null) {
            const subscription = client.subscribe("/topic/agent-updates", (message) => {
                const updatedAgent: ServerType = JSON.parse(message.body);

                setServers((prevServers: ServerType[]) => {
                    const existingIndex = prevServers.findIndex(s => s.id === updatedAgent.id);

                    if(existingIndex !== -1) {
                        const updated = [...prevServers];
                        updated[existingIndex] = updatedAgent;
                        return updated;
                    }

                    setPendingServers(prevPending => {
                        const pendingIndex = prevPending.findIndex(s => s.id === updatedAgent.id);
                        if(pendingIndex !== -1) {
                            const updatedPending = [...prevPending];
                            updatedPending[pendingIndex] = updatedAgent;
                            return updatedPending;
                        }

                        if(updatedAgent.status === "PENDING") {
                            return [...prevPending, updatedAgent];
                        }

                        return prevPending;
                    });

                    if(updatedAgent.status !== "PENDING") {
                        return [...prevServers, updatedAgent];
                    }
                    return prevServers;
                });
            });

            return () => {
                subscription.unsubscribe();
            }
        }
    }, [client]);

    if(loading) return <Loading />

    const updatePendingServer = (id: string, key: string, value: string) => {
        setPendingServers(prev => 
            prev.map(server => 
                server.id === id ? { ...server, [key]: value } : server
            )
        )
    }

    const denyAgent = async (id: string) => {
        try {
            const res = await agentApi.denyAgent(id);
            
            if(res.status !== 200) {
                return toast.error("An error occurred whilste denying the agent!");
            }

            fetchPendingServers();
            fetchServers();
        } catch(error) {
            toast.error("An error occurred whilste denying the agent!");
            console.error(error);
        }
    }

    const acceptAgent = async(id: string, name: string, environment: string) => {
        try {
            const res = await agentApi.acceptAgent(id, { name, environment });
            if(res.status !== 200) {
                return toast.error("An error occurred whilste denying the agent!");
            }

            fetchPendingServers();
            fetchServers();
            
            toast.success(`Successfully accepted ${(res.data as ServerType).name}`)

            setDialogOpen(false);
        } catch (error) {
            toast.error("An error occurred whilste accepting the agent!");
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Agent Inventory</h1>
                    <p className="text-muted-foreground">Manage servers in your infrastructure</p>
                </div>

                <div className="flex gap-4">

                    <Tabs value={viewState} onValueChange={(value) => setViewState(value)} >
                        <TabsList className="w-xs grid grid-cols-2">
                            <TabsTrigger value="columns"><LayoutGrid className="h-5 w-5 text-muted-foreground" /> Columns</TabsTrigger>
                            <TabsTrigger value="list"><List className="h-5 w-5 text-muted-foreground" /> List</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {
                        isAdmin(user as User) && (
                            <Dialog onOpenChange={() => {setDialogOpen(!dialogOpen)}} open={dialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Agent
            
                                        {
                                            pendingServers.length > 0 && (
                                                <Badge variant={"secondary"}>{pendingServers.length}</Badge>
                                            )
                                        }
                                    </Button>
                                </DialogTrigger>
            
                                <DialogContent className="!max-w-3xl" >
                                    <DialogTitle className="border-b pb-2">Pending Servers</DialogTitle>
                                    <div>
                                        {
                                            pendingServers.length > 0 ? pendingServers.map((server) => (
                                                <div
                                                    key={server.id}
                                                    className="border-l-4 border-l-primary rounded-xl border border-border bg-card p-4 shadow-sm mb-2"
                                                >
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Detected Hostname</p>
                                                        <p className="text-base font-semibold text-foreground">{server.hostname}</p>
                                                    </div>
                                                
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium">Rename Server</Label>
                                                            <Input
                                                            type="text"
                                                            defaultValue={server.name}
                                                            onChange={(e) =>
                                                                updatePendingServer(server.id, "name", e.target.value)
                                                            }
                                                            />
                                                        </div>
                                                
                                                        <div className="space-y-1">
                                                            <Label className="text-sm font-medium">Environment</Label>
                                                            <Select
                                                                value={server.environment}
                                                                onValueChange={(e) =>
                                                                    updatePendingServer(server.id, "environment", e)
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select environment" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="production">
                                                                        <Badge className={getBadgeStyle("Production")}>Production</Badge>
                                                                    </SelectItem>
                                                                    <SelectItem value="staging">
                                                                        <Badge className={getBadgeStyle("Staging")}>Staging</Badge>
                                                                    </SelectItem>
                                                                    <SelectItem value="development">
                                                                        <Badge className={getBadgeStyle("Development")}>Development</Badge>
                                                                    </SelectItem>
                                                                    <SelectItem value="testing">
                                                                        <Badge className={getBadgeStyle("Testing")}>Testing</Badge>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                
                                                    <div className="flex justify-end gap-2 pt-2">
                                                    <Button variant="outline" className="hover:bg-destructive/40 dark:hover:bg-destructive/40" size={"icon"} onClick={() => denyAgent(server.id)}>
                                                        <XIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant={"outline"} className="hover:bg-success/40 dark:hover:bg-success/40" size={"icon"} onClick={() => acceptAgent(server.id, server.name, server.environment)}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    </div>
                                                </div>                                  
                                            )) : (
                                                <p className="text-muted-foreground">🤷‍♂️ There are no pending Servers</p>
                                            )
                                        }
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )
                    }
                </div>
            </div>
                {
                    servers.length > 0 ? (
                        viewState === "columns" ? (
                            <AgentCardGrid servers={servers} onDeny={denyAgent} />
                        ) : (
                            <AgentCardList servers={servers} onDeny={denyAgent} />
                        )
                    ) : (
                        <p className="text-muted-foreground">🤷‍♂️ No Servers are being monitored</p>
                    )
                }
        </div>
    )
}
