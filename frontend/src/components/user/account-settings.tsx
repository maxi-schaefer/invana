import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Upload, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import DefaultAvatar from '../../assets/DefaultAvatar.svg'
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function AccountSettings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const { user } = useAuth();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    const handleSaveProfile = () => {
        setIsUpdating(true);

        setTimeout(() => setIsUpdating(false), 3000);
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
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Update your personal details and profile picture</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={avatarPreview || "deimuada"} />
                                        <AvatarFallback><img src={DefaultAvatar} alt="" /></AvatarFallback>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="full-name">Full Name</Label>
                                        <Input id="full-name" defaultValue={user?.fullName} />
                                    </div>
                            
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={user?.email} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
