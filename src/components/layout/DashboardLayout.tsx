import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Database,
  Workflow,
  FileText,
  Globe,
  BarChart3,
  Users,
  CreditCard,
  MessageSquare,
  LogOut,
  Brain,
  Bot,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Mock user data - in a real app this would come from authentication context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    organization: "Acme Inc.",
  };

  const sidebarLinks = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "AI Providers",
      icon: <Bot className="h-5 w-5" />,
      path: "/providers",
    },
    {
      name: "Knowledge Base",
      icon: <Brain className="h-5 w-5" />,
      path: "/knowledge-base",
    },
    {
      name: "External APIs",
      icon: <Globe className="h-5 w-5" />,
      path: "/apis",
    },
    {
      name: "Workflows",
      icon: <Workflow className="h-5 w-5" />,
      path: "/workflows",
    },
    {
      name: "Prompt Templates",
      icon: <FileText className="h-5 w-5" />,
      path: "/prompts",
    },
    {
      name: "Widget Generator",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/widgets",
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/analytics",
    },
    {
      name: "Users & Roles",
      icon: <Users className="h-5 w-5" />,
      path: "/users",
    },
    {
      name: "Billing",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/billing",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Axient</h1>
              <p className="text-xs text-muted-foreground">
                AI Orchestration Platform
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-3">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.organization}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Axient</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Help
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  Team Management
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
