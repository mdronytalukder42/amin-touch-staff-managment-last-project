import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Check } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleLoginClick = () => {
    setLocation("/login");
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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/80"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={APP_LOGO} alt="Logo" className="h-32 w-32 object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {APP_TITLE}
          </h1>
          <p className="text-xl text-gray-200 mb-2">
            Staff Management & Income Tracking System
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A comprehensive system for managing staff data, tracking daily income, and monitoring OTP transactions.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform"
            onClick={handleLoginClick}
          >
            Login to System
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="bg-white/95 backdrop-blur border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-600">Admin Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>View all staff data and transactions</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Monitor daily income & OTP system</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Filter by month and staff member</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>View comprehensive summary reports</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Manage system and staff accounts</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-blue-600">Staff Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Enter daily income data</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Record OTP transactions</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Auto-calculated totals</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>View personal monthly statistics</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Manage personal account settings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-gray-300 text-sm">
          <p>© 2025 AMIN TOUCH. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
