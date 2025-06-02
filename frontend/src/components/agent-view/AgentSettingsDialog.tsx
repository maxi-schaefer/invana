import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import type ServerType from '@/types/ServerType'
import AgentEnvironmentSelect from './AgentEnvironmentSelect'
import { useState } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { agentApi } from '@/api/impl/agentApi';
import { RefreshCw } from 'lucide-react';

export default function AgentSettingsDialog({ agent, open, onOpenChange }: { agent: ServerType, open: boolean, onOpenChange: (value: boolean) => void }) {
  
  const [updatedAgent, setUpdatedAgent] = useState<ServerType>(agent);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateAgent = (key: string, value: string) => {
    setUpdatedAgent({...updatedAgent, [key]: value});
  }

  const handleAgentUpdate = async () => {
    setIsUpdating(true);
    try {
      await agentApi.updateAgent(agent.id, updatedAgent);
      

      toast.success(`Successfully updated ${agent.name}!`)
      onOpenChange(true);
      setIsUpdating(false);
    } catch (error) {
      toast.error("Error whilst updating agent!");
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); setUpdatedAgent(agent)}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Settings for {agent.name}</DialogTitle> 
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor='name' className='text-sm'>Name</Label>
            <Input defaultValue={updatedAgent.name} onChange={(e) => updateAgent("name", e.target.value)} placeholder='server-01' />
          </div>
          
          <AgentEnvironmentSelect onUpdate={(v) => {updateAgent("environment", v)}} server={updatedAgent} />
        </div>


        <DialogFooter>
          
          <Button variant={"outline"} asChild>
            <DialogClose>Close</DialogClose>
          </Button>

          <Button onClick={() => handleAgentUpdate()} disabled={isUpdating}>
            {isUpdating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Save Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
