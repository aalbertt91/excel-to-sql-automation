import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Favorites from "@/pages/Favorites";
import Settings from "@/pages/Settings";
import { Sidebar, MobileNav } from "@/components/Sidebar";

function Router() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/projects" component={Projects} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
