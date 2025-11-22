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
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* Animated Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentBgIndex ? 'opacity-20' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-md border-slate-700 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <img src={APP_LOGO} alt="Logo" className="h-20 w-20" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">AMIN TOUCH Staff Management</CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                Staff Management & Income Tracking System
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700 border border-slate-600">
                <TabsTrigger 
                  value="admin" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
                >
                  Admin Login
                </TabsTrigger>
                <TabsTrigger 
                  value="staff"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300"
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
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
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
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Logging in...' : 'Login as Admin'}
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
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
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
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Logging in...' : 'Login as Staff'}
                  </Button>
                </form>


              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-t border-purple-700/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-sm">HTML</span>
              </div>
              <span className="text-slate-300 text-sm">HTML5</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">CSS</span>
              </div>
              <span className="text-slate-300 text-sm">CSS3</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-300/20 flex items-center justify-center">
                <span className="text-yellow-300 font-bold text-sm">JS</span>
              </div>
              <span className="text-slate-300 text-sm">JavaScript</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">TS</span>
              </div>
              <span className="text-slate-300 text-sm">TypeScript</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">React</span>
              </div>
              <span className="text-slate-300 text-sm">React 19</span>
            </div>
          </div>
          
          <div className="mt-3 text-center text-slate-400 text-xs">
            © 2025 AMIN TOUCH. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
