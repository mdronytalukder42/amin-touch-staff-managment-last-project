import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Building2, Users, TrendingUp, Ticket } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/staff');
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-10 w-10" />}
            <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
          </div>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <Building2 className="h-20 w-20 mx-auto mb-6 text-primary" />
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AMIN TOUCH Staff Management
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive system for staff to manage and track their daily income and ticket data. 
            Admins can oversee all staff activities, view summaries, and download invoices.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-green-600" />
              <CardTitle>Income Tracking</CardTitle>
              <CardDescription>
                Track daily income additions, deductions, and payments with detailed records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Income Add/Minus entries</li>
                <li>• Payment tracking</li>
                <li>• Date-wise filtering</li>
                <li>• Detailed descriptions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Ticket className="h-12 w-12 mb-4 text-blue-600" />
              <CardTitle>Ticket Management</CardTitle>
              <CardDescription>
                Manage flight tickets with comprehensive details and status tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Flight booking records</li>
                <li>• PNR and passenger details</li>
                <li>• One-way & return trips</li>
                <li>• Status updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 mb-4 text-purple-600" />
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Comprehensive overview and management tools for administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• View all staff activities</li>
                <li>• Summary statistics</li>
                <li>• Invoice generation</li>
                <li>• User management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
