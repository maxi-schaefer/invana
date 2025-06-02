import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import type ServerType from '@/types/ServerType'
import { Badge } from '../ui/badge'
import { getBadgeStyle } from '@/lib/utils'

export default function AgentEnvironmentSelect({ onUpdate, server }: { onUpdate: (value: string) => void, server: ServerType }) {
  return (
    <div className="space-y-1">
        <Label className="text-sm font-medium">Environment</Label>
        <Select
            value={server.environment}
            onValueChange={onUpdate}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="production">
                    <Badge className={getBadgeStyle("Production")}>Production</Badge>
                </SelectItem>
                <SelectItem value="staging">
                    <Badge className={getBadgeStyle("Staging")}>Staging</Badge>
                </SelectItem>
                <SelectItem value="development">
                    <Badge className={getBadgeStyle("Development")}>Development</Badge>
                </SelectItem>
                <SelectItem value="testing">
                    <Badge className={getBadgeStyle("Testing")}>Testing</Badge>
                </SelectItem>
            </SelectContent>
        </Select>
    </div>
  )
}
