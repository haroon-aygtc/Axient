import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Settings,
  Check,
  X,
  AlertCircle,
  Globe,
  Key,
  TestTube,
} from "lucide-react";

interface ExternalAPI {
  id: string;
  name: string;
  type: "rest" | "graphql" | "webhook" | "custom";
  status: "connected" | "disconnected" | "error";
  baseUrl: string;
  authType: "none" | "apiKey" | "oauth" | "bearer";
  authConfig: Record<string, any>;
  endpoints: APIEndpoint[];
  isActive: boolean;
}

interface APIEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  parameters: Record<string, any>;
}

const ExternalAPIs = () => {
  const [apis, setApis] = useState<ExternalAPI[]>([
    {
      id: "1",
      name: "Weather API",
      type: "rest",
      status: "connected",
      baseUrl: "https://api.openweathermap.org/data/2.5",
      authType: "apiKey",
      authConfig: { apiKey: "*********************" },
      endpoints: [
        {
          id: "1",
          name: "Current Weather",
          method: "GET",
          path: "/weather",
          description: "Get current weather data",
          parameters: { q: "city name", appid: "API key" },
        },
      ],
      isActive: true,
    },
    {
      id: "2",
      name: "CRM API",
      type: "rest",
      status: "connected",
      baseUrl: "https://api.crm.example.com/v1",
      authType: "oauth",
      authConfig: { clientId: "***", clientSecret: "***" },
      endpoints: [
        {
          id: "2",
          name: "Get Customer",
          method: "GET",
          path: "/customers/{id}",
          description: "Retrieve customer information",
          parameters: { id: "customer ID" },
        },
      ],
      isActive: true,
    },
    {
      id: "3",
      name: "Calendar API",
      type: "rest",
      status: "disconnected",
      baseUrl: "https://api.calendar.example.com",
      authType: "bearer",
      authConfig: {},
      endpoints: [],
      isActive: false,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAPI, setNewAPI] = useState({
    name: "",
    type: "rest" as ExternalAPI["type"],
    baseUrl: "",
    authType: "none" as ExternalAPI["authType"],
  });

  const handleAddAPI = () => {
    const api: ExternalAPI = {
      id: Date.now().toString(),
      name: newAPI.name,
      type: newAPI.type,
      status: "disconnected",
      baseUrl: newAPI.baseUrl,
      authType: newAPI.authType,
      authConfig: {},
      endpoints: [],
      isActive: false,
    };

    setApis([...apis, api]);
    setIsAddDialogOpen(false);
    setNewAPI({ name: "", type: "rest", baseUrl: "", authType: "none" });
  };

  const handleTestConnection = (apiId: string) => {
    setApis(
      apis.map((api) =>
        api.id === apiId ? { ...api, status: "connected" as const } : api,
      ),
    );
  };

  const handleToggleActive = (apiId: string) => {
    setApis(
      apis.map((api) =>
        api.id === apiId ? { ...api, isActive: !api.isActive } : api,
      ),
    );
  };

  const getStatusIcon = (status: ExternalAPI["status"]) => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-[#0FA4AF]" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#964734]" />;
      default:
        return <X className="h-4 w-4 text-[#024950]" />;
    }
  };

  const getStatusBadge = (status: ExternalAPI["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-[#0FA4AF]/20 text-[#024950] border-[#0FA4AF]/30">Connected</Badge>;
      case "error":
        return <Badge className="bg-[#964734]/20 text-[#964734] border-[#964734]/30">Error</Badge>;
      default:
        return <Badge className="bg-[#024950]/20 text-[#024950] border-[#024950]/30">Disconnected</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header - Inline Breadcrumb Style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-[#024950]" />
          <h1 className="text-xl font-semibold text-[#003135] dark:text-white">External APIs</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#024950] hover:bg-[#0FA4AF] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add API
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add External API</DialogTitle>
              <DialogDescription>
                Configure a new external API integration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-name">API Name</Label>
                <Input
                  id="api-name"
                  value={newAPI.name}
                  onChange={(e) =>
                    setNewAPI({ ...newAPI, name: e.target.value })
                  }
                  placeholder="Enter API name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-type">API Type</Label>
                <Select
                  value={newAPI.type}
                  onValueChange={(value) =>
                    setNewAPI({
                      ...newAPI,
                      type: value as ExternalAPI["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rest">REST API</SelectItem>
                    <SelectItem value="graphql">GraphQL</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base-url">Base URL</Label>
                <Input
                  id="base-url"
                  value={newAPI.baseUrl}
                  onChange={(e) =>
                    setNewAPI({ ...newAPI, baseUrl: e.target.value })
                  }
                  placeholder="https://api.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-type">Authentication Type</Label>
                <Select
                  value={newAPI.authType}
                  onValueChange={(value) =>
                    setNewAPI({
                      ...newAPI,
                      authType: value as ExternalAPI["authType"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="apiKey">API Key</SelectItem>
                    <SelectItem value="oauth">OAuth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAPI}>Add API</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {/* APIs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apis.map((api) => (
            <Card key={api.id} className="bg-background">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(api.status)}
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                    {api.isActive && <Badge variant="secondary">Active</Badge>}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{api.type.toUpperCase()} API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(api.status)}
                </div>

                <div>
                  <span className="text-sm font-medium">Base URL</span>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {api.baseUrl}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium">Endpoints</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {api.endpoints.length > 0 ? (
                      api.endpoints.slice(0, 2).map((endpoint) => (
                        <Badge
                          key={endpoint.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {endpoint.method} {endpoint.path}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No endpoints configured
                      </span>
                    )}
                    {api.endpoints.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{api.endpoints.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTestConnection(api.id)}
                  >
                    <TestTube className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(api.id)}
                  >
                    {api.isActive ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Global API Configuration</CardTitle>
            <CardDescription>
              Configure global settings for all external APIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      min="1"
                      max="300"
                      defaultValue="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retries">Max Retries</Label>
                    <Input
                      id="retries"
                      type="number"
                      min="0"
                      max="5"
                      defaultValue="3"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-retry" />
                  <Label htmlFor="auto-retry">
                    Enable automatic retry on failures
                  </Label>
                </div>
              </TabsContent>
              <TabsContent value="security" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="ssl-verify" defaultChecked />
                  <Label htmlFor="ssl-verify">Verify SSL certificates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="rate-limiting" defaultChecked />
                  <Label htmlFor="rate-limiting">Enable rate limiting</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">Allowed Domains</Label>
                  <Textarea
                    id="allowed-domains"
                    placeholder="Enter allowed domains, one per line"
                    rows={3}
                  />
                </div>
              </TabsContent>
              <TabsContent value="monitoring" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="logging" defaultChecked />
                  <Label htmlFor="logging">Enable request logging</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="metrics" defaultChecked />
                  <Label htmlFor="metrics">Collect performance metrics</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExternalAPIs;
