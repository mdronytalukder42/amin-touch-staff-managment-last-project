import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { ArrowRight } from "lucide-react";

const backgroundImages = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/bg3.jpg",
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={APP_LOGO} 
              alt="AMIN TOUCH Logo" 
              className="h-32 w-32 drop-shadow-2xl animate-pulse"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              AMIN TOUCH
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 drop-shadow-md">
              TRADING CONTRACTING & HOSPITALITY SERVICES
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
            Staff Management & Income Tracking System
          </p>

          {/* Login Button */}
          <div className="pt-8">
            <Button
              onClick={() => setLocation('/login')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-6 text-lg rounded-full shadow-2xl transform transition-all hover:scale-105"
            >
              Login to System
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-white font-semibold mb-2">Income Tracking</h3>
              <p className="text-slate-400 text-sm">Track daily income and OTP payments</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">✈️</div>
              <h3 className="text-white font-semibold mb-2">Ticket Management</h3>
              <p className="text-slate-400 text-sm">Manage flight tickets and bookings</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-white font-semibold mb-2">Staff Dashboard</h3>
              <p className="text-slate-400 text-sm">Individual dashboards for each staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 py-6 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} AMIN TOUCH. All rights reserved.
        </p>
      </div>
    </div>
  );
}
