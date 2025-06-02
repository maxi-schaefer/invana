import { Database, Globe, MoreHorizontal, Package, Plus, Puzzle, Search, Settings, Trash, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getBadgeStyle } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { scriptApi } from "@/api/impl/scriptApt";
import Loading from "../ui/loading";
import { LinuxCommand } from "../ui/linux-install-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { isAdmin } from "@/utils/auth";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/types/User";

type ScriptItem = {
  name: string;
  description: string;
  script: string;
  category: string;
  usage: string;
};

type ScriptCategories = {
  [key: string]: ScriptItem[];
};

export default function ScriptLibrary() {
    const [searchTerm, setSearchTerm] = useState('');
    const [scriptCategories, setScriptCategories] = useState<ScriptCategories>({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 
    
    useEffect(() => {
      fetchScripts();
    }, [])
    
    const fetchScripts = async () => {
      try {
        const res = await scriptApi.getScripts();
        console.log(res);

        setLoading(false);
        
        setScriptCategories(res.data as ScriptCategories);
      } catch(e) {
        console.error(e)
      }
    }

    if(loading) return <Loading />

      const filteredScripts = Object.entries(scriptCategories).reduce(
        (acc: Partial<typeof scriptCategories>, [category, scripts]) => {
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
        {}
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
              <TabsList className="grid w-full grid-cols-5">
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

                <TabsTrigger value="customs" className="flex items-center gap-2">
                  <Puzzle className="h-4 w-4" />
                  Custom Scripts
                </TabsTrigger>
              </TabsList>
            
              {/* Scripts */}
              {Object.keys(scriptCategories).map((category) => {
                const scripts = filteredScripts[category as keyof typeof scriptCategories] || [];

                return (
                  <TabsContent key={category} value={category} className="space-y-6">
                    {scripts.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {scripts.map((script, index) => (
                          <Card key={index} className="border-l-4 border-l-primary">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{script.name}</CardTitle>
                                  <CardDescription>{script.description}</CardDescription>
                                </div>
                                <Badge className={getBadgeStyle(script.category)}>{script.category}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <LinuxCommand command={script.script} />
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Usage: {script.usage}</span>
                                
                                {
                                  category.toLowerCase() === "customs" && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant={"ghost"} size={"icon"}>
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>

                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <Settings className="text-muted-foreground w-4 h-4 mr-2" />
                                          Settings
                                        </DropdownMenuItem>
                                        
                                        { isAdmin(user as User) &&
                                          <>
                                            <DropdownMenuSeparator />
                                            
                                            <DropdownMenuItem className="text-destructive">
                                              <Trash className=" text-destructive w-4 h-4 mr-2" />
                                              Remove
                                            </DropdownMenuItem>
                                          </>
                                        }
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  ) 
                                }
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-6">
                        🤷‍♂️ No scripts found in this category.
                      </div>
                    )}
                  </TabsContent>
                );
              })}

            </Tabs>

        </div>
      );
}
