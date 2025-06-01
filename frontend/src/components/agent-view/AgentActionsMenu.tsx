import { Monitor, MoreHorizontalIcon, Settings, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import type ServerType from '@/types/ServerType'
import { isAdmin } from '@/utils/auth'
import { useAuth } from '@/hooks/use-auth'
import type { User } from '@/types/User'


export default function AgentActionsMenu({ onDeny, server }: { onDeny: (id: string) => void, server: ServerType }) {

    const { user } = useAuth();

  return (
   <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Monitor className="h-4 w-4 mr-2" />
                Check Status
            </DropdownMenuItem>

            {
                isAdmin(user as User) && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeny(server.id)}>
                            <Trash className="h-4 w-4 mr-2 text-destructive" />
                            Remove
                        </DropdownMenuItem>
                    </>
                )
            }
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
