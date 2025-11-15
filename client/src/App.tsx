import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import { useAuth } from "./_core/hooks/useAuth";

function ProtectedRoute({ 
  component: Component, 
  requiredRole 
}: { 
  component: React.ComponentType; 
  requiredRole?: 'admin' | 'user' 
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    return <Redirect to={user.role === 'admin' ? '/admin' : '/staff'} />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} requiredRole="admin" />}
      </Route>
      <Route path="/staff">
        {() => <ProtectedRoute component={StaffDashboard} requiredRole="user" />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
