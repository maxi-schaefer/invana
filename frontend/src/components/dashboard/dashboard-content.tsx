import React from 'react'
import { AppSidebar } from '../sidebar/app-sidebar'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import { ModeToggle } from '../ui/theme-toggle';
import DashboardOverview from './dashboard-overview';
import ScriptLibrary from './script-library';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import VersionHistory from './version-history';
import AgentSettings from './agent-settings';
import AgentInventory from './agent-inventory';
import AccountSettings from '../user/account-settings';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { version } from "../../../package.json"
import { Github } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Kbd } from '../command-menu/kbd';

export default function DashboardContent() {
    const [activeSection, setActiveSection] = React.useState<string>('dashboard');

    const renderContent = () => {
        switch (activeSection){
            case 'dashboard':
                return <DashboardOverview />;
            case "scripts":
                return <ScriptLibrary />
            case 'agents inventory':
                return <AgentInventory />;
            case 'history':
                return <VersionHistory />;
            case 'agents':
                return <AgentSettings />;
            case "account":
                return <AccountSettings />;
            default:
                return <DashboardOverview />;
        }
    }

    return (
        <>
            <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <SidebarInset>
              
                <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
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

                    <div className="ml-auto flex items-center gap-2">
                        <Badge variant="outline" className='hidden sm:flex'>
                            <Kbd>⌘</Kbd>
                            <Kbd>K</Kbd>
                        </Badge>

                        <ModeToggle />
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4">
                    {renderContent()}

                    {/* Footer */}
                    <div className="fixed bottom-4 right-4 flex items-center space-x-4">
                        <Badge variant={'outline'}>
                            <span className='text-muted-foreground' >{version}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a 
                                            href="https://github.com/maxi-schaefer/invana"
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className="hover:text-foreground text-muted-foreground">
                                                <Github className='h-4 w-4' />
                                            </a>
                                    </TooltipTrigger>
                                    <TooltipContent>View on Github</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Badge>
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}
