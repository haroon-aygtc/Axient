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
import { Textarea } from "@/components/ui/textarea";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Eye,
  Download,
  Settings,
  Palette,
  MessageSquare,
  Code,
} from "lucide-react";

interface WidgetConfig {
  name: string;
  workflow: string;
  appearance: {
    theme: "light" | "dark" | "auto";
    primaryColor: string;
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    size: "small" | "medium" | "large";
    borderRadius: number;
  };
  behavior: {
    greeting: string;
    placeholder: string;
    autoOpen: boolean;
    showBranding: boolean;
    enableFileUpload: boolean;
    enableVoice: boolean;
  };
  advanced: {
    customCSS: string;
    allowedDomains: string[];
    rateLimiting: boolean;
    analytics: boolean;
  };
}

const WidgetGenerator = () => {
  const [config, setConfig] = useState<WidgetConfig>({
    name: "Customer Support Widget",
    workflow: "customer-support",
    appearance: {
      theme: "auto",
      primaryColor: "#3b82f6",
      position: "bottom-right",
      size: "medium",
      borderRadius: 12,
    },
    behavior: {
      greeting: "Hi! How can I help you today?",
      placeholder: "Type your message...",
      autoOpen: false,
      showBranding: true,
      enableFileUpload: true,
      enableVoice: false,
    },
    advanced: {
      customCSS: "",
      allowedDomains: ["*"],
      rateLimiting: true,
      analytics: true,
    },
  });

  const [activeTab, setActiveTab] = useState("appearance");
  const [generatedCode, setGeneratedCode] = useState("");

  const workflows = [
    { id: "customer-support", name: "Customer Support" },
    { id: "sales-assistant", name: "Sales Assistant" },
    { id: "technical-support", name: "Technical Support" },
    { id: "general-qa", name: "General Q&A" },
  ];

  const generateEmbedCode = () => {
    const embedCode = `<!-- Axient AI Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.axient.ai/embed.js';
    script.async = true;
    script.onload = function() {
      AxientWidget.init({
        widgetId: '${Date.now()}',
        workflow: '${config.workflow}',
        theme: '${config.appearance.theme}',
        primaryColor: '${config.appearance.primaryColor}',
        position: '${config.appearance.position}',
        size: '${config.appearance.size}',
        greeting: '${config.behavior.greeting}',
        placeholder: '${config.behavior.placeholder}',
        autoOpen: ${config.behavior.autoOpen},
        showBranding: ${config.behavior.showBranding},
        enableFileUpload: ${config.behavior.enableFileUpload},
        enableVoice: ${config.behavior.enableVoice}
      });
    };
    document.head.appendChild(script);
  })();
</script>`;

    setGeneratedCode(embedCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const updateConfig = (
    section: keyof WidgetConfig,
    key: string,
    value: any,
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-background">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Widget Generator</h1>
            <p className="text-muted-foreground mt-1">
              Create and customize AI chat widgets for your website
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
              <CardDescription>
                Customize your AI widget's appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widget-name">Widget Name</Label>
                  <Input
                    id="widget-name"
                    value={config.name}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow">Workflow</Label>
                  <Select
                    value={config.workflow}
                    onValueChange={(value) =>
                      setConfig((prev) => ({ ...prev, workflow: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map((workflow) => (
                        <SelectItem key={workflow.id} value={workflow.id}>
                          {workflow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Visual Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={config.appearance.theme}
                        onValueChange={(value) =>
                          updateConfig("appearance", "theme", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={config.appearance.primaryColor}
                          onChange={(e) =>
                            updateConfig(
                              "appearance",
                              "primaryColor",
                              e.target.value,
                            )
                          }
                          className="w-16 h-9 p-1"
                        />
                        <Input
                          value={config.appearance.primaryColor}
                          onChange={(e) =>
                            updateConfig(
                              "appearance",
                              "primaryColor",
                              e.target.value,
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Select
                        value={config.appearance.position}
                        onValueChange={(value) =>
                          updateConfig("appearance", "position", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">
                            Bottom Right
                          </SelectItem>
                          <SelectItem value="bottom-left">
                            Bottom Left
                          </SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Select
                        value={config.appearance.size}
                        onValueChange={(value) =>
                          updateConfig("appearance", "size", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="border-radius">
                      Border Radius: {config.appearance.borderRadius}px
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={config.appearance.borderRadius}
                      onChange={(e) =>
                        updateConfig(
                          "appearance",
                          "borderRadius",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Interaction Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="greeting">Greeting Message</Label>
                    <Textarea
                      id="greeting"
                      value={config.behavior.greeting}
                      onChange={(e) =>
                        updateConfig("behavior", "greeting", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeholder">Input Placeholder</Label>
                    <Input
                      id="placeholder"
                      value={config.behavior.placeholder}
                      onChange={(e) =>
                        updateConfig("behavior", "placeholder", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-open">Auto Open</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically open the widget on page load
                        </p>
                      </div>
                      <Switch
                        id="auto-open"
                        checked={config.behavior.autoOpen}
                        onCheckedChange={(checked) =>
                          updateConfig("behavior", "autoOpen", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-branding">Show Branding</Label>
                        <p className="text-sm text-muted-foreground">
                          Display "Powered by Axient" text
                        </p>
                      </div>
                      <Switch
                        id="show-branding"
                        checked={config.behavior.showBranding}
                        onCheckedChange={(checked) =>
                          updateConfig("behavior", "showBranding", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-file-upload">File Upload</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to upload files
                        </p>
                      </div>
                      <Switch
                        id="enable-file-upload"
                        checked={config.behavior.enableFileUpload}
                        onCheckedChange={(checked) =>
                          updateConfig("behavior", "enableFileUpload", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-voice">Voice Input</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable voice-to-text input
                        </p>
                      </div>
                      <Switch
                        id="enable-voice"
                        checked={config.behavior.enableVoice}
                        onCheckedChange={(checked) =>
                          updateConfig("behavior", "enableVoice", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Advanced Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-css">Custom CSS</Label>
                    <Textarea
                      id="custom-css"
                      value={config.advanced.customCSS}
                      onChange={(e) =>
                        updateConfig("advanced", "customCSS", e.target.value)
                      }
                      rows={4}
                      placeholder="/* Add your custom CSS here */"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowed-domains">Allowed Domains</Label>
                    <Input
                      id="allowed-domains"
                      value={config.advanced.allowedDomains.join(", ")}
                      onChange={(e) =>
                        updateConfig(
                          "advanced",
                          "allowedDomains",
                          e.target.value.split(", "),
                        )
                      }
                      placeholder="example.com, *.example.com, *"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of domains. Use * for all domains.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="rate-limiting">Rate Limiting</Label>
                        <p className="text-sm text-muted-foreground">
                          Limit requests per user
                        </p>
                      </div>
                      <Switch
                        id="rate-limiting"
                        checked={config.advanced.rateLimiting}
                        onCheckedChange={(checked) =>
                          updateConfig("advanced", "rateLimiting", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics">Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Track widget usage and conversations
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={config.advanced.analytics}
                        onCheckedChange={(checked) =>
                          updateConfig("advanced", "analytics", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Embed Code
                    </div>
                    <Button onClick={generateEmbedCode}>Generate Code</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedCode ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <ScrollArea className="h-64 w-full rounded-md border bg-muted/30 p-4">
                          <pre className="text-sm font-mono">
                            <code>{generatedCode}</code>
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download HTML
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="h-8 w-8 mx-auto mb-2" />
                      <p>Click "Generate Code" to create your embed code</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your widget will look on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 min-h-[400px]">
                {/* Mock website content */}
                <div className="space-y-4 opacity-50">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>

                {/* Widget Preview */}
                <div
                  className={`absolute ${
                    config.appearance.position === "bottom-right"
                      ? "bottom-4 right-4"
                      : config.appearance.position === "bottom-left"
                        ? "bottom-4 left-4"
                        : config.appearance.position === "top-right"
                          ? "top-4 right-4"
                          : "top-4 left-4"
                  }`}
                >
                  <div
                    className={`bg-white dark:bg-gray-800 shadow-lg border ${
                      config.appearance.size === "small"
                        ? "w-64 h-80"
                        : config.appearance.size === "large"
                          ? "w-80 h-96"
                          : "w-72 h-88"
                    }`}
                    style={{
                      borderRadius: `${config.appearance.borderRadius}px`,
                      borderColor: config.appearance.primaryColor,
                    }}
                  >
                    {/* Widget Header */}
                    <div
                      className="p-4 text-white font-medium"
                      style={{
                        backgroundColor: config.appearance.primaryColor,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>AI Assistant</span>
                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      </div>
                    </div>

                    {/* Widget Content */}
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm">
                        {config.behavior.greeting}
                      </div>
                      <div className="flex justify-end">
                        <div
                          className="text-white rounded-lg p-3 text-sm max-w-xs"
                          style={{
                            backgroundColor: config.appearance.primaryColor,
                          }}
                        >
                          Hello! I need help with...
                        </div>
                      </div>
                    </div>

                    {/* Widget Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={config.behavior.placeholder}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          disabled
                        />
                        <button
                          className="p-2 text-white rounded-lg"
                          style={{
                            backgroundColor: config.appearance.primaryColor,
                          }}
                        >
                          →
                        </button>
                      </div>
                      {config.behavior.showBranding && (
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Powered by Axient
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widget Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Widget Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-muted-foreground">
                    Total Conversations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetGenerator;
