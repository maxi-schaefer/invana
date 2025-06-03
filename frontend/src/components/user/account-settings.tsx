import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Upload, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { userApi } from "@/api/impl/userApi";
import type { User } from "@/types/User";

export default function AccountSettings() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const { user } = useAuth();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(userApi.getAvatarUrl(user as User) || null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    const handleSaveProfile = async () => {
        setIsUpdating(true);

        try {
            const formData = new FormData();
            const userJson = {
                "fullName": "Max Schäfer"
            };

            formData.append("user", new Blob([JSON.stringify(userJson)], { type: "application/json" }));
            formData.append("avatar", avatarFile || "");

            const res = await userApi.updateUser(user?.id || "", formData);
            console.log(res);
            
        } catch (error) {
            toast.error("Error whilst updating user!")
            console.error(error);
        }
        
        setIsUpdating(false);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("us-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and settings</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Update your personal details and profile picture</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={avatarPreview || "deimuada"} />
                                        <AvatarFallback>{user?.fullName.at(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex gap-2">
                                        <Button variant={"outline"} size={"sm"} className="relative">
                                            <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAvatarChange} />
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 w-full">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="full-name">Full Name</Label>
                                            <Input id="full-name" defaultValue={user?.fullName} />
                                        </div>
                                
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue={user?.email} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="user-id">User Id</Label>
                                            <Input id="user-id" defaultValue={user?.id} disabled className="bg-muted" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="user-role">Role</Label>
                                            <div className="flex items-center gap-2">
                                                <Input id="user-role" className="bg-muted flex-1" disabled defaultValue={user?.role} />
                                                <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>{user?.role}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-joined">Member since</Label>
                                        <Input id="user-joined" defaultValue={formatDate(user?.createdAt || "0")} disabled className="bg-muted" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">Last Updated: {formatDate(user?.updatedAt || "0")}</div>
                                <Button onClick={handleSaveProfile} disabled={isUpdating}>
                                    { isUpdating ? "Saving..." : "Save Changes" }
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
