import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Brain,
  Database,
  Zap,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Globe,
  Shield,
  TrendingUp,
  Activity,
  CheckCircle,
  ArrowRight,
  Plus,
  Workflow,
  Sparkles,
  Target,
  Rocket,
  Clock,
  Star,
  Play,
  ChevronRight,
  Lightbulb,
  Gauge,
  Award,
  Layers,
} from "lucide-react";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      id: "workflows",
      title: "AI Workflows",
      description: "Create and manage intelligent automation workflows",
      icon: <Bot className="h-8 w-8" />,
      gradient: "from-[#003135] to-[#024950]",
      link: "/workflows",
      stats: "5 Active",
      color: "text-[#024950]",
    },
    {
      id: "knowledge",
      title: "Knowledge Base",
      description: "Upload and manage your AI knowledge sources",
      icon: <Brain className="h-8 w-8" />,
      gradient: "from-[#024950] to-[#0FA4AF]",
      link: "/knowledge-base",
      stats: "3 Sources",
      color: "text-[#024950]",
    },
    {
      id: "providers",
      title: "AI Providers",
      description: "Configure OpenAI, Claude, and other AI providers",
      icon: <Sparkles className="h-8 w-8" />,
      gradient: "from-[#0FA4AF] to-[#AFDDE5]",
      link: "/providers",
      stats: "2 Connected",
      color: "text-[#024950]",
    },
    {
      id: "widgets",
      title: "Chat Widgets",
      description: "Generate embeddable chat widgets for your website",
      icon: <MessageSquare className="h-8 w-8" />,
      gradient: "from-[#964734] to-[#024950]",
      link: "/widgets",
      stats: "1 Active",
      color: "text-[#964734]",
    },
    {
      id: "apis",
      title: "External APIs",
      description: "Connect to CRM, databases, and external services",
      icon: <Globe className="h-8 w-8" />,
      gradient: "from-[#024950] to-[#964734]",
      link: "/apis",
      stats: "7 Connected",
      color: "text-[#024950]",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Monitor performance and user interactions",
      icon: <BarChart3 className="h-8 w-8" />,
      gradient: "from-[#003135] to-[#0FA4AF]",
      link: "/analytics",
      stats: "1.2K Users",
      color: "text-[#003135]",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Workflow Created",
      description: "Customer Support Automation workflow was created",
      time: "2 hours ago",
      icon: <Bot className="h-4 w-4" />,
      color: "bg-[#0FA4AF]/20 text-[#024950]",
    },
    {
      id: 2,
      action: "Knowledge Updated",
      description: "Product documentation was uploaded and processed",
      time: "5 hours ago",
      icon: <Brain className="h-4 w-4" />,
      color: "bg-[#AFDDE5]/50 text-[#003135]",
    },
    {
      id: 3,
      action: "API Connected",
      description: "CRM integration was successfully established",
      time: "1 day ago",
      icon: <Globe className="h-4 w-4" />,
      color: "bg-[#964734]/20 text-[#964734]",
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header - Inline Breadcrumb Style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-[#024950]" />
          <h1 className="text-xl font-semibold text-[#003135] dark:text-white">Dashboard</h1>
        </div>
      </div>

      <div className="space-y-8">
        {/* Enhanced Hero Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#964734] via-[#024950] to-[#0FA4AF] rounded-3xl mb-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#964734] via-[#024950] to-[#0FA4AF] rounded-3xl animate-pulse opacity-75"></div>
            <Rocket className="h-12 w-12 text-white relative z-10" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#964734] rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#003135] dark:text-white mb-6 bg-gradient-to-r from-[#003135] via-[#024950] to-[#964734] bg-clip-text text-transparent dark:from-white dark:via-[#AFDDE5] dark:to-[#964734]">
            Welcome to Axient
          </h1>
          <p className="text-xl text-[#024950] dark:text-[#AFDDE5] max-w-4xl mx-auto leading-relaxed mb-8">
            Your AI orchestration platform. Build intelligent workflows, manage knowledge bases,
            and deploy AI-powered solutions with enterprise-grade reliability and sophistication.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-[#964734]/20 text-[#964734] border-[#964734]/30 px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Enterprise Ready
            </Badge>
            <Badge className="bg-[#0FA4AF]/20 text-[#024950] border-[#0FA4AF]/30 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Secure & Compliant
            </Badge>
            <Badge className="bg-[#024950]/20 text-[#024950] border-[#024950]/30 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Lightning Fast
            </Badge>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Active Workflows",
              value: "5",
              change: "+2 this week",
              icon: Bot,
              color: "from-[#0FA4AF] to-[#024950]",
              bgColor: "bg-[#0FA4AF]/20",
              textColor: "text-[#024950]",
              borderColor: "border-[#0FA4AF]/30",
              progress: 85,
            },
            {
              title: "Knowledge Sources",
              value: "3",
              change: "Updated today",
              icon: Brain,
              color: "from-[#024950] to-[#003135]",
              bgColor: "bg-[#024950]/20",
              textColor: "text-[#024950]",
              borderColor: "border-[#024950]/30",
              progress: 60,
            },
            {
              title: "API Connections",
              value: "7",
              change: "All healthy",
              icon: Globe,
              color: "from-[#964734] to-[#024950]",
              bgColor: "bg-[#964734]/20",
              textColor: "text-[#964734]",
              borderColor: "border-[#964734]/30",
              progress: 100,
            },
            {
              title: "Total Users",
              value: "1.2K",
              change: "+12% growth",
              icon: Users,
              color: "from-[#964734] to-[#0FA4AF]",
              bgColor: "bg-[#964734]/20",
              textColor: "text-[#964734]",
              borderColor: "border-[#964734]/30",
              progress: 75,
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950] shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${activeMetric === index ? 'ring-2 ring-[#964734]/50 shadow-[#964734]/20' : ''
                }`}
              style={{
                animationDelay: `${index * 150}ms`,
                animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none',
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-[#024950] dark:text-[#AFDDE5]">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#003135] dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Progress value={stat.progress} className="h-2" />
                  <Badge className={`${stat.bgColor} ${stat.textColor} ${stat.borderColor}`}>
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickActions.map((action, index) => (
            <Link key={action.id} to={action.link} className="group">
              <Card
                className="h-full bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950] shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-[#964734] dark:hover:border-[#964734] overflow-hidden hover:scale-105 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isLoaded ? 'fadeInUp 0.8s ease-out forwards' : 'none',
                }}
              >
                {/* Enhanced Card Header with Gradient */}
                <div className={`h-36 bg-gradient-to-r ${action.gradient} relative overflow-hidden group-hover:h-40 transition-all duration-500`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative p-6 h-full flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-2xl transition-all duration-300">{action.title}</h3>
                      <p className="text-white/90 text-sm flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        {action.stats}
                      </p>
                    </div>
                    <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                  </div>
                  {/* Floating accent */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-[#964734] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                </div>

                {/* Enhanced Card Content */}
                <CardContent className="p-6 group-hover:p-8 transition-all duration-300">
                  <p className="text-[#024950] dark:text-[#AFDDE5] mb-6 leading-relaxed group-hover:text-[#003135] dark:group-hover:text-white transition-colors duration-300">
                    {action.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-[#964734]" />
                      <span className={`text-sm font-medium ${action.color} group-hover:text-[#964734] transition-colors duration-300`}>
                        Get Started
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${action.gradient} hover:shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#964734]/30`}
                    >
                      Open <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Enhanced Recent Activity */}
        <Card className="bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950] shadow-lg hover:shadow-xl transition-all duration-500">
          <CardHeader className="border-b border-[#0FA4AF]/10 dark:border-[#024950]/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-[#003135] dark:text-white flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-[#964734]" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-[#024950] dark:text-[#AFDDE5] mt-2">
                  Latest updates and changes to your platform
                </CardDescription>
              </div>
              <Badge className="bg-[#964734]/20 text-[#964734] border-[#964734]/30">
                <Clock className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-[#AFDDE5]/10 to-[#964734]/5 dark:from-[#024950]/20 dark:to-[#964734]/10 rounded-xl border border-[#0FA4AF]/20 dark:border-[#024950] hover:border-[#964734]/30 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: isLoaded ? 'slideInLeft 0.6s ease-out forwards' : 'none',
                  }}
                >
                  <div className={`p-3 rounded-xl ${activity.color} group-hover:scale-110 transition-transform duration-300`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#003135] dark:text-white group-hover:text-[#964734] dark:group-hover:text-[#964734] transition-colors duration-300">
                      {activity.action}
                    </h4>
                    <p className="text-sm text-[#024950] dark:text-[#AFDDE5] group-hover:text-[#003135] dark:group-hover:text-white transition-colors duration-300">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#024950]/70 dark:text-[#AFDDE5]/70 group-hover:text-[#964734] transition-colors duration-300">
                      {activity.time}
                    </p>
                    <CheckCircle className="h-4 w-4 text-[#0FA4AF] mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-dashed border-[#964734]/30 hover:border-[#964734] hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 text-[#964734] dark:text-[#964734] hover:text-[#964734] transition-all duration-300 group"
              >
                <Layers className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                View All Activity
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Get Started Section */}
        <Card className="bg-gradient-to-r from-[#964734] via-[#024950] to-[#0FA4AF] border-0 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#964734]/20 rounded-full translate-y-24 -translate-x-24"></div>
          <CardContent className="p-12 relative z-10">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 group">
                <div className="absolute inset-0 bg-[#964734]/30 rounded-3xl animate-ping"></div>
                <Target className="h-10 w-10 text-white relative z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#964734] rounded-full flex items-center justify-center">
                  <Lightbulb className="h-3 w-3 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-[#AFDDE5] to-white bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of companies using Axient to automate workflows, enhance customer experiences,
                and unlock the full potential of AI in their operations.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Rocket, title: "Quick Setup", desc: "Get started in minutes" },
                  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade protection" },
                  { icon: Gauge, title: "High Performance", desc: "99.9% uptime guarantee" },
                ].map((feature, index) => (
                  <div key={feature.title} className="text-center group">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3 group-hover:bg-[#964734]/50 transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#024950] hover:bg-[#AFDDE5] hover:text-[#003135] font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <Link to="/workflows">
                    <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Create First Workflow
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300 group"
                >
                  <Link to="/knowledge-base">
                    <Brain className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Upload Knowledge
                    <Star className="h-4 w-4 ml-2 group-hover:rotate-180 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
