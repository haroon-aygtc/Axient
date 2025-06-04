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
    <div className="flex h-screen bg-gradient-to-br from-[#AFDDE5]/30 via-[#AFDDE5]/20 to-[#964734]/10 dark:from-[#003135] dark:via-[#003135] dark:to-[#964734]/20">
      {/* Enhanced Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-r border-[#0FA4AF]/20 dark:border-[#024950] shadow-xl">
        <div className="h-16 px-6 border-b border-[#0FA4AF]/20 dark:border-[#024950] flex items-center bg-gradient-to-r from-[#964734]/5 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#964734] to-[#024950] rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#003135] dark:text-[#0FA4AF]">
                Axient
              </h1>
              <p className="text-xs text-[#964734] dark:text-[#AFDDE5] font-medium">
                AI Orchestration Platform
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-6">
          <nav className="space-y-1 px-4">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-[#964734] to-[#024950] text-white shadow-lg"
                      : "text-[#003135] dark:text-[#AFDDE5] hover:bg-gradient-to-r hover:from-[#964734]/10 hover:to-[#0FA4AF]/10 dark:hover:from-[#964734]/20 dark:hover:to-[#024950]/50 hover:text-[#964734] dark:hover:text-white hover:shadow-md",
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#964734]/20 to-[#024950]/20 animate-pulse"></div>
                  )}
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300 relative z-10",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#AFDDE5]/50 dark:bg-[#024950] text-[#024950] dark:text-[#AFDDE5] group-hover:bg-[#964734]/20 dark:group-hover:bg-[#964734]/30 group-hover:text-white group-hover:scale-110"
                  )}>
                    {link.icon}
                  </div>
                  <span className="ml-3 relative z-10">{link.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-[#AFDDE5] rounded-full animate-pulse relative z-10"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#964734]/20 dark:border-[#024950]">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#964734]/10 via-[#AFDDE5]/20 to-[#0FA4AF]/10 dark:from-[#964734]/20 dark:via-[#024950]/50 dark:to-[#003135] rounded-xl border border-[#964734]/30 dark:border-[#024950] hover:shadow-lg transition-all duration-300 group">
            <Avatar className="h-12 w-12 ring-2 ring-[#964734] group-hover:ring-[#0FA4AF] transition-all duration-300">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-[#964734] to-[#024950] text-white font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#003135] dark:text-white truncate group-hover:text-[#964734] dark:group-hover:text-[#AFDDE5] transition-colors duration-300">
                {user.name}
              </p>
              <p className="text-xs text-[#964734] dark:text-[#AFDDE5] truncate">
                {user.organization}
              </p>
            </div>
            <div className="w-2 h-2 bg-[#964734] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="h-16 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-b border-[#0FA4AF]/20 dark:border-[#024950] flex items-center justify-between px-6 shadow-sm">
          <div className="md:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#964734] to-[#024950] rounded-lg flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#003135] dark:text-[#0FA4AF]">
                Axient
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="border-[#964734]/30 dark:border-[#024950] hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 hover:border-[#964734] dark:hover:border-[#964734] text-[#964734] dark:text-[#AFDDE5] hover:text-[#964734] transition-all duration-300 group"
            >
              <MessageSquare className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Help
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 transition-all duration-300 group">
                  <Avatar className="h-9 w-9 ring-2 ring-[#964734] group-hover:ring-[#0FA4AF] transition-all duration-300">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#964734] to-[#024950] text-white font-semibold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-[#964734]/30 dark:border-[#024950] shadow-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1 p-2 bg-gradient-to-r from-[#964734]/5 to-[#0FA4AF]/5 rounded-lg">
                    <p className="text-sm font-semibold text-[#003135] dark:text-white">{user.name}</p>
                    <p className="text-xs text-[#964734] dark:text-[#AFDDE5]">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#964734]/30 dark:bg-[#024950]" />
                <DropdownMenuItem className="hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 transition-all duration-300 group">
                  <Settings className="h-4 w-4 mr-3 text-[#964734] dark:text-[#0FA4AF] group-hover:scale-110 transition-transform duration-300" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 transition-all duration-300 group">
                  <Users className="h-4 w-4 mr-3 text-[#964734] dark:text-[#0FA4AF] group-hover:scale-110 transition-transform duration-300" />
                  Team Management
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#964734]/30 dark:bg-[#024950]" />
                <DropdownMenuItem className="text-[#003135] dark:text-[#AFDDE5] hover:bg-[#964734]/20 dark:hover:bg-[#964734]/30 transition-all duration-300 group">
                  <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
