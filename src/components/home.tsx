import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Bot,
  Brain,
  Code2,
  Cog,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  Settings,
  Users,
} from "lucide-react";

const Home = () => {
  // Mock data for dashboard
  const recentActivities = [
    {
      id: 1,
      type: "workflow",
      name: "Customer Support Workflow",
      time: "2 hours ago",
      status: "updated",
    },
    {
      id: 2,
      type: "knowledge",
      name: "Product Documentation",
      time: "5 hours ago",
      status: "uploaded",
    },
    {
      id: 3,
      type: "api",
      name: "CRM Integration",
      time: "1 day ago",
      status: "connected",
    },
    {
      id: 4,
      type: "widget",
      name: "Support Chat Widget",
      time: "2 days ago",
      status: "generated",
    },
  ];

  const quickStats = {
    conversations: 1243,
    knowledgeBases: 3,
    workflows: 5,
    apiConnections: 7,
  };

  return (
    <div className="bg-background">
      {/* Main Dashboard Content */}
      <div>
        <div className="grid gap-6">
          {/* Welcome Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Welcome to Axient</h2>
                  <p className="text-muted-foreground mt-1">
                    Your AI orchestration platform
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to="/workflows">
                      <Bot className="mr-2 h-4 w-4" />
                      Create Workflow
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quickStats.conversations}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
                <Progress className="mt-2" value={70} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Knowledge Bases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quickStats.knowledgeBases}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated 2 days ago
                </p>
                <Progress className="mt-2" value={30} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quickStats.workflows}</div>
                <p className="text-xs text-muted-foreground">
                  2 workflows need attention
                </p>
                <Progress className="mt-2" value={50} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  API Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quickStats.apiConnections}
                </div>
                <p className="text-xs text-muted-foreground">
                  All connections healthy
                </p>
                <Progress className="mt-2" value={100} />
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>
                    Quick access to your AI assistant configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          AI Providers
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>OpenAI</Badge>
                          <Badge variant="outline">Groq</Badge>
                          <Badge variant="outline">Claude</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          Configure Providers
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Widget Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm">Active on 2 websites</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                          asChild
                        >
                          <Link to="/widgets">Manage Widgets</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest changes to your AI assistant configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            {activity.type === "workflow" && (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                            {activity.type === "knowledge" && (
                              <Brain className="h-4 w-4 text-primary" />
                            )}
                            {activity.type === "api" && (
                              <Code2 className="h-4 w-4 text-primary" />
                            )}
                            {activity.type === "widget" && (
                              <MessageSquare className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{activity.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            activity.status === "updated"
                              ? "outline"
                              : "default"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    AI assistant usage and performance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Response Time
                        </span>
                        <span className="text-sm">1.2s avg</span>
                      </div>
                      <Progress value={80} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          User Satisfaction
                        </span>
                        <span className="text-sm">92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Knowledge Retrieval Accuracy
                        </span>
                        <span className="text-sm">87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          API Call Success Rate
                        </span>
                        <span className="text-sm">99.8%</span>
                      </div>
                      <Progress value={99.8} />
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto flex-col items-center justify-center p-4 gap-2"
                  asChild
                >
                  <Link to="/knowledge-base">
                    <Brain className="h-6 w-6" />
                    <span>Upload Knowledge</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col items-center justify-center p-4 gap-2"
                  asChild
                >
                  <Link to="/workflows">
                    <Bot className="h-6 w-6" />
                    <span>Create Workflow</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col items-center justify-center p-4 gap-2"
                  asChild
                >
                  <Link to="/widgets">
                    <MessageSquare className="h-6 w-6" />
                    <span>Generate Widget</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
