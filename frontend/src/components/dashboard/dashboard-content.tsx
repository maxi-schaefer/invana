import React from 'react'
import { AppSidebar } from '../sidebar/app-sidebar'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import { ModeToggle } from '../ui/theme-toggle';
import DashboardOverview from './dashboard-overview';

export default function DashboardContent() {
    const [activeSection, setActiveSection] = React.useState<string>('dashboard');

    const renderContent = () => {
        switch (activeSection){
            case 'dashboard':
                return <DashboardOverview />;
            default:
                return <DashboardOverview />;
        }
    }

    return (
        <>
            <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className='-ml-1 cursor-pointer' />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Ivana</span>
                        <span>/</span>
                        <span className="capitalize">{activeSection}</span>
                    </div>

                    <div className="ml-auto">
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
            </SidebarInset>
        </>
    )
}
