"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Plus,
  Save,
  Play,
  Settings,
  X,
  Move,
  ChevronRight,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface AgentModule {
  id: string;
  type:
    | "intent"
    | "retriever"
    | "tool"
    | "workflow"
    | "memory"
    | "follow"
    | "formatter"
    | "guardrail"
    | "llm";
  label: string;
  position: { x: number; y: number };
  connections: string[];
  config: Record<string, any>;
}

interface Connection {
  source: string;
  target: string;
}

const WorkflowBuilder = () => {
  const [modules, setModules] = useState<AgentModule[]>([
    {
      id: "1",
      type: "intent",
      label: "Intent Agent",
      position: { x: 100, y: 100 },
      connections: ["2"],
      config: { threshold: 0.7 },
    },
    {
      id: "2",
      type: "retriever",
      label: "Retriever Agent",
      position: { x: 300, y: 100 },
      connections: ["3"],
      config: { knowledgeBase: "default", topK: 5 },
    },
    {
      id: "3",
      type: "llm",
      label: "LLM Agent",
      position: { x: 500, y: 100 },
      connections: [],
      config: { provider: "openai", model: "gpt-4" },
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { source: "1", target: "2" },
    { source: "2", target: "3" },
  ]);

  const [selectedModule, setSelectedModule] = useState<AgentModule | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("canvas");
  const [isDragging, setIsDragging] = useState(false);
  const [workflowName, setWorkflowName] = useState("New Workflow");

  const moduleTypes = [
    { type: "intent", label: "Intent Agent", color: "bg-blue-500" },
    { type: "retriever", label: "Retriever Agent", color: "bg-green-500" },
    { type: "tool", label: "Tool Agent", color: "bg-yellow-500" },
    { type: "workflow", label: "Workflow Agent", color: "bg-purple-500" },
    { type: "memory", label: "Memory Agent", color: "bg-pink-500" },
    { type: "follow", label: "Follow Agent", color: "bg-indigo-500" },
    { type: "formatter", label: "Formatter Agent", color: "bg-orange-500" },
    { type: "guardrail", label: "Guardrail Agent", color: "bg-red-500" },
    { type: "llm", label: "LLM Agent", color: "bg-cyan-500" },
  ];

  const handleAddModule = (type: string) => {
    const moduleType = moduleTypes.find((m) => m.type === type);
    if (!moduleType) return;

    const newModule: AgentModule = {
      id: Date.now().toString(),
      type: moduleType.type as AgentModule["type"],
      label: moduleType.label,
      position: { x: 200, y: 200 },
      connections: [],
      config: {},
    };

    setModules([...modules, newModule]);
    setSelectedModule(newModule);
  };

  const handleModuleSelect = (module: AgentModule) => {
    setSelectedModule(module);
  };

  const handleModuleDrag = (id: string, position: { x: number; y: number }) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, position } : module,
      ),
    );
  };

  const handleCreateConnection = (source: string, target: string) => {
    if (source === target) return;

    // Check if connection already exists
    if (
      connections.some(
        (conn) => conn.source === source && conn.target === target,
      )
    )
      return;

    setConnections([...connections, { source, target }]);

    // Update the source module's connections
    setModules(
      modules.map((module) =>
        module.id === source
          ? { ...module, connections: [...module.connections, target] }
          : module,
      ),
    );
  };

  const handleRemoveConnection = (source: string, target: string) => {
    setConnections(
      connections.filter(
        (conn) => !(conn.source === source && conn.target === target),
      ),
    );

    // Update the source module's connections
    setModules(
      modules.map((module) =>
        module.id === source
          ? {
              ...module,
              connections: module.connections.filter((id) => id !== target),
            }
          : module,
      ),
    );
  };

  const handleRemoveModule = (id: string) => {
    // Remove all connections involving this module
    setConnections(
      connections.filter((conn) => conn.source !== id && conn.target !== id),
    );

    // Remove the module
    setModules(modules.filter((module) => module.id !== id));

    // Update connections in other modules
    setModules((prevModules) =>
      prevModules.map((module) => ({
        ...module,
        connections: module.connections.filter((connId) => connId !== id),
      })),
    );

    if (selectedModule?.id === id) {
      setSelectedModule(null);
    }
  };

  const handleUpdateModuleConfig = (key: string, value: any) => {
    if (!selectedModule) return;

    setModules(
      modules.map((module) =>
        module.id === selectedModule.id
          ? {
              ...module,
              config: { ...module.config, [key]: value },
            }
          : module,
      ),
    );

    setSelectedModule({
      ...selectedModule,
      config: { ...selectedModule.config, [key]: value },
    });
  };

  const handleSaveWorkflow = () => {
    // In a real implementation, this would save to backend
    console.log("Saving workflow:", {
      name: workflowName,
      modules,
      connections,
    });
    // Show success message
    alert("Workflow saved successfully!");
  };

  const handleTestWorkflow = () => {
    // In a real implementation, this would test the workflow
    console.log("Testing workflow...");
    // Show test result
    alert("Workflow test completed successfully!");
  };

  const getModuleColor = (type: string) => {
    const module = moduleTypes.find((m) => m.type === type);
    return module ? module.color : "bg-gray-500";
  };

  const renderCanvas = () => {
    return (
      <div className="relative w-full h-full overflow-hidden bg-muted/30 border rounded-md">
        <div className="absolute inset-0 p-4">
          {/* Render connections */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map(({ source, target }) => {
              const sourceModule = modules.find((m) => m.id === source);
              const targetModule = modules.find((m) => m.id === target);

              if (!sourceModule || !targetModule) return null;

              const x1 = sourceModule.position.x + 100; // Right side of source
              const y1 = sourceModule.position.y + 40; // Middle of source
              const x2 = targetModule.position.x; // Left side of target
              const y2 = targetModule.position.y + 40; // Middle of target

              return (
                <g key={`${source}-${target}`}>
                  <path
                    d={`M${x1},${y1} C${x1 + 50},${y1} ${x2 - 50},${y2} ${x2},${y2}`}
                    stroke="#888"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                    </marker>
                  </defs>
                </g>
              );
            })}
          </svg>

          {/* Render modules */}
          {modules.map((module) => (
            <motion.div
              key={module.id}
              className={`absolute cursor-move ${
                selectedModule?.id === module.id ? "ring-2 ring-blue-500" : ""
              }`}
              style={{
                left: module.position.x,
                top: module.position.y,
                width: 200,
                zIndex: selectedModule?.id === module.id ? 10 : 1,
              }}
              drag
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              onDrag={(_, info) => {
                handleModuleDrag(module.id, {
                  x: module.position.x + info.delta.x,
                  y: module.position.y + info.delta.y,
                });
              }}
              onClick={() => !isDragging && handleModuleSelect(module)}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow bg-background">
                <div
                  className={`${getModuleColor(module.type)} h-2 w-full rounded-t-lg`}
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm truncate pr-2">
                      {module.label}
                    </h3>
                    <div className="flex space-x-1 flex-shrink-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveModule(module.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove module</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {Object.entries(module.config).length > 0 ? (
                      <div className="space-y-1">
                        {Object.entries(module.config)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key} className="truncate">
                              <span className="font-medium">{key}:</span>{" "}
                              <span className="text-muted-foreground/80">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : value.toString()}
                              </span>
                            </div>
                          ))}
                        {Object.entries(module.config).length > 2 && (
                          <div className="text-muted-foreground/60">...</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60">
                        Click to configure
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    if (!selectedModule) {
      return (
        <div className="p-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="rounded-full bg-muted p-3">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">No Module Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select a module from the canvas to configure its properties
              </p>
            </div>
          </div>
        </div>
      );
    }

    const renderConfigFields = () => {
      switch (selectedModule.type) {
        case "intent":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="threshold">Confidence Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedModule.config.threshold || 0.7}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "threshold",
                      parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intentModel">Intent Model</Label>
                <Select
                  value={selectedModule.config.intentModel || "default"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("intentModel", value)
                  }
                >
                  <SelectTrigger id="intentModel">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Classifier</SelectItem>
                    <SelectItem value="custom">Custom Classifier</SelectItem>
                    <SelectItem value="llm">LLM-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          );

        case "retriever":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="knowledgeBase">Knowledge Base</Label>
                <Select
                  value={selectedModule.config.knowledgeBase || "default"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("knowledgeBase", value)
                  }
                >
                  <SelectTrigger id="knowledgeBase">
                    <SelectValue placeholder="Select knowledge base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default KB</SelectItem>
                    <SelectItem value="product">
                      Product Documentation
                    </SelectItem>
                    <SelectItem value="support">Support Articles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topK">Top K Results</Label>
                <Input
                  id="topK"
                  type="number"
                  min="1"
                  max="20"
                  value={selectedModule.config.topK || 5}
                  onChange={(e) =>
                    handleUpdateModuleConfig("topK", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="similarityThreshold">
                  Similarity Threshold
                </Label>
                <Input
                  id="similarityThreshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedModule.config.similarityThreshold || 0.75}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "similarityThreshold",
                      parseFloat(e.target.value),
                    )
                  }
                />
              </div>
            </>
          );

        case "tool":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Select
                  value={selectedModule.config.apiEndpoint || ""}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("apiEndpoint", value)
                  }
                >
                  <SelectTrigger id="apiEndpoint">
                    <SelectValue placeholder="Select API endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weather">Weather API</SelectItem>
                    <SelectItem value="crm">CRM API</SelectItem>
                    <SelectItem value="calendar">Calendar API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="authType">Authentication Type</Label>
                <Select
                  value={selectedModule.config.authType || "none"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("authType", value)
                  }
                >
                  <SelectTrigger id="authType">
                    <SelectValue placeholder="Select auth type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="apiKey">API Key</SelectItem>
                    <SelectItem value="oauth">OAuth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          );

        case "llm":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="provider">LLM Provider</Label>
                <Select
                  value={selectedModule.config.provider || "openai"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("provider", value)
                  }
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="groq">Groq</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={selectedModule.config.model || "gpt-4"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("model", value)
                  }
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={selectedModule.config.temperature || 0.7}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "temperature",
                      parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="8192"
                  value={selectedModule.config.maxTokens || 1024}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "maxTokens",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>
            </>
          );

        case "formatter":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select
                  value={selectedModule.config.template || "default"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("template", value)
                  }
                >
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="customer-service">
                      Customer Service
                    </SelectItem>
                    <SelectItem value="technical-support">
                      Technical Support
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="promptTemplate">Prompt Template</Label>
                <Textarea
                  id="promptTemplate"
                  rows={5}
                  value={selectedModule.config.promptTemplate || ""}
                  onChange={(e) =>
                    handleUpdateModuleConfig("promptTemplate", e.target.value)
                  }
                  placeholder="Enter prompt template..."
                />
              </div>
            </>
          );

        case "guardrail":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="contentPolicy">Content Policy</Label>
                <Select
                  value={selectedModule.config.contentPolicy || "standard"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("contentPolicy", value)
                  }
                >
                  <SelectTrigger id="contentPolicy">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="piiFilter"
                  checked={selectedModule.config.piiFilter || false}
                  onCheckedChange={(checked) =>
                    handleUpdateModuleConfig("piiFilter", checked)
                  }
                />
                <Label htmlFor="piiFilter">PII Filter</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="toxicityFilter"
                  checked={selectedModule.config.toxicityFilter || false}
                  onCheckedChange={(checked) =>
                    handleUpdateModuleConfig("toxicityFilter", checked)
                  }
                />
                <Label htmlFor="toxicityFilter">Toxicity Filter</Label>
              </div>
            </>
          );

        case "memory":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="memoryType">Memory Type</Label>
                <Select
                  value={selectedModule.config.memoryType || "conversation"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("memoryType", value)
                  }
                >
                  <SelectTrigger id="memoryType">
                    <SelectValue placeholder="Select memory type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversation">Conversation</SelectItem>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="vector">Vector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="windowSize">Window Size</Label>
                <Input
                  id="windowSize"
                  type="number"
                  min="1"
                  max="20"
                  value={selectedModule.config.windowSize || 10}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "windowSize",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="persistMemory"
                  checked={selectedModule.config.persistMemory || false}
                  onCheckedChange={(checked) =>
                    handleUpdateModuleConfig("persistMemory", checked)
                  }
                />
                <Label htmlFor="persistMemory">Persist Memory</Label>
              </div>
            </>
          );

        case "workflow":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="workflowType">Workflow Type</Label>
                <Select
                  value={selectedModule.config.workflowType || "sequential"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("workflowType", value)
                  }
                >
                  <SelectTrigger id="workflowType">
                    <SelectValue placeholder="Select workflow type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subWorkflow">Sub-Workflow</Label>
                <Select
                  value={selectedModule.config.subWorkflow || ""}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("subWorkflow", value)
                  }
                >
                  <SelectTrigger id="subWorkflow">
                    <SelectValue placeholder="Select sub-workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="customer-onboarding">
                      Customer Onboarding
                    </SelectItem>
                    <SelectItem value="support-ticket">
                      Support Ticket
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          );

        case "follow":
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="followUpType">Follow-up Type</Label>
                <Select
                  value={selectedModule.config.followUpType || "automatic"}
                  onValueChange={(value) =>
                    handleUpdateModuleConfig("followUpType", value)
                  }
                >
                  <SelectTrigger id="followUpType">
                    <SelectValue placeholder="Select follow-up type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpDelay">Follow-up Delay (minutes)</Label>
                <Input
                  id="followUpDelay"
                  type="number"
                  min="0"
                  max="1440"
                  value={selectedModule.config.followUpDelay || 5}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "followUpDelay",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFollowUps">Max Follow-ups</Label>
                <Input
                  id="maxFollowUps"
                  type="number"
                  min="1"
                  max="10"
                  value={selectedModule.config.maxFollowUps || 3}
                  onChange={(e) =>
                    handleUpdateModuleConfig(
                      "maxFollowUps",
                      parseInt(e.target.value),
                    )
                  }
                />
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="contextAware"
                  checked={selectedModule.config.contextAware || false}
                  onCheckedChange={(checked) =>
                    handleUpdateModuleConfig("contextAware", checked)
                  }
                />
                <Label htmlFor="contextAware">Context Aware</Label>
              </div>
            </>
          );

        default:
          return (
            <div className="text-center text-muted-foreground">
              <p>No configuration options available</p>
            </div>
          );
      }
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {selectedModule.label} Properties
          </h3>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedModule(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close properties panel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="moduleLabel">Label</Label>
            <Input
              id="moduleLabel"
              value={selectedModule.label}
              onChange={(e) => {
                const newLabel = e.target.value;
                setModules(
                  modules.map((module) =>
                    module.id === selectedModule.id
                      ? { ...module, label: newLabel }
                      : module,
                  ),
                );
                setSelectedModule({ ...selectedModule, label: newLabel });
              }}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Configuration</h4>
            {renderConfigFields()}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Connections</h4>
            {modules.filter((m) => m.id !== selectedModule.id).length > 0 ? (
              <div className="space-y-2">
                <Label htmlFor="connections">Connect to:</Label>
                <Select
                  onValueChange={(value) => {
                    if (value) handleCreateConnection(selectedModule.id, value);
                  }}
                >
                  <SelectTrigger id="connections">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules
                      .filter(
                        (m) =>
                          m.id !== selectedModule.id &&
                          !selectedModule.connections.includes(m.id),
                      )
                      .map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedModule.connections.length > 0 && (
                  <div className="mt-2">
                    <Label>Current connections:</Label>
                    <div className="mt-1 space-y-1">
                      {selectedModule.connections.map((connId) => {
                        const connModule = modules.find((m) => m.id === connId);
                        if (!connModule) return null;

                        return (
                          <div
                            key={connId}
                            className="flex items-center justify-between bg-muted p-2 rounded-md"
                          >
                            <div className="flex items-center">
                              <ArrowRight className="h-3 w-3 mr-2" />
                              <span className="text-sm">
                                {connModule.label}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                handleRemoveConnection(
                                  selectedModule.id,
                                  connId,
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No other modules available for connection
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="border-b p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="workflowName" className="text-sm font-medium">
                Workflow:
              </Label>
              <Input
                id="workflowName"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-base font-medium h-9 w-64 border-dashed"
                placeholder="Enter workflow name..."
              />
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Button variant="default" size="sm" onClick={handleSaveWorkflow}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleTestWorkflow}>
                <Play className="h-4 w-4 mr-2" />
                Test
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Module palette */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
            <div className="h-full border-r bg-card">
              <div className="p-4">
                <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Agent Modules
                </h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    {moduleTypes.map((moduleType) => (
                      <TooltipProvider key={moduleType.type}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-auto p-3 hover:bg-accent"
                              onClick={() => handleAddModule(moduleType.type)}
                            >
                              <div className="flex items-center w-full">
                                <div
                                  className={`${moduleType.color} h-3 w-3 rounded-full mr-3 flex-shrink-0`}
                                />
                                <span className="text-sm truncate">
                                  {moduleType.label}
                                </span>
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Add {moduleType.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas area */}
          <ResizablePanel defaultSize={60}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <div className="border-b px-4 py-2 bg-card">
                <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
                  <TabsTrigger value="canvas" className="text-sm">
                    Canvas
                  </TabsTrigger>
                  <TabsTrigger value="json" className="text-sm">
                    JSON
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="canvas" className="flex-1 p-4">
                {renderCanvas()}
              </TabsContent>
              <TabsContent value="json" className="flex-1 p-4">
                <ScrollArea className="h-full w-full rounded-md border bg-muted/30">
                  <div className="p-4">
                    <pre className="text-sm font-mono">
                      {JSON.stringify({ modules, connections }, null, 2)}
                    </pre>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full border-l bg-card">
              <ScrollArea className="h-full">
                {renderPropertiesPanel()}
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
