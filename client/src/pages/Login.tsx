import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE } from "@/const";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success('Login successful!');
      // Redirect based on role
      if (data.user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/staff');
      }
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
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for opacity */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={APP_LOGO} alt="Logo" className="h-24 w-24 object-contain" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">{APP_TITLE}</CardTitle>
              <CardDescription className="text-base mt-2">
                Staff Management & Income Tracking System
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
                <TabsTrigger value="staff">Staff Login</TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-username"
                        type="text"
                        placeholder="Enter admin username"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Logging in...' : 'Login as Admin'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="staff">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="staff-username"
                        type="text"
                        placeholder="Enter staff username"
                        value={staffUsername}
                        onChange={(e) => setStaffUsername(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="staff-password"
                        type="password"
                        placeholder="Enter staff password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Logging in...' : 'Login as Staff'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="font-medium mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin9197 / Admin9197</p>
                <p><strong>Staff:</strong> ronytalukder / @jead2016R</p>
                <p><strong>Staff:</strong> mahir / Mahir3</p>
                <p><strong>Staff:</strong> sakiladnan / Sakiladnan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
