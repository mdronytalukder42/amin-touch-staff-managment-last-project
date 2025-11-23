import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO } from "@/const";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

const backgroundImages = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/bg3.jpg",
];

export default function Login() {
  const [, setLocation] = useLocation();
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success('Login successful!');
      setTimeout(() => {
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/staff';
        }
      }, 500);
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      username: adminUsername,
      password: adminPassword,
    });
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      username: staffUsername,
      password: staffPassword,
    });
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Top Footer */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-b border-purple-700/50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-bold text-xs">HTML</span>
              <span className="text-slate-300 text-xs">HTML5</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-blue-400 font-bold text-xs">CSS</span>
              <span className="text-slate-300 text-xs">CSS3</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-yellow-300 font-bold text-xs">JS</span>
              <span className="text-slate-300 text-xs">JavaScript</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-cyan-400 font-bold text-xs">TS</span>
              <span className="text-slate-300 text-xs">TypeScript</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-blue-400 font-bold text-xs">React</span>
              <span className="text-slate-300 text-xs">React 19</span>
            </div>
            
            <div className="text-slate-400 text-xs ml-auto">
              © 2025 AMIN TOUCH. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Background slideshow */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              idx === currentBgIndex ? 'opacity-20' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80" />
      </div>

      {/* Content - Two Column Layout */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-6xl flex items-center justify-between gap-12">
          
          {/* Left Side - Decorative Illustration */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-48 h-64">
              {/* Decorative Lamp/Light */}
              <svg viewBox="0 0 200 300" className="w-full h-full">
                {/* Lamp base */}
                <circle cx="100" cy="250" r="20" fill="#4ade80" opacity="0.3" />
                <rect x="90" y="240" width="20" height="20" fill="#22c55e" />
                
                {/* Lamp stand */}
                <line x1="100" y1="240" x2="100" y2="120" stroke="#22c55e" strokeWidth="8" />
                
                {/* Lamp shade - curved */}
                <path d="M 70 120 Q 50 100 60 60 Q 70 40 100 35 Q 130 40 140 60 Q 150 100 130 120" 
                      fill="#86efac" opacity="0.7" stroke="#22c55e" strokeWidth="2" />
                
                {/* Light glow */}
                <circle cx="100" cy="70" r="40" fill="#22c55e" opacity="0.1" />
                <circle cx="100" cy="70" r="25" fill="#22c55e" opacity="0.2" />
              </svg>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full max-w-md flex-1">
            <Card className="bg-slate-900/95 backdrop-blur-md border-2 border-green-500 shadow-2xl rounded-xl">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="flex justify-center">
                  <img src={APP_LOGO} alt="Logo" className="h-16 w-16" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-slate-400 mt-2">
                    Staff Management & Income Tracking System
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="admin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                    <TabsTrigger 
                      value="admin" 
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300"
                    >
                      Admin Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="staff"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300"
                    >
                      Staff Login
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="admin" className="space-y-4 mt-6">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-username" className="text-slate-300">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            id="admin-username"
                            type="text"
                            placeholder="Enter admin username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            required
                            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin-password" className="text-slate-300">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            id="admin-password"
                            type="password"
                            placeholder="Enter admin password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="staff" className="space-y-4 mt-6">
                    <form onSubmit={handleStaffLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="staff-username" className="text-slate-300">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            id="staff-username"
                            type="text"
                            placeholder="Enter staff username"
                            value={staffUsername}
                            onChange={(e) => setStaffUsername(e.target.value)}
                            required
                            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="staff-password" className="text-slate-300">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            id="staff-password"
                            type="password"
                            placeholder="Enter staff password"
                            value={staffPassword}
                            onChange={(e) => setStaffPassword(e.target.value)}
                            required
                            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
