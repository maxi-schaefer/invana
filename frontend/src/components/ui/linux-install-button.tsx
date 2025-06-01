import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import type { AgentSettings } from "@/types/AgentSettings"

export function LinuxInstallCommand({ settings }: { settings: AgentSettings | null }) {
  const [copied, setCopied] = useState(false)

  const command = `curl -sS ${settings?.serverUrl}:${settings?.serverPort}/scripts/install.sh | sudo bash -s -- --token=${settings?.token} --serverUrl=${settings?.serverUrl} --serverPort=${settings?.serverPort}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">Linux</Label>
        <div className="relative bg-muted p-4 rounded-md mt-2">
          <pre className="text-sm overflow-x-auto">
            <code className="language-bash text-muted-foreground">
              # {command}
            </code>
          </pre>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
