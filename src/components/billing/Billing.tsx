import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Check,
  X,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    conversations: number;
    workflows: number;
    knowledgeBases: number;
    apiCalls: number;
  };
  popular?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  downloadUrl?: string;
}

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month",
  );

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: billingInterval === "month" ? 29 : 290,
      interval: billingInterval,
      features: [
        "Up to 1,000 conversations/month",
        "5 workflows",
        "2 knowledge bases",
        "Basic AI providers",
        "Email support",
      ],
      limits: {
        conversations: 1000,
        workflows: 5,
        knowledgeBases: 2,
        apiCalls: 10000,
      },
    },
    {
      id: "pro",
      name: "Professional",
      price: billingInterval === "month" ? 99 : 990,
      interval: billingInterval,
      features: [
        "Up to 10,000 conversations/month",
        "Unlimited workflows",
        "10 knowledge bases",
        "All AI providers",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
      ],
      limits: {
        conversations: 10000,
        workflows: -1, // unlimited
        knowledgeBases: 10,
        apiCalls: 100000,
      },
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingInterval === "month" ? 299 : 2990,
      interval: billingInterval,
      features: [
        "Unlimited conversations",
        "Unlimited workflows",
        "Unlimited knowledge bases",
        "All AI providers + custom",
        "24/7 dedicated support",
        "Advanced security",
        "Custom deployment",
        "SLA guarantee",
      ],
      limits: {
        conversations: -1,
        workflows: -1,
        knowledgeBases: -1,
        apiCalls: -1,
      },
    },
  ];

  const invoices: Invoice[] = [
    {
      id: "inv_001",
      date: "2024-01-01",
      amount: 99,
      status: "paid",
      description: "Professional Plan - January 2024",
      downloadUrl: "#",
    },
    {
      id: "inv_002",
      date: "2024-02-01",
      amount: 99,
      status: "paid",
      description: "Professional Plan - February 2024",
      downloadUrl: "#",
    },
    {
      id: "inv_003",
      date: "2024-03-01",
      amount: 99,
      status: "pending",
      description: "Professional Plan - March 2024",
    },
  ];

  const usage = {
    conversations: { used: 7500, limit: 10000 },
    workflows: { used: 12, limit: -1 },
    knowledgeBases: { used: 3, limit: 10 },
    apiCalls: { used: 45000, limit: 100000 },
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? "Unlimited" : limit.toLocaleString();
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription and billing information
            </p>
          </div>
        </div>

        {/* Current Plan Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the Professional plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">
                  ${plans.find((p) => p.id === currentPlan)?.price}/
                  {billingInterval}
                </div>
                <div className="text-sm text-muted-foreground">
                  Next billing date: March 15, 2024
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment
                </Button>
                <Button>Upgrade Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your current usage against plan limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conversations</span>
                  <span>
                    {usage.conversations.used.toLocaleString()} /{" "}
                    {formatLimit(usage.conversations.limit)}
                  </span>
                </div>
                <Progress
                  value={calculateUsagePercentage(
                    usage.conversations.used,
                    usage.conversations.limit,
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Workflows</span>
                  <span>
                    {usage.workflows.used} /{" "}
                    {formatLimit(usage.workflows.limit)}
                  </span>
                </div>
                <Progress
                  value={calculateUsagePercentage(
                    usage.workflows.used,
                    usage.workflows.limit,
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Knowledge Bases</span>
                  <span>
                    {usage.knowledgeBases.used} /{" "}
                    {formatLimit(usage.knowledgeBases.limit)}
                  </span>
                </div>
                <Progress
                  value={calculateUsagePercentage(
                    usage.knowledgeBases.used,
                    usage.knowledgeBases.limit,
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Calls</span>
                  <span>
                    {usage.apiCalls.used.toLocaleString()} /{" "}
                    {formatLimit(usage.apiCalls.limit)}
                  </span>
                </div>
                <Progress
                  value={calculateUsagePercentage(
                    usage.apiCalls.used,
                    usage.apiCalls.limit,
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Choose Your Plan</CardTitle>
                    <CardDescription>
                      Select the plan that best fits your needs
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Monthly</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBillingInterval(
                          billingInterval === "month" ? "year" : "month",
                        )
                      }
                    >
                      {billingInterval === "month"
                        ? "Switch to Yearly"
                        : "Switch to Monthly"}
                    </Button>
                    <span className="text-sm">Yearly</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`relative ${
                        plan.popular ? "border-primary shadow-lg" : ""
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.interval}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm"
                            >
                              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full"
                          variant={
                            plan.id === currentPlan ? "outline" : "default"
                          }
                          disabled={plan.id === currentPlan}
                        >
                          {plan.id === currentPlan ? "Current Plan" : "Upgrade"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>${invoice.amount}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          {invoice.downloadUrl && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              VISA
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              •••• •••• •••• 4242
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Expires 12/25
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge>Default</Badge>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
