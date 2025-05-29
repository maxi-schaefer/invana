import React, { useState } from 'react'
import { ModeToggle } from '../ui/theme-toggle';
import { Database, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import DottedBackground from '../ui/dotted-background';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("login");
    }

    return (
        <div
            className="flex items-center justify-center"
        >
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <DottedBackground />

            <div className="relative flex flex-col h-screen items-center justify-center">
                {/* Company logo and name */}
                <span className="flex items-center gap-2 self-center font-medium mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Database className="size-4" />
                    </div>
                    Ivana
                </span>
            
                {/* Login Card */}
                <Card className='min-w-md relative sm:min-w-sm'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold text-primary'>👋 Welcome back</CardTitle>
                        <CardDescription>Sign in to your account to continue</CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-6'>
                        <form onSubmit={handleLogin} className='space-y-4'>
                            <div className="space-y-2">
                                <Label htmlFor='email'><Mail className='h-4 w-4 text-muted-foreground' /> Email</Label>
                                <Input id='email' type='email' placeholder='john.doe@company.com' value={email} onChange={(e) => setEmail(e.target.value)} required className='h-11' />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password"><Lock className='h-4 w-4 text-muted-foreground' /> Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)}  />
                                    <Label htmlFor='remember' className='text-sm font-normal'>Remember me</Label>
                                </div>

                                <Button variant={"link"} className='px-0 font-normal text-sm'>Forgot password?</Button>
                            </div>

                            <Button type='submit'className='w-full h-11'>
                                Sign in
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        Don't have an account?{" "}
                        <Button variant={"link"} className='px-0 font-normal'>
                            Contact you administrator
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    )
}
