import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Star, 
  Settings, 
  Bot,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/favorites", label: "Favorites", icon: Star },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/50 backdrop-blur-sm h-screen flex flex-col fixed left-0 top-0 z-50 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight">Automation<br/>Hub</h1>
        </div>
      </div>

      <div className="px-4 py-2 flex-1">
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "nav-item group",
                  isActive && "active"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@hub.com</p>
          </div>
          <button className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  
  const links = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/favorites", label: "Saved", icon: Star },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex justify-between z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
       {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
              {link.label}
            </Link>
          );
        })}
    </div>
  );
}
