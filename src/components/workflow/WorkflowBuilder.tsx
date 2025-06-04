import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Save,
  Play,
  Settings,
  X,
  ArrowRight,
  Zap,
  Brain,
  Database,
  Workflow,
  MessageSquare,
  Shield,
  Bot,
  FileText,
  GitBranch,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Copy,
  Trash2,
  Edit3,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition" | "agent";
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowData {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  connections: Array<{ from: string; to: string }>;
  status: "draft" | "active" | "paused";
  lastModified: Date;
}

const WorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState<WorkflowData>({
    id: "1",
    name: "Customer Support Workflow",
    description: "Automated customer support with AI agents",
    steps: [
      {
        id: "trigger-1",
        type: "trigger",
        category: "Message",
        title: "New Customer Message",
        description: "Triggers when a customer sends a message",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "bg-blue-500",
        config: { source: "widget", filters: [] },
        position: { x: 100, y: 100 },
        connections: ["agent-1"],
      },
      {
        id: "agent-1",
        type: "agent",
        category: "Intent",
        title: "Intent Recognition",
        description: "Analyzes customer intent from message",
        icon: <Brain className="h-4 w-4" />,
        color: "bg-purple-500",
        config: { model: "intent-classifier", threshold: 0.8 },
        position: { x: 350, y: 100 },
        connections: ["condition-1"],
      },
      {
        id: "condition-1",
        type: "condition",
        category: "Logic",
        title: "Intent Check",
        description: "Routes based on detected intent",
        icon: <GitBranch className="h-4 w-4" />,
        color: "bg-orange-500",
        config: {
          conditions: [
            { field: "intent", operator: "equals", value: "support" },
          ],
        },
        position: { x: 600, y: 100 },
        connections: ["agent-2", "agent-3"],
      },
      {
        id: "agent-2",
        type: "agent",
        category: "Retriever",
        title: "Knowledge Search",
        description: "Searches knowledge base for relevant information",
        icon: <Database className="h-4 w-4" />,
        color: "bg-green-500",
        config: { knowledgeBase: "support-docs", topK: 5 },
        position: { x: 850, y: 50 },
        connections: ["agent-4"],
      },
      {
        id: "agent-3",
        type: "action",
        category: "Escalation",
        title: "Human Handoff",
        description: "Escalates to human agent",
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
        config: { department: "support", priority: "normal" },
        position: { x: 850, y: 150 },
        connections: [],
      },
      {
        id: "agent-4",
        type: "agent",
        category: "LLM",
        title: "Response Generation",
        description: "Generates helpful response using AI",
        icon: <Bot className="h-4 w-4" />,
        color: "bg-cyan-500",
        config: { provider: "openai", model: "gpt-4", temperature: 0.7 },
        position: { x: 1100, y: 50 },
        connections: [],
      },
    ],
    connections: [
      { from: "trigger-1", to: "agent-1" },
      { from: "agent-1", to: "condition-1" },
      { from: "condition-1", to: "agent-2" },
      { from: "condition-1", to: "agent-3" },
      { from: "agent-2", to: "agent-4" },
    ],
    status: "draft",
    lastModified: new Date(),
  });

  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);

  const stepTemplates = [
    {
      category: "Triggers",
      items: [
        {
          type: "trigger",
          category: "Message",
          title: "New Message",
          description: "When a new message is received",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-blue-500",
        },
        {
          type: "trigger",
          category: "Schedule",
          title: "Time Schedule",
          description: "Runs at specific times",
          icon: <Clock className="h-4 w-4" />,
          color: "bg-indigo-500",
        },
        {
          type: "trigger",
          category: "Webhook",
          title: "API Webhook",
          description: "External API triggers",
          icon: <Zap className="h-4 w-4" />,
          color: "bg-yellow-500",
        },
      ],
    },
    {
      category: "AI Agents",
      items: [
        {
          type: "agent",
          category: "Intent",
          title: "Intent Recognition",
          description: "Analyze user intent",
          icon: <Brain className="h-4 w-4" />,
          color: "bg-purple-500",
        },
        {
          type: "agent",
          category: "Retriever",
          title: "Knowledge Search",
          description: "Search knowledge base",
          icon: <Database className="h-4 w-4" />,
          color: "bg-green-500",
        },
        {
          type: "agent",
          category: "LLM",
          title: "AI Response",
          description: "Generate AI responses",
          icon: <Bot className="h-4 w-4" />,
          color: "bg-cyan-500",
        },
        {
          type: "agent",
          category: "Formatter",
          title: "Format Response",
          description: "Format and structure output",
          icon: <FileText className="h-4 w-4" />,
          color: "bg-orange-500",
        },
        {
          type: "agent",
          category: "Guardrail",
          title: "Safety Check",
          description: "Content safety validation",
          icon: <Shield className="h-4 w-4" />,
          color: "bg-red-500",
        },
      ],
    },
    {
      category: "Logic & Actions",
      items: [
        {
          type: "condition",
          category: "Logic",
          title: "Condition Check",
          description: "Branch based on conditions",
          icon: <GitBranch className="h-4 w-4" />,
          color: "bg-orange-500",
        },
        {
          type: "action",
          category: "API",
          title: "API Call",
          description: "Call external APIs",
          icon: <Zap className="h-4 w-4" />,
          color: "bg-pink-500",
        },
        {
          type: "action",
          category: "Workflow",
          title: "Sub-Workflow",
          description: "Execute another workflow",
          icon: <Workflow className="h-4 w-4" />,
          color: "bg-violet-500",
        },
      ],
    },
  ];

  const handleStepSelect = useCallback((step: WorkflowStep) => {
    setSelectedStep(step);
    setIsConfigPanelOpen(true);
  }, []);

  const handleAddStep = useCallback((template: any) => {
    const newStep: WorkflowStep = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      category: template.category,
      title: template.title,
      description: template.description,
      icon: template.icon,
      color: template.color,
      config: {},
      position: { x: 200 + Math.random() * 400, y: 200 + Math.random() * 200 },
      connections: [],
    };

    setWorkflow((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setSelectedStep(newStep);
    setIsConfigPanelOpen(true);
  }, []);

  const handleDeleteStep = useCallback(
    (stepId: string) => {
      setWorkflow((prev) => ({
        ...prev,
        steps: prev.steps.filter((step) => step.id !== stepId),
        connections: prev.connections.filter(
          (conn) => conn.from !== stepId && conn.to !== stepId,
        ),
      }));
      if (selectedStep?.id === stepId) {
        setSelectedStep(null);
        setIsConfigPanelOpen(false);
      }
    },
    [selectedStep],
  );

  const handleSaveWorkflow = useCallback(() => {
    console.log("Saving workflow:", workflow);
    // In a real app, this would save to backend
  }, [workflow]);

  const handleTestWorkflow = useCallback(() => {
    console.log("Testing workflow:", workflow);
    // In a real app, this would test the workflow
  }, [workflow]);

  const renderStepCard = (step: WorkflowStep) => {
    const isSelected = selectedStep?.id === step.id;

    return (
      <motion.div
        key={step.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "absolute cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-primary ring-offset-2",
        )}
        style={{
          left: step.position.x,
          top: step.position.y,
          width: 240,
        }}
        onClick={() => handleStepSelect(step)}
        drag
        dragMomentum={false}
        onDragStart={() => setDraggedStep(step.id)}
        onDragEnd={(_, info) => {
          setDraggedStep(null);
          setWorkflow((prev) => ({
            ...prev,
            steps: prev.steps.map((s) =>
              s.id === step.id
                ? {
                    ...s,
                    position: {
                      x: s.position.x + info.offset.x,
                      y: s.position.y + info.offset.y,
                    },
                  }
                : s,
            ),
          }));
        }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-background border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn("p-2 rounded-lg text-white", step.color)}>
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-semibold truncate">
                    {step.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {step.category}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStepSelect(step)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteStep(step.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.description}
            </p>
            {Object.keys(step.config).length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(step.config)
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value).slice(0, 10)}
                      </Badge>
                    ))}
                  {Object.keys(step.config).length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{Object.keys(step.config).length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderConnections = () => {
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        {workflow.connections.map(({ from, to }) => {
          const fromStep = workflow.steps.find((s) => s.id === from);
          const toStep = workflow.steps.find((s) => s.id === to);

          if (!fromStep || !toStep) return null;

          const x1 = fromStep.position.x + 240;
          const y1 = fromStep.position.y + 60;
          const x2 = toStep.position.x;
          const y2 = toStep.position.y + 60;

          const midX = (x1 + x2) / 2;

          return (
            <path
              key={`${from}-${to}`}
              d={`M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`}
              stroke="#6b7280"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="transition-all duration-200"
            />
          );
        })}
      </svg>
    );
  };

  const renderConfigPanel = () => {
    if (!selectedStep) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn("p-2 rounded-lg text-white", selectedStep.color)}
            >
              {selectedStep.icon}
            </div>
            <div>
              <h3 className="font-semibold">{selectedStep.title}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedStep.category}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfigPanelOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="step-title">Title</Label>
            <Input
              id="step-title"
              value={selectedStep.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setWorkflow((prev) => ({
                  ...prev,
                  steps: prev.steps.map((step) =>
                    step.id === selectedStep.id
                      ? { ...step, title: newTitle }
                      : step,
                  ),
                }));
                setSelectedStep({ ...selectedStep, title: newTitle });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="step-description">Description</Label>
            <Textarea
              id="step-description"
              value={selectedStep.description}
              onChange={(e) => {
                const newDescription = e.target.value;
                setWorkflow((prev) => ({
                  ...prev,
                  steps: prev.steps.map((step) =>
                    step.id === selectedStep.id
                      ? { ...step, description: newDescription }
                      : step,
                  ),
                }));
                setSelectedStep({
                  ...selectedStep,
                  description: newDescription,
                });
              }}
              rows={3}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Configuration</h4>

            {selectedStep.type === "agent" &&
              selectedStep.category === "Intent" && (
                <>
                  <div className="space-y-2">
                    <Label>Confidence Threshold</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedStep.config.threshold || 0.8}
                      onChange={(e) => {
                        const newConfig = {
                          ...selectedStep.config,
                          threshold: parseFloat(e.target.value),
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={selectedStep.config.model || "intent-classifier"}
                      onValueChange={(value) => {
                        const newConfig = {
                          ...selectedStep.config,
                          model: value,
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intent-classifier">
                          Intent Classifier
                        </SelectItem>
                        <SelectItem value="custom-model">
                          Custom Model
                        </SelectItem>
                        <SelectItem value="llm-based">LLM-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

            {selectedStep.type === "agent" &&
              selectedStep.category === "LLM" && (
                <>
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select
                      value={selectedStep.config.provider || "openai"}
                      onValueChange={(value) => {
                        const newConfig = {
                          ...selectedStep.config,
                          provider: value,
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={selectedStep.config.model || "gpt-4"}
                      onValueChange={(value) => {
                        const newConfig = {
                          ...selectedStep.config,
                          model: value,
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">
                          GPT-3.5 Turbo
                        </SelectItem>
                        <SelectItem value="claude-3-opus">
                          Claude 3 Opus
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={selectedStep.config.temperature || 0.7}
                      onChange={(e) => {
                        const newConfig = {
                          ...selectedStep.config,
                          temperature: parseFloat(e.target.value),
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    />
                  </div>
                </>
              )}

            {selectedStep.type === "agent" &&
              selectedStep.category === "Retriever" && (
                <>
                  <div className="space-y-2">
                    <Label>Knowledge Base</Label>
                    <Select
                      value={
                        selectedStep.config.knowledgeBase || "support-docs"
                      }
                      onValueChange={(value) => {
                        const newConfig = {
                          ...selectedStep.config,
                          knowledgeBase: value,
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support-docs">
                          Support Documentation
                        </SelectItem>
                        <SelectItem value="product-info">
                          Product Information
                        </SelectItem>
                        <SelectItem value="faq">FAQ Database</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Top K Results</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={selectedStep.config.topK || 5}
                      onChange={(e) => {
                        const newConfig = {
                          ...selectedStep.config,
                          topK: parseInt(e.target.value),
                        };
                        setWorkflow((prev) => ({
                          ...prev,
                          steps: prev.steps.map((step) =>
                            step.id === selectedStep.id
                              ? { ...step, config: newConfig }
                              : step,
                          ),
                        }));
                        setSelectedStep({ ...selectedStep, config: newConfig });
                      }}
                    />
                  </div>
                </>
              )}

            {selectedStep.type === "condition" && (
              <div className="space-y-2">
                <Label>Condition Logic</Label>
                <Textarea
                  placeholder="Define your conditions here..."
                  value={JSON.stringify(
                    selectedStep.config.conditions || [],
                    null,
                    2,
                  )}
                  onChange={(e) => {
                    try {
                      const conditions = JSON.parse(e.target.value);
                      const newConfig = { ...selectedStep.config, conditions };
                      setWorkflow((prev) => ({
                        ...prev,
                        steps: prev.steps.map((step) =>
                          step.id === selectedStep.id
                            ? { ...step, config: newConfig }
                            : step,
                        ),
                      }));
                      setSelectedStep({ ...selectedStep, config: newConfig });
                    } catch (e) {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Workflow Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <Input
                value={workflow.name}
                onChange={(e) =>
                  setWorkflow((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-xl font-bold border-none px-0 h-auto bg-transparent focus-visible:ring-0"
                placeholder="Workflow name..."
              />
              <p className="text-sm text-muted-foreground mt-1">
                {workflow.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant={workflow.status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {workflow.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleTestWorkflow}>
              <Play className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button size="sm" onClick={handleSaveWorkflow}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Step Templates Sidebar */}
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Workflow Components</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Drag components to build your workflow
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {stepTemplates.map((category) => (
                <div key={category.category}>
                  <h4 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.items.map((template, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card
                              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                              onClick={() => handleAddStep(template)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={cn(
                                      "p-2 rounded-lg text-white flex-shrink-0",
                                      template.color,
                                    )}
                                  >
                                    {template.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm truncate">
                                      {template.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {template.description}
                                    </p>
                                  </div>
                                  <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                </div>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Click to add {template.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/20">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Workflow Steps */}
            <div
              className="relative h-full w-full"
              style={{ minHeight: "2000px", minWidth: "2000px" }}
            >
              {renderConnections()}
              <AnimatePresence>
                {workflow.steps.map(renderStepCard)}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <AnimatePresence>
          {isConfigPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l bg-card overflow-hidden"
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm">Configuration</h3>
              </div>
              <ScrollArea className="h-full">
                <div className="p-4">{renderConfigPanel()}</div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
