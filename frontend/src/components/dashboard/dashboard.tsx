import { SidebarProvider } from '../ui/sidebar'
import DashboardContent from './dashboard-content'

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
            <DashboardContent />
        </div>
    </SidebarProvider>
  )
}
