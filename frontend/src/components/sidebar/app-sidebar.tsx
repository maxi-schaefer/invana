import { Activity, Database, History, Home, Library, Package, Server, Settings } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';

// Menu item variables
const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      id: "dashboard",
    },
    {
      title: "Server Inventory",
      icon: Server,
      id: "servers",
    },
    {
      title: "Services",
      icon: Package,
      id: "services",
    },
    {
      title: "Script Library",
      icon: Library,
      id: "scripts",
    },
    {
      title: "Version History",
      icon: History,
      id: "history",
    },
    {
      title: "Monitoring",
      icon: Activity,
      id: "monitoring",
    },
]

// AppSidebar interface
interface AppSidebarProps {
    activeSection?: string;
    onSectionChange?: (section: string) => void;
}

export function AppSidebar({ activeSection = "dashboard", onSectionChange }: AppSidebarProps) {

    return (
        <Sidebar collapsible='icon' >
        <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
                <div className={`flex ${useSidebar().open ? "h-8 w-8" : "h-6 w-6"} aspect-square items-center justify-center rounded-lg bg-primary`}>
                    <Database className={`${useSidebar().open ? "h-5 w-5" : "h-4 w-4"} text-primary-foreground`} />
                </div>

                {useSidebar().open && (
                    <div className="flex flex-col items-start">
                        <span className="font-semibold text-lg text-primary">Ivana</span>
                        <span className="text-xs text-muted-foreground">Inventory Manager</span>
                    </div>
                )}
            </div>
        </SidebarHeader>
            <SidebarContent>

                {/* Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                menuItems.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton tooltip={item.title} className={`${activeSection === item.id ? "border-l-2 border-primary" : "border-l-2 border-transparent"}`} isActive={activeSection === item.id} onClick={() => onSectionChange?.(item.id)}>
                                            <item.icon className='h-4 w-4' />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Actions Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => onSectionChange?.('servers')}>
                                    <Server className='h-4 w-4' />
                                    <span>Add Server</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => onSectionChange?.('monitoring')}>
                                    <Package className='h-4 w-4' />
                                    <span>Run Version Check</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>            

            {/* Sidebar Footer */}
            <SidebarFooter className='border-t border-sidebar-border'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => onSectionChange?.('settings')}>
                        	<Settings className='h-4 w-4' />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
