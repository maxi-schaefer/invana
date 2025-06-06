import { AlertTriangle, CheckCircle, Clock, Package, Server, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { getBadgeStyle } from '@/lib/utils'
import { Button } from '../../components/ui/button'
import DashboardHeader from '../../components/dashboard/dashboard-header'
import { useEffect, useState } from 'react'
import type ServerType from '@/types/ServerType'
import { agentApi } from '@/api/impl/agentApi'

export default function DashboardOverview() {
  const [servers, setServers] = useState<ServerType[]>([])

  const fetchServers = async () => {
    try {
      const res = await agentApi.getAgents();
      setServers(res.data as any)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServers();
  });

  // Trend calculation
  const now = new Date();
  const thisMonth = servers.filter(server => new Date(server.createdAt).getMonth() === now.getMonth() && new Date(server.createdAt).getFullYear() === now.getFullYear()).length
  const lastMonth = servers.filter(server => {
    const date = new Date(server.createdAt)
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1)
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
  })

  const trend = thisMonth - lastMonth.length;
  const trendText = `${trend >= 0 ? "+" : ""}${trend} this month`

  // Stats data
  const stats = [
    {
      title: "Total Servers",
      value: servers.length,
      description: "Servers in inventory",
      icon: Server,
      trend: trendText,
      iconColor: "text-primary"
    },
    {
      title: "Monitored Services",
      value: "12",
      description: "Services being tracked",
      icon: Package,
      trend: "+2 this month",
      iconColor: "text-primary"
    },
    {
      title: "Version Checks",
      value: "1,243",
      description: "Checks this month",
      icon: CheckCircle,
      trend: "+18% from last month",
      iconColor: "text-success"
    },
    {
      title: "Outdated Services",
      value: "7",
      description: "Need updates",
      icon: AlertTriangle,
      trend: "-3 from last week",
      iconColor: "text-warning"
    }
  ]

  // recentChecksData
  const recentChecks = [
    {
      server: "prod-web-01",
      service: "nginx",
      version: "1.18.0",
      status: "up-to-date",
      lastCheck: "2 minutes ago",
    },
    {
      server: "prod-api-01",
      service: "docker",
      version: "24.0.7",
      status: "outdated",
      lastCheck: "5 minutes ago",
    },
    {
      server: "dev-db-02",
      service: "postgresql",
      version: "15.4",
      status: "error",
      lastCheck: "15 minutes ago",
    },
  ]

  const serversByEnvironment = [
    {
      env: "Production",
      count: servers.filter(server => server.environment.toLowerCase() === "production").length,
    },
    {
      env: "Staging",
      count: servers.filter(server => server.environment.toLowerCase() === "staging").length,
    },
    {
      env: "Development",
      count: servers.filter(server => server.environment.toLowerCase() === "development").length,
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <DashboardHeader title='Inventory Dashboard' description='Monitor service versions across your infrastructure' />

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 -mb-4'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-success mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Checks Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className='text-primary h-5 w-5' />
              Recent Version Checks
            </CardTitle>

            <CardDescription>Latest service version verifications</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {
                recentChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {check.service} on {check.server}
                      </p>

                      <p className="text-xs text-muted-foreground">Version: {check.version}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getBadgeStyle(check.status)}>{check.status}</Badge>
                      <span className="text-xs text-muted-foreground">{check.lastCheck}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Enviroment Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className='h-5 w-5 text-primary' />
              Enviroment Overview
            </CardTitle>

            <CardDescription>Server distribution by environment</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {
                serversByEnvironment.map((env, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{env.env}</p>
                      <p className="text-xs text-muted-foreground">{env.count} servers</p>
                    </div>

                    <Badge className={getBadgeStyle(env.env)}>{env.env.toLowerCase()}</Badge>
                  </div>
                ))
              }

              <div className="pt-4 space-y-2">
                <Button className='w-full'>
                  <Server className='h-4 w-4 mr-2' />
                  View All Servers
                </Button>

                <Button className='w-full' variant='outline'>
                  <Package className='h-4 w-4 mr-2' />
                  Manage Services
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
