/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Database, Lock, Mail } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/impl/authApit';
import { useAuth } from '@/hooks/use-auth';
import { ModeToggle } from '@/components/ui/theme-toggle';
import DottedBackground from '@/components/ui/dotted-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Loading from '@/components/ui/loading';
import { toast } from 'sonner';
import PasswordInput from '@/components/ui/password-input';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { isAuthenticated, loading } = useAuth();
    const [iLoading, setLoading] = useState(false);

    if(loading) return <Loading />

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await authApi.login({ email, password });
    
            toast.success(`👋 Welcome back ${res.data.user.fullName}`);
            
            setLoading(false);
            login(res.data.token, res.data.user);
            navigate("/dashboard");
        } catch (error) {
            toast.error(`Invalid email or password`);
            setLoading(false);
        }

        console.log("login");
    }

    if(isAuthenticated) return <Navigate to={"/dashboard"} replace />

    return (
        <div
            className="flex items-center justify-center"
        >
            <DottedBackground />
            
            <div className="absolute z-10 top-4 right-4">
                <ModeToggle />
            </div>

            <div className="relative flex flex-col h-screen w-screen items-center justify-center">
                {/* Company logo and name */}
                <span className="flex items-center gap-2 self-center font-medium mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Database className="size-4" />
                    </div>
                    Invana
                </span>
            
                {/* Login Card */}
                <Card className='min-w-md relative sm:min-w-sm'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold text-primary'>Welcome back</CardTitle>
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
                                <PasswordInput password={password} onChange={(e) => setPassword(e.target.value)} id='password' />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)}  />
                                    <Label htmlFor='remember' className='text-sm font-normal'>Remember me</Label>
                                </div>

                                <Button variant={"link"} className='px-0 font-normal text-sm'>Forgot password?</Button>
                            </div>

                            <Button type='submit'className='w-full h-11' disabled={loading}>
                                {iLoading ? (
                                    <div className="animate-spin rounded-full border-2 border-gray-400 border-t-gray-900 h-5 w-5"/>
                                ) : ("Sign in")}
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
