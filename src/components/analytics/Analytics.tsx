import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  ThumbsUp,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
} from "lucide-react";

interface AnalyticsData {
  conversations: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
  };
  performance: {
    avgResponseTime: number;
    successRate: number;
    satisfaction: number;
  };
  usage: {
    apiCalls: number;
    tokensUsed: number;
    cost: number;
  };
}

interface ConversationLog {
  id: string;
  timestamp: string;
  user: string;
  query: string;
  response: string;
  satisfaction: number | null;
  responseTime: number;
  workflow: string;
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  const analyticsData: AnalyticsData = {
    conversations: {
      total: 12847,
      thisMonth: 3421,
      growth: 12.5,
    },
    users: {
      total: 2156,
      active: 1834,
      new: 234,
    },
    performance: {
      avgResponseTime: 1.2,
      successRate: 94.8,
      satisfaction: 4.6,
    },
    usage: {
      apiCalls: 45623,
      tokensUsed: 2847392,
      cost: 142.36,
    },
  };

  const conversationLogs: ConversationLog[] = [
    {
      id: "1",
      timestamp: "2024-01-15 14:32:15",
      user: "user@example.com",
      query: "How do I reset my password?",
      response: "To reset your password, please follow these steps...",
      satisfaction: 5,
      responseTime: 0.8,
      workflow: "customer-support",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:28:42",
      user: "john@company.com",
      query: "What are your pricing plans?",
      response: "We offer three main pricing tiers...",
      satisfaction: 4,
      responseTime: 1.1,
      workflow: "sales-assistant",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:25:18",
      user: "support@client.com",
      query: "API integration documentation",
      response: "Here's our comprehensive API documentation...",
      satisfaction: null,
      responseTime: 2.3,
      workflow: "technical-support",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:20:55",
      user: "mary@startup.io",
      query: "Can you help me with billing issues?",
      response: "I'd be happy to help with your billing inquiry...",
      satisfaction: 5,
      responseTime: 0.9,
      workflow: "customer-support",
    },
  ];

  const getSatisfactionColor = (rating: number | null) => {
    if (rating === null) return "text-muted-foreground";
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getWorkflowBadge = (workflow: string) => {
    const colors = {
      "customer-support": "bg-blue-100 text-blue-800",
      "sales-assistant": "bg-purple-100 text-purple-800",
      "technical-support": "bg-green-100 text-green-800",
      "general-qa": "bg-gray-100 text-gray-800",
    };
    return (
      <Badge
        className={
          colors[workflow as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {workflow.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Monitoring</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your AI assistant's performance and usage
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage & Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Total Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.conversations.total.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-green-600">
                      +{analyticsData.conversations.growth}%
                    </span>
                    <span className="text-muted-foreground ml-1">
                      vs last period
                    </span>
                  </div>
                  <Progress className="mt-2" value={75} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.users.active.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analyticsData.users.new} new users this month
                  </div>
                  <Progress className="mt-2" value={85} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Avg Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.performance.avgResponseTime}s
                  </div>
                  <div className="text-sm text-green-600">
                    Within target range
                  </div>
                  <Progress className="mt-2" value={90} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Satisfaction Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.performance.satisfaction}/5
                  </div>
                  <div className="text-sm text-green-600">
                    {analyticsData.performance.successRate}% success rate
                  </div>
                  <Progress className="mt-2" value={92} />
                </CardContent>
              </Card>
            </div>

            {/* Charts Placeholder */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Volume</CardTitle>
                  <CardDescription>
                    Daily conversation trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Chart visualization would be here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time Distribution</CardTitle>
                  <CardDescription>
                    Distribution of response times across conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Response time chart would be here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Conversation Logs</CardTitle>
                    <CardDescription>
                      Recent conversations and their details
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {conversationLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {log.user}
                              </span>
                              {getWorkflowBadge(log.workflow)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {log.timestamp}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {log.responseTime}s
                              </div>
                              <div
                                className={`text-xs ${getSatisfactionColor(log.satisfaction)}`}
                              >
                                {log.satisfaction
                                  ? `★ ${log.satisfaction}/5`
                                  : "No rating"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              QUERY:
                            </span>
                            <p className="text-sm">{log.query}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              RESPONSE:
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {log.response.length > 100
                                ? `${log.response.substring(0, 100)}...`
                                : log.response}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for your AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm">
                        {analyticsData.performance.successRate}%
                      </span>
                    </div>
                    <Progress value={analyticsData.performance.successRate} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Average Response Time
                      </span>
                      <span className="text-sm">
                        {analyticsData.performance.avgResponseTime}s
                      </span>
                    </div>
                    <Progress value={80} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        User Satisfaction
                      </span>
                      <span className="text-sm">
                        {analyticsData.performance.satisfaction}/5
                      </span>
                    </div>
                    <Progress
                      value={(analyticsData.performance.satisfaction / 5) * 100}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Analysis</CardTitle>
                  <CardDescription>
                    Common errors and their frequency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Knowledge not found</span>
                      </div>
                      <Badge variant="outline">23</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">API timeout</span>
                      </div>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Rate limit exceeded</span>
                      </div>
                      <Badge variant="outline">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    API Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.usage.apiCalls.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <Progress className="mt-2" value={68} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tokens Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(analyticsData.usage.tokensUsed / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total tokens processed
                  </p>
                  <Progress className="mt-2" value={45} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analyticsData.usage.cost.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <Progress className="mt-2" value={35} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Breakdown</CardTitle>
                <CardDescription>
                  Detailed breakdown of usage by workflow and provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">By Workflow</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Customer Support</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={45} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              45%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">General Q&A</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={30} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              30%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sales Assistant</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={25} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              25%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">By Provider</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">OpenAI</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={70} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              70%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Anthropic</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={20} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              20%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Groq</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={10} className="w-20" />
                            <span className="text-sm text-muted-foreground">
                              10%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
