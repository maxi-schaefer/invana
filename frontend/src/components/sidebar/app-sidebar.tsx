import { Activity, Database, History, Home, Library, LogOut, Package, Server, Settings, UserCog } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { AvatarImage } from '../ui/avatar';
import DefaultAvatar from '../../assets/DefaultAvatar.svg'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';

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

    const { user, logout } = useAuth();

    return (
        <Sidebar collapsible='icon' >
        <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
                <div className={`flex ${useSidebar().open ? "h-8 w-8" : "h-6 w-6"} aspect-square items-center justify-center rounded-lg bg-primary`}>
                    <Database className={`${useSidebar().open ? "h-5 w-5" : "h-4 w-4"} text-primary-foreground`} />
                </div>

                {useSidebar().open && (
                    <div className='flex w-full justify-between'>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-lg text-primary">Invana</span>
                            <span className="text-xs text-muted-foreground">Inventory Manager</span>
                    
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-sidebar-accent transition-colors cursor-pointer">
                                    <Avatar className='h-8 w-8'>
                                        <AvatarImage className='rounded-full' src={"https://avatars.githubusercontent.com/u/124599?v=4"} alt={user?.fullName} />
                                        <AvatarFallback><img src={DefaultAvatar} alt="" /></AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-56'>
                                <div className="flex items-center gap-2 p-2">
                                    <Avatar className='h-8 w-8'>
                                        <AvatarImage className='rounded-full' src={"https://avatars.githubusercontent.com/u/124599?v=4"} alt={user?.fullName} />
                                        <AvatarFallback><img src={DefaultAvatar} alt="" /></AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{user?.fullName}</span>
                                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                                    </div>
                                </div>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem>
                                    <UserCog className='h-4 w-4 mr-2'/>
                                    Account Settings
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={logout} className='text-destructive focus:text-destructive'>
                                    <LogOut className='h-4 w-4 mr-2 text-destructive' />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
