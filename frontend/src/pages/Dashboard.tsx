import { SidebarProvider } from '../components/ui/sidebar'
import DashboardContent from '../components/dashboard/dashboard-content'
import { useSocket } from '@/context/SocketProvider';
import { useEffect } from 'react';
import type ServerType from '@/types/ServerType';
import { toast } from 'sonner';
import { AppSidebar } from '@/components/sidebar/app-sidebar';

export default function Dashboard() {
  const { connected, subscribe, send } = useSocket();

  useEffect(() => {
    if (connected) {
      subscribe('/topic/pong', (msg) => {
        console.log('Received:', msg.body);
      });

      subscribe('/topic/agent-updates', (msg) => {
        const updatedAgent: ServerType = JSON.parse(msg.body);
        if(updatedAgent.status === "DISCONNECTED") {
          toast.warning(`${updatedAgent.name} disconnected!`);
        }
      });
      
      subscribe('/topic/agent-reconnected', (msg) => {
        const updatedAgent: ServerType = JSON.parse(msg.body);
        toast.success(`${updatedAgent.name} reconnected!`);
      });

      send('/app/ping', 'Hello server!');
    }
  }, [connected, send, subscribe]);

  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
            <DashboardContent />
        </div>
    </SidebarProvider>
  )
}
