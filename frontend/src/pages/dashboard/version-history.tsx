import { Archive, Clock, Minus, RefreshCw, Search, TrendingDown, TrendingUp } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import DashboardHeader from "../../components/dashboard/dashboard-header"

export default function VersionHistory() {
    // Mockup data
    const versionHistory = [
        {
            id: 1,
            service: 'docker',
            server: 'prod-api-02',
            previousVersion: '24.0.6',
            currentVersion: '24.0.7',
            change: 'patch',
            timestamp: '2024-10-01 12:00:00',
            status: 'detected'
        },
        {
            id: 2,
            service: 'nginx',
            server: 'prod-web-01',
            previousVersion: '1.23.4',
            currentVersion: '1.24.0',
            change: 'minor',
            timestamp: '2024-10-02 14:30:00',
            status: 'updated'
        },
        {
            id: 3,
            service: 'node.js',
            server: 'dev-app-03',
            previousVersion: '18.16.0',
            currentVersion: '16.6.0',
            change: 'downgrade',
            timestamp: '2024-10-03 09:15:00',
            status: 'rollback'
        },
        {
            id: 4,
            service: 'mysql',
            server: 'prod-db-01',
            previousVersion: '8.0.28',
            currentVersion: '8.0.30',
            change: 'patch',
            timestamp: '2024-10-04 11:45:00',
            status: 'updated'
        }
    ]

    const getChangeIcon = (change: string) => {
        switch (change) {
            case 'minor':
            case 'major':
                return <TrendingUp className="h-4 w-4 text-green-500" />
            case 'downgrade':
                return <TrendingDown className="h-4 w-4 text-red-500" />
            case 'patch':
                return <Minus className="h-4 w-4 text-blue-500" />
            default:
                return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    const getChangeVariant = (change: string) => {
        switch (change) {
            case "major":
                return "destructive"
            case "minor":
                return "default"
            case "patch":
                return "secondary"
            case "downgrade":
                return "destructive"
            default:
                return "outline"
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "updated":
                return "default"
            case "detected":
                return "secondary"
            case "rollback":
                return "destructive"
            default:
                return "outline"
        }
    }

    return (
        <div className="space-y-6">
            <DashboardHeader title="Version History" description="Track version changes across your services." />

            <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2 flex-1">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search version history..." className="max-w-sm" />
                </div>

                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px}">
                        <SelectValue placeholder="Filter by change" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all"><Archive /> All Changes</SelectItem>
                        <SelectItem value="major"><TrendingUp /> Major Updates</SelectItem>
                        <SelectItem value="minor"><TrendingUp /> Minor Updates</SelectItem>
                        <SelectItem value="patch"><TrendingUp /> Patch Updates</SelectItem>
                        <SelectItem value="downgrade"><TrendingDown /> Downgrades</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="space-y-4">
                {
                    versionHistory.map((entry) => (
                        <Card key={entry.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {getChangeIcon(entry.change)}
                                        <div>
                                        <CardTitle className="text-lg">
                                            {entry.service} on {entry.server}
                                        </CardTitle>

                                        <CardDescription>
                                            {entry.previousVersion} &rarr; {entry.currentVersion} ({entry.change})
                                        </CardDescription>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={getStatusVariant(entry.status)}>{entry.status}</Badge>
                                    </div>
                                    
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                                        <div>
                                            <span className="font-medium">Previous:</span> {entry.previousVersion}
                                        </div>

                                        <div>
                                            <span className="font-medium">Current:</span> {entry.currentVersion}
                                        </div>

                                        <div>
                                            <span className="font-medium">Change:</span> <Badge variant={getChangeVariant(entry.change)}>{entry.change}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}
