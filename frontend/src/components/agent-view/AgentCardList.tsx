import { getBadgeStyle, timeAgo } from '@/lib/utils';
import type ServerType from '@/types/ServerType'
import { AlertTriangle, CheckCircle, Cpu, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import AgentActionsMenu from './AgentActionsMenu';

export default function AgentCardList({ servers, onDeny }: { servers: ServerType[], onDeny: (id: string) => void}) {
    
    function getStatusIcon(status: string) {
        switch (status.toLowerCase()) {
            case "connected":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "disconnected":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "outdated":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            default:
                return <XCircle className="h-4 w-4 text-gray-500" />;
        }
    }

    return (
        <div className="space-y-3">
            {
                servers.map((server) => (
                    <div key={server.id} className="border-l-4 border-l-primary bg-card flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            {getStatusIcon(server.status)}

                            <div>
                                <p className="font-medium">{server.name}</p>
                                <p className="text-sm text-muted-foreground">{server.ip}</p>
                            </div>
                            <Badge className={getBadgeStyle(server.status)}>{server.status}</Badge>
                            <Badge className={getBadgeStyle(server.environment)}>{server.environment}</Badge>
                        </div>

                        <div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium capitalize flex items-center gap-1"><Cpu className='h-4 w-4 text-muted-foreground' /> {server.os}</p>
                                    <p className="text-xs text-muted-foreground">{timeAgo(server.lastSeen)}</p>
                                </div>


                                <AgentActionsMenu server={server} onDeny={onDeny} />
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
