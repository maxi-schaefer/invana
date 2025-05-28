import { AlertTriangle, CheckCircle, Package, Server } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function DashboardOverview() {

  const stats = [
    {
      title: "Total Servers",
      value: "5",
      description: "Servers in inventory",
      icon: Server,
      trend: "+3 this month",
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
      iconColor: "text-primary"
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className='flex items-start flex-col'>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Dashboard</h1>
        <p className="text-muted-foreground">Monitor service versions across your infrastructure</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
