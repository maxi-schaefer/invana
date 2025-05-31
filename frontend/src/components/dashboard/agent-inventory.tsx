import type ServerType from "@/types/ServerType";
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Cpu, HardDrive, Monitor, MoreHorizontalIcon, Plus, Server, Settings, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn, getBadgeStyle, timeAgo } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { agentApi } from "@/api/impl/agentApi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketProvider";
import { isAdmin } from "@/utils/auth";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/types/User";

export default function AgentInventory() {
    const [servers, setServers] = useState<ServerType[]>([]);
    const [pendingServers, setPendingServers] = useState<ServerType[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { client } = useSocket();
    const { user } = useAuth();

    const fetchServers = async () => {
        try {
            const res = await agentApi.getAgents();

            setServers(res.data as ServerType[]);
        } catch(error) {
            console.error(error);
        }
    }

    const fetchPendingServers = async () => {
        try {
            const res = await agentApi.getPending();
            console.log(res);

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
                                                <Button variant="destructive" onClick={() => denyAgent(server.id)}>
                                                    Deny
                                                </Button>
                                                <Button
                                                    className="bg-green-500 hover:bg-green-400"
                                                    onClick={() => acceptAgent(server.id, server.name, server.environment)}
                                                >
                                                    Accept
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                    servers.length != 0 ? servers.map(server => (
                        <Card key={server.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Server className="h-5 w-5 text-primary" />
                                        </div>

                                        <div>
                                            <CardTitle className="text-lg">{server.name}</CardTitle>
                                            <CardDescription>{server.hostname}</CardDescription>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge className={cn(getBadgeStyle(server.environment), "capitalize")}>{server.environment}</Badge>
                                        <Badge className={getBadgeStyle(server.status)}>{server.status}</Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Monitor className="h-4 w-4" />
                                        <span className="text-sm">{server.ip}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Cpu className="h-4 w-4" />
                                        <span className="capitalize text-sm">{server.os}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <HardDrive className="h-4 w-4" />
                                        <span className="text-sm">{server.services} services</span>
                                    </div>

                                    <div className="text-sm text-muted-foreground">Last status update: <Badge variant={"outline"}>{timeAgo(server.lastSeen)}</Badge></div>
                                </div>

                                <div className="flex justify-end">
                                    {/* Actions Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Settings className="h-4 w-4 mr-2" />
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Monitor className="h-4 w-4 mr-2" />
                                                Check Status
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => denyAgent(server.id)}>
                                                <Trash className="h-4 w-4 mr-2 text-destructive" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <p className="text-muted-foreground">🤷‍♂️ No Servers are being monitored</p>
                    )
                }
            </div>
        </div>
    )
}
