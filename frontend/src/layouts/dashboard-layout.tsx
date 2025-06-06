import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from '../components/sidebar/app-sidebar';
import { SidebarInset, SidebarTrigger } from '../components/ui/sidebar';
import DottedBackground from '../components/ui/dotted-background';
import { ModeToggle } from '../components/ui/theme-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Badge } from '../components/ui/badge';
import { Kbd } from '../components/command-menu/kbd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Github } from 'lucide-react';
import { version } from '../../package.json';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentSection = location.pathname.split('/')[2] || 'dashboard';

  return (
    <>
      <AppSidebar
        onSectionChange={(section) => navigate(`/dashboard/${section}`)}
      />

      <SidebarInset>
        <DottedBackground zIndex="1" />
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b z-20">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-muted-foreground">
                  Invana
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{currentSection}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </Badge>
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 z-20">
          <Outlet />

          <div className="fixed bottom-4 right-4 flex items-center space-x-4">
            <Badge variant={'outline'}>
              <span className="text-muted-foreground">{version}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/maxi-schaefer/invana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground text-muted-foreground"
                    >
                      <Github className="h-4 w-4" />
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
  );
}
