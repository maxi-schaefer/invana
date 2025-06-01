import type ServerType from '@/types/ServerType'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Cpu, HardDrive, Monitor, Server } from 'lucide-react'
import { Badge } from '../ui/badge'
import { cn, getBadgeStyle, timeAgo } from '@/lib/utils'
import AgentActionsMenu from './AgentActionsMenu'

export default function AgentCardGrid({ servers, onDeny }: { servers: ServerType[], onDeny: (id: string) => void}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servers.map(server => (
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
                        <AgentActionsMenu server={server} onDeny={onDeny} />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}
