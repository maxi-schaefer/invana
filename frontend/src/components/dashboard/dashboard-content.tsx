import React from 'react'
import { AppSidebar } from '../sidebar/app-sidebar'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import { ModeToggle } from '../ui/theme-toggle';
import DashboardOverview from './dashboard-overview';
import ScriptLibrary from './script-library';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import ServerInventory from './server-inventory';
import VersionHistory from './version-history';
import AgentSettings from './agent-settings';

export default function DashboardContent() {
    const [activeSection, setActiveSection] = React.useState<string>('dashboard');

    const renderContent = () => {
        switch (activeSection){
            case 'dashboard':
                return <DashboardOverview />;
            case "scripts":
                return <ScriptLibrary />
            case 'servers':
                return <ServerInventory />;
            case 'history':
                return <VersionHistory />;
            case 'agents':
                return <AgentSettings />;
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
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#' className='text-muted-foreground'>
                                    Invana
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage className='capitalize'>{activeSection}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="ml-auto">
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
            </SidebarInset>
        </>
    )
}
