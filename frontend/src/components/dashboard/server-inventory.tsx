import type ServerType from "@/types/ServerType";
import { useState } from "react"
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Cpu, HardDrive, Monitor, MoreHorizontalIcon, Plus, Server, Settings, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getBadgeStyle } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ServerInventory() {
    const [servers] = useState<ServerType[]>([
        {
            id: 1,
            name: "prod-web-01",
            hostname: "web01.prod.company.com",
            ip: "10.0.1.10",
            environment: "production",
            os: "Ubuntu 22.04",
            status: "online",
            services: 8,
            lastCheck: "2024-01-15 14:30:00",
        },
        {
            id: 2,
            name: "prod-api-02",
            hostname: "api02.prod.company.com",
            ip: "10.0.1.20",
            environment: "production",
            os: "CentOS 8",
            status: "online",
            services: 12,
            lastCheck: "2024-01-15 14:28:00",
        },
        {
            id: 3,
            name: "staging-db-01",
            hostname: "db01.staging.company.com",
            ip: "10.0.2.10",
            environment: "staging",
            os: "Ubuntu 20.04",
            status: "offline",
            services: 3,
            lastCheck: "2024-01-15 12:00:00",
        },
        {
            id: 4,
            name: "dev-app-01",
            hostname: "app01.dev.company.com",
            ip: "10.0.3.10",
            environment: "development",
            os: "Ubuntu 22.04",
            status: "online",
            services: 6,
            lastCheck: "2024-01-15 14:25:00",
        },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Server Inventory</h1>
                    <p className="text-muted-foreground">Manage servers in your infrastructure</p>
                </div>

                {/* TODO: Accept new servers */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Server
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {
                    servers.map(server => (
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
                                        <Badge className={getBadgeStyle(server.environment)}>{server.environment}</Badge>
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
                                        <span className="text-sm">{server.os}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <HardDrive className="h-4 w-4" />
                                        <span className="text-sm">{server.services} services</span>
                                    </div>

                                    <div className="text-sm text-muted-foreground">Last check: {server.lastCheck}</div>
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

                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                <Trash className="h-4 w-4 mr-2 text-destructive" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}
