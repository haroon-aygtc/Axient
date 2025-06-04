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
import { Plus, Settings, Check, X, AlertCircle } from "lucide-react";

interface AIProvider {
  id: string;
  name: string;
  type: "openai" | "anthropic" | "google" | "groq" | "custom";
  status: "connected" | "disconnected" | "error";
  apiKey: string;
  baseUrl?: string;
  models: string[];
  isDefault: boolean;
  config: Record<string, any>;
}

const AIProviders = () => {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: "1",
      name: "OpenAI",
      type: "openai",
      status: "connected",
      apiKey: "sk-*********************",
      models: ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
      isDefault: true,
      config: { temperature: 0.7, maxTokens: 1024 },
    },
    {
      id: "2",
      name: "Anthropic Claude",
      type: "anthropic",
      status: "connected",
      apiKey: "sk-ant-*********************",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      isDefault: false,
      config: { temperature: 0.7, maxTokens: 1024 },
    },
    {
      id: "3",
      name: "Groq",
      type: "groq",
      status: "disconnected",
      apiKey: "",
      models: ["llama2-70b-4096", "mixtral-8x7b-32768"],
      isDefault: false,
      config: { temperature: 0.7, maxTokens: 1024 },
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    type: "openai" as AIProvider["type"],
    apiKey: "",
    baseUrl: "",
  });

  const handleAddProvider = () => {
    const provider: AIProvider = {
      id: Date.now().toString(),
      name: newProvider.name,
      type: newProvider.type,
      status: "disconnected",
      apiKey: newProvider.apiKey,
      baseUrl: newProvider.baseUrl,
      models: [],
      isDefault: false,
      config: { temperature: 0.7, maxTokens: 1024 },
    };

    setProviders([...providers, provider]);
    setIsAddDialogOpen(false);
    setNewProvider({ name: "", type: "openai", apiKey: "", baseUrl: "" });
  };

  const handleTestConnection = (providerId: string) => {
    // Simulate API test
    setProviders(
      providers.map((p) =>
        p.id === providerId ? { ...p, status: "connected" as const } : p,
      ),
    );
  };

  const handleSetDefault = (providerId: string) => {
    setProviders(
      providers.map((p) => ({
        ...p,
        isDefault: p.id === providerId,
      })),
    );
  };

  const getStatusIcon = (status: AIProvider["status"]) => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <X className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: AIProvider["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  return (
    <div className="bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Providers</h1>
            <p className="text-muted-foreground mt-1">
              Configure and manage your AI model providers
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add AI Provider</DialogTitle>
                <DialogDescription>
                  Configure a new AI model provider for your workflows
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-name">Provider Name</Label>
                  <Input
                    id="provider-name"
                    value={newProvider.name}
                    onChange={(e) =>
                      setNewProvider({ ...newProvider, name: e.target.value })
                    }
                    placeholder="Enter provider name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-type">Provider Type</Label>
                  <Select
                    value={newProvider.type}
                    onValueChange={(value) =>
                      setNewProvider({
                        ...newProvider,
                        type: value as AIProvider["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={newProvider.apiKey}
                    onChange={(e) =>
                      setNewProvider({ ...newProvider, apiKey: e.target.value })
                    }
                    placeholder="Enter API key"
                  />
                </div>
                {newProvider.type === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="base-url">Base URL</Label>
                    <Input
                      id="base-url"
                      value={newProvider.baseUrl}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          baseUrl: e.target.value,
                        })
                      }
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProvider}>Add Provider</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Providers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="bg-background">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(provider.status)}
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    {provider.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  {provider.type.charAt(0).toUpperCase() +
                    provider.type.slice(1)}{" "}
                  Provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(provider.status)}
                </div>

                <div>
                  <span className="text-sm font-medium">Available Models</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {provider.models.length > 0 ? (
                      provider.models.slice(0, 3).map((model) => (
                        <Badge
                          key={model}
                          variant="outline"
                          className="text-xs"
                        >
                          {model}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No models available
                      </span>
                    )}
                    {provider.models.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.models.length - 3} more
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
                    onClick={() => handleTestConnection(provider.id)}
                  >
                    Test Connection
                  </Button>
                  {!provider.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(provider.id)}
                    >
                      Set Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Global Configuration</CardTitle>
            <CardDescription>
              Configure global settings for all AI providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="limits">Rate Limits</TabsTrigger>
                <TabsTrigger value="fallback">Fallback</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-temperature">
                      Default Temperature
                    </Label>
                    <Input
                      id="default-temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      defaultValue="0.7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-max-tokens">
                      Default Max Tokens
                    </Label>
                    <Input
                      id="default-max-tokens"
                      type="number"
                      min="1"
                      max="8192"
                      defaultValue="1024"
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
              <TabsContent value="limits" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requests-per-minute">
                      Requests per Minute
                    </Label>
                    <Input
                      id="requests-per-minute"
                      type="number"
                      min="1"
                      defaultValue="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokens-per-minute">Tokens per Minute</Label>
                    <Input
                      id="tokens-per-minute"
                      type="number"
                      min="1000"
                      defaultValue="40000"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fallback" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fallback-provider">Fallback Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fallback provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers
                        .filter((p) => p.status === "connected")
                        .map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enable-fallback" />
                  <Label htmlFor="enable-fallback">
                    Enable automatic fallback
                  </Label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIProviders;
