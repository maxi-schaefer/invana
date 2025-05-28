import { Database, Globe, Package, Plus, Search, Zap } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getBadgeStyle } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function ScriptLibrary() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mockup data for scripts
    const scriptCategories = {
        containers: [
          {
            name: "Docker Version",
            description: "Get Docker engine version",
            script: "docker --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Docker",
            usage: "Container management",
          },
          {
            name: "Docker Compose Version",
            description: "Get Docker Compose version",
            script: "docker-compose --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Docker",
            usage: "Container orchestration",
          },
          {
            name: "Kubernetes Version",
            description: "Get Kubernetes cluster version",
            script: "kubectl version --short | grep Server | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Kubernetes",
            usage: "Container orchestration",
          },
        ],
        databases: [
          {
            name: "PostgreSQL Version",
            description: "Get PostgreSQL server version",
            script: "psql --version | grep -o '[0-9]\\+\\.[0-9]\\+'",
            category: "PostgreSQL",
            usage: "Database management",
          },
          {
            name: "MySQL Version",
            description: "Get MySQL server version",
            script: "mysql --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "MySQL",
            usage: "Database management",
          },
          {
            name: "Redis Version",
            description: "Get Redis server version",
            script: "redis-server --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Redis",
            usage: "Cache management",
          },
          {
            name: "MongoDB Version",
            description: "Get MongoDB server version",
            script: "mongod --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "MongoDB",
            usage: "Document database",
          },
        ],
        webservers: [
          {
            name: "Nginx Version",
            description: "Get Nginx web server version",
            script: "nginx -v 2>&1 | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Nginx",
            usage: "Web server",
          },
          {
            name: "Apache Version",
            description: "Get Apache web server version",
            script: "apache2 -v | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Apache",
            usage: "Web server",
          },
          {
            name: "HAProxy Version",
            description: "Get HAProxy load balancer version",
            script: "haproxy -v | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "HAProxy",
            usage: "Load balancer",
          },
        ],
        runtimes: [
          {
            name: "Node.js Version",
            description: "Get Node.js runtime version",
            script: "node --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Node.js",
            usage: "JavaScript runtime",
          },
          {
            name: "Python Version",
            description: "Get Python interpreter version",
            script: "python3 --version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Python",
            usage: "Python runtime",
          },
          {
            name: "Java Version",
            description: "Get Java runtime version",
            script: "java -version 2>&1 | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Java",
            usage: "Java runtime",
          },
          {
            name: "Go Version",
            description: "Get Go compiler version",
            script: "go version | grep -o '[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+'",
            category: "Go",
            usage: "Go runtime",
          },
        ],
      }

      const filteredScripts = Object.entries(scriptCategories).reduce(
        (acc, [category, scripts]) => {
          const filtered = scripts.filter(script =>
            script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            script.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            script.category.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filtered.length > 0) {
            acc[category as keyof typeof scriptCategories] = filtered;
          }
          return acc;
        },
        {} as typeof scriptCategories
      );

      return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Script Library</h1>
                <p className="text-muted-foreground">Predefined scripts from the community for common service version checks</p>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search scripts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
              <div className="ml-auto">
                <Button className="font-bold">
                  <Plus /> 
                  Add Script
                </Button>
              </div>
            </div>


            {/* Tabs */}
            <Tabs defaultValue="containers" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="containers" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Containers  
                </TabsTrigger>

                <TabsTrigger value="databases" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Databases  
                </TabsTrigger>
                
                <TabsTrigger value="webservers" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Web Servers  
                </TabsTrigger>
                
                <TabsTrigger value="runtimes" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Runtime  
                </TabsTrigger>
              </TabsList>
            
              {/* Scripts */}
              {
                Object.entries(filteredScripts).map(([category, scripts]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {
                        scripts.map((script, index) => (
                          <Card key={index} className="border-l-4 border-l-primary">
                            {/* Card Header */}
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{script.name}</CardTitle>
                                  <CardDescription>{script.description}</CardDescription>
                                </div>

                                <Badge className={getBadgeStyle(script.category)}>{script.category}</Badge>
                              </div>
                            </CardHeader>

                            {/* Card Content */}
                            <CardContent className="space-y-4">
                              <div className="bg-muted p-3 rounded-md">
                                <code className="text-sm font-mono break-all">{script.script}</code>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Usage: {script.usage}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      }
                    </div>

                  </TabsContent>
                ))
              }
            </Tabs>

        </div>
      );
}
