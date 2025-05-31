import { SidebarProvider } from '../components/ui/sidebar'
import DashboardContent from '../components/dashboard/dashboard-content'
import { useSocket } from '@/context/SocketProvider';
import { useEffect } from 'react';

export default function Dashboard() {
  const { connected, subscribe, send } = useSocket();

  useEffect(() => {
    if (connected) {
      subscribe('/topic/pong', (msg) => {
        console.log('Received:', msg.body);
      });

      send('/app/ping', 'Hello server!');
    }
  }, [connected]);

  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
            <DashboardContent />
        </div>
    </SidebarProvider>
  )
}
