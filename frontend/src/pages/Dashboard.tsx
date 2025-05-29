import { AppSidebar } from '../components/sidebar/app-sidebar'
import { SidebarProvider } from '../components/ui/sidebar'
import DashboardContent from '../components/dashboard/dashboard-content'

export default function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <DashboardContent />
        </div>
    </SidebarProvider>
  )
}
