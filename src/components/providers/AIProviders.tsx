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
import { Plus, Settings, Check, X, AlertCircle, Bot, Sparkles, Zap, Star } from "lucide-react";

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
        return <Check className="h-4 w-4 text-[#0FA4AF]" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#964734]" />;
      default:
        return <X className="h-4 w-4 text-[#024950]" />;
    }
  };

  const getStatusBadge = (status: AIProvider["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-[#0FA4AF]/20 text-[#024950] border border-[#0FA4AF]/30">Connected</Badge>;
      case "error":
        return <Badge className="bg-[#964734]/20 text-[#964734] border border-[#964734]/30">Error</Badge>;
      default:
        return <Badge className="bg-[#AFDDE5]/30 text-[#003135] border border-[#024950]/30">Disconnected</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header - Inline Breadcrumb Style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-[#024950]" />
          <h1 className="text-xl font-semibold text-[#003135] dark:text-white">AI Providers</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#024950] hover:bg-[#0FA4AF] text-white">
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
                <Label htmlFor="provider-name" className="text-[#024950] dark:text-[#AFDDE5] font-medium">Provider Name</Label>
                <Input
                  id="provider-name"
                  value={newProvider.name}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, name: e.target.value })
                  }
                  placeholder="Enter provider name"
                  className="border-[#0FA4AF]/30 dark:border-[#024950] focus:border-[#0FA4AF] dark:focus:border-[#0FA4AF]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-type" className="text-[#024950] dark:text-[#AFDDE5] font-medium">Provider Type</Label>
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
                <Label htmlFor="api-key" className="text-[#024950] dark:text-[#AFDDE5] font-medium">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={newProvider.apiKey}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, apiKey: e.target.value })
                  }
                  placeholder="Enter API key"
                  className="border-[#0FA4AF]/30 dark:border-[#024950] focus:border-[#0FA4AF] dark:focus:border-[#0FA4AF]"
                />
              </div>
              {newProvider.type === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="base-url" className="text-[#024950] dark:text-[#AFDDE5] font-medium">Base URL</Label>
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
                    className="border-[#0FA4AF]/30 dark:border-[#024950] focus:border-[#0FA4AF] dark:focus:border-[#0FA4AF]"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-[#024950] hover:bg-[#0FA4AF] text-white"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProvider} className="bg-[#024950] hover:bg-[#0FA4AF] text-white">Add Provider</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          const getProviderGradient = (type: string) => {
            switch (type) {
              case "openai": return "from-[#003135] to-[#024950]";
              case "anthropic": return "from-[#024950] to-[#0FA4AF]";
              case "groq": return "from-[#0FA4AF] to-[#AFDDE5]";
              case "google": return "from-[#024950] to-[#003135]";
              default: return "from-[#003135] to-[#024950]";
            }
          };

          const getProviderIcon = (type: string) => {
            switch (type) {
              case "openai": return <Bot className="h-6 w-6" />;
              case "anthropic": return <Sparkles className="h-6 w-6" />;
              case "groq": return <Zap className="h-6 w-6" />;
              case "google": return <Star className="h-6 w-6" />;
              default: return <Settings className="h-6 w-6" />;
            }
          };

          return (
            <Card key={provider.id} className="group bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950] shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#0FA4AF] dark:hover:border-[#0FA4AF] overflow-hidden">
              {/* Provider Header */}
              <div className={`h-32 bg-gradient-to-r ${getProviderGradient(provider.type)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative p-6 h-full flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="font-bold text-xl mb-1">{provider.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(provider.status)}
                      {getStatusBadge(provider.status)}
                    </div>
                  </div>
                  <div className="text-white/90">
                    {getProviderIcon(provider.type)}
                  </div>
                </div>
                {provider.isDefault && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#964734] text-white border border-[#964734]">
                      Default
                    </Badge>
                  </div>
                )}
              </div>

              {/* Provider Content */}
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#024950] dark:text-[#AFDDE5] mb-2">
                      API Key
                    </p>
                    <p className="text-sm font-mono bg-[#AFDDE5]/30 dark:bg-[#024950]/50 p-2 rounded-lg text-[#003135] dark:text-[#AFDDE5]">
                      {provider.apiKey}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#024950] dark:text-[#AFDDE5] mb-2">
                      Available Models ({provider.models.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {provider.models.slice(0, 2).map((model) => (
                        <Badge key={model} variant="outline" className="text-xs border-[#0FA4AF]/30 text-[#024950] dark:text-[#AFDDE5] hover:bg-[#0FA4AF]/10">
                          {model}
                        </Badge>
                      ))}
                      {provider.models.length > 2 && (
                        <Badge variant="outline" className="text-xs border-[#964734]/30 text-[#964734] dark:text-[#AFDDE5] hover:bg-[#964734]/10">
                          +{provider.models.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(provider.id)}
                        disabled={provider.status === "connected"}
                        className={provider.status === "connected"
                          ? "bg-[#0FA4AF]/20 text-[#024950] border-[#0FA4AF]/30 cursor-not-allowed"
                          : "border-[#024950]/30 text-[#024950] hover:bg-[#024950] hover:text-white dark:text-[#AFDDE5] dark:border-[#024950] dark:hover:bg-[#0FA4AF]"
                        }
                      >
                        {provider.status === "connected" ? "Connected" : "Test"}
                      </Button>
                      {!provider.isDefault && provider.status === "connected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(provider.id)}
                          className="bg-[#964734]/20 text-[#964734] border-[#964734]/30 hover:bg-[#964734] hover:text-white dark:hover:bg-[#964734]"
                        >
                          Set Default
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-[#0FA4AF]/10 dark:hover:bg-[#024950]/50 text-[#024950] dark:text-[#AFDDE5]"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Tabs */}
      <Card className="bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950] shadow-lg mt-10">
        <CardHeader className="border-b border-[#0FA4AF]/20 dark:border-[#024950] bg-[#964734]/5 dark:bg-[#964734]/10">
          <CardTitle className="text-2xl font-bold text-[#003135] dark:text-white">Global Configuration</CardTitle>
          <CardDescription className="text-[#024950] dark:text-[#AFDDE5]">
            Configure global settings for all AI providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="bg-[#AFDDE5]/30 dark:bg-[#024950]/50">
              <TabsTrigger value="general" className="data-[state=active]:bg-[#024950] data-[state=active]:text-white text-[#003135] dark:text-[#AFDDE5]">General</TabsTrigger>
              <TabsTrigger value="limits" className="data-[state=active]:bg-[#964734] data-[state=active]:text-white text-[#003135] dark:text-[#AFDDE5]">Rate Limits</TabsTrigger>
              <TabsTrigger value="fallback" className="data-[state=active]:bg-[#0FA4AF] data-[state=active]:text-white text-[#003135] dark:text-[#AFDDE5]">Fallback</TabsTrigger>
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
  );
};

export default AIProviders;
