import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Script Library</h1>
                <p className="text-muted-foreground">Predefined scripts for common service version checks</p>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search scripts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
        </div>
    );
}
