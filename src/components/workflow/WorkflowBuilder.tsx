import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  Save,
  ArrowRight,
  MessageSquare,
  Brain,
  Bot,
  Database,
  Zap,
  Shield,
  GitBranch,
  Clock,
  Mail,
  BarChart3,
  Users,
  FileText,
  Workflow,
  Plus,
  ArrowLeft,
  Settings,
  ZoomIn,
  ZoomOut,
  Trash2,
  Copy,
  Edit,
  Globe,
  Webhook,
  Calendar,
  MousePointer,
  Filter,
  Repeat,
  Timer,
  Send,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

// Node type definitions for drag and drop
interface NodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category: string;
  config?: Record<string, any>;
  isConfigured?: boolean;
}

interface DraggableNodeType {
  id: string;
  type: "trigger" | "action" | "logic" | "output";
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  color: string;
  bgColor: string;
  borderColor: string;
  defaultConfig?: Record<string, any>;
}

interface FlowNode {
  id: string;
  type: "start" | "process" | "decision" | "end";
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  connections: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedTime: string;
  complexity: "Simple" | "Medium" | "Advanced";
  nodes: FlowNode[];
}

interface WorkflowState {
  name: string;
  description: string;
  isActive: boolean;
  nodes: Node[];
  edges: Edge[];
}

// Custom Node Components
const CustomNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-xl border-2 bg-white dark:bg-[#003135] min-w-[160px] transition-all duration-300 ${selected
        ? "border-[#964734] shadow-[#964734]/30 scale-105"
        : "border-[#0FA4AF]/30 hover:border-[#964734]/50 hover:shadow-xl"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${data.category === "trigger" ? "bg-[#0FA4AF]/20" :
          data.category === "action" ? "bg-[#024950]/20" :
            data.category === "logic" ? "bg-[#964734]/20" : "bg-[#AFDDE5]/20"}`}>
          {data.icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-[#003135] dark:text-white">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs text-[#024950] dark:text-[#AFDDE5] mt-1">
              {data.description}
            </div>
          )}
        </div>
        {data.isConfigured && (
          <CheckCircle className="h-4 w-4 text-[#0FA4AF]" />
        )}
      </div>
    </div>
  );
};

// Draggable Node Component
const DraggableNode = ({ nodeType, onDragStart }: {
  nodeType: DraggableNodeType;
  onDragStart: (nodeType: DraggableNodeType) => void;
}) => {
  const handleDragStart = (event: React.DragEvent) => {
    // Create a serializable version without the icon
    const serializableNodeType = {
      ...nodeType,
      icon: undefined, // Remove the React component
    };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(serializableNodeType));
    event.dataTransfer.effectAllowed = "move";
    onDragStart(nodeType);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`p-3 border rounded-xl cursor-grab hover:cursor-grabbing transition-all duration-300 hover:shadow-lg hover:scale-105 ${nodeType.borderColor} ${nodeType.bgColor} group`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${nodeType.color} group-hover:scale-110 transition-transform duration-300`}>
          {nodeType.icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm text-[#003135] dark:text-white">
            {nodeType.label}
          </div>
          <div className="text-xs text-[#024950] dark:text-[#AFDDE5] mt-1">
            {nodeType.description}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowBuilder = () => {
  const [currentView, setCurrentView] = useState<"templates" | "preview" | "builder">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  // Workflow state
  const [workflow, setWorkflow] = useState<WorkflowState>({
    name: "New Workflow",
    description: "",
    isActive: false,
    nodes: [],
    edges: [],
  });

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<DraggableNodeType | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Available node types for dragging
  const nodeTypes: DraggableNodeType[] = [
    // Trigger nodes
    {
      id: "webhook",
      type: "trigger",
      label: "Webhook",
      description: "HTTP webhook trigger",
      icon: <Webhook className="h-4 w-4 text-white" />,
      category: "trigger",
      color: "bg-[#0FA4AF]",
      bgColor: "bg-[#0FA4AF]/10 hover:bg-[#0FA4AF]/20",
      borderColor: "border-[#0FA4AF]/30 hover:border-[#0FA4AF]",
      defaultConfig: { method: "POST", path: "/webhook" },
    },
    {
      id: "schedule",
      type: "trigger",
      label: "Schedule",
      description: "Time-based trigger",
      icon: <Calendar className="h-4 w-4 text-white" />,
      category: "trigger",
      color: "bg-[#0FA4AF]",
      bgColor: "bg-[#0FA4AF]/10 hover:bg-[#0FA4AF]/20",
      borderColor: "border-[#0FA4AF]/30 hover:border-[#0FA4AF]",
      defaultConfig: { interval: "daily", time: "09:00" },
    },
    {
      id: "manual",
      type: "trigger",
      label: "Manual",
      description: "Manual trigger",
      icon: <MousePointer className="h-4 w-4 text-white" />,
      category: "trigger",
      color: "bg-[#0FA4AF]",
      bgColor: "bg-[#0FA4AF]/10 hover:bg-[#0FA4AF]/20",
      borderColor: "border-[#0FA4AF]/30 hover:border-[#0FA4AF]",
      defaultConfig: { requireConfirmation: true },
    },
    // Action nodes
    {
      id: "ai-chat",
      type: "action",
      label: "AI Chat",
      description: "Process with AI",
      icon: <Bot className="h-4 w-4 text-white" />,
      category: "action",
      color: "bg-[#024950]",
      bgColor: "bg-[#024950]/10 hover:bg-[#024950]/20",
      borderColor: "border-[#024950]/30 hover:border-[#024950]",
      defaultConfig: { model: "gpt-4", temperature: 0.7 },
    },
    {
      id: "api-call",
      type: "action",
      label: "API Call",
      description: "Make HTTP request",
      icon: <Globe className="h-4 w-4 text-white" />,
      category: "action",
      color: "bg-[#024950]",
      bgColor: "bg-[#024950]/10 hover:bg-[#024950]/20",
      borderColor: "border-[#024950]/30 hover:border-[#024950]",
      defaultConfig: { method: "GET", timeout: 30 },
    },
    {
      id: "send-email",
      type: "action",
      label: "Send Email",
      description: "Send email notification",
      icon: <Mail className="h-4 w-4 text-white" />,
      category: "action",
      color: "bg-[#024950]",
      bgColor: "bg-[#024950]/10 hover:bg-[#024950]/20",
      borderColor: "border-[#024950]/30 hover:border-[#024950]",
      defaultConfig: { provider: "smtp", template: "default" },
    },
    {
      id: "database",
      type: "action",
      label: "Database",
      description: "Database operation",
      icon: <Database className="h-4 w-4 text-white" />,
      category: "action",
      color: "bg-[#024950]",
      bgColor: "bg-[#024950]/10 hover:bg-[#024950]/20",
      borderColor: "border-[#024950]/30 hover:border-[#024950]",
      defaultConfig: { operation: "select", table: "" },
    },
    // Logic nodes
    {
      id: "condition",
      type: "logic",
      label: "Condition",
      description: "Conditional branching",
      icon: <GitBranch className="h-4 w-4 text-white" />,
      category: "logic",
      color: "bg-[#964734]",
      bgColor: "bg-[#964734]/10 hover:bg-[#964734]/20",
      borderColor: "border-[#964734]/30 hover:border-[#964734]",
      defaultConfig: { operator: "equals", value: "" },
    },
    {
      id: "filter",
      type: "logic",
      label: "Filter",
      description: "Filter data",
      icon: <Filter className="h-4 w-4 text-white" />,
      category: "logic",
      color: "bg-[#964734]",
      bgColor: "bg-[#964734]/10 hover:bg-[#964734]/20",
      borderColor: "border-[#964734]/30 hover:border-[#964734]",
      defaultConfig: { field: "", condition: "contains" },
    },
    {
      id: "loop",
      type: "logic",
      label: "Loop",
      description: "Iterate over data",
      icon: <Repeat className="h-4 w-4 text-white" />,
      category: "logic",
      color: "bg-[#964734]",
      bgColor: "bg-[#964734]/10 hover:bg-[#964734]/20",
      borderColor: "border-[#964734]/30 hover:border-[#964734]",
      defaultConfig: { maxIterations: 100 },
    },
    {
      id: "delay",
      type: "logic",
      label: "Delay",
      description: "Wait for specified time",
      icon: <Timer className="h-4 w-4 text-white" />,
      category: "logic",
      color: "bg-[#964734]",
      bgColor: "bg-[#964734]/10 hover:bg-[#964734]/20",
      borderColor: "border-[#964734]/30 hover:border-[#964734]",
      defaultConfig: { duration: 5, unit: "seconds" },
    },
  ];

  // Custom node types for React Flow
  const customNodeTypes: NodeTypes = {
    custom: CustomNode,
  };

  // Drag and drop handlers
  const onDragStart = (nodeType: DraggableNodeType) => {
    setDraggedNodeType(nodeType);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type || !reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const nodeData = JSON.parse(type) as Omit<DraggableNodeType, 'icon'>;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Find the original node type to get the icon
      const originalNodeType = nodeTypes.find(nt => nt.id === nodeData.id);

      const newNode: Node = {
        id: `${nodeData.id}-${Date.now()}`,
        type: "custom",
        position,
        data: {
          label: nodeData.label,
          description: nodeData.description,
          icon: originalNodeType?.icon,
          category: nodeData.category,
          config: nodeData.defaultConfig || {},
          isConfigured: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setDraggedNodeType(null);
    },
    [reactFlowInstance, setNodes, nodeTypes]
  );

  // React Flow event handlers
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsConfigDialogOpen(true);
  }, []);

  const onDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) =>
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const onDuplicateNode = useCallback(() => {
    if (selectedNode) {
      const newNode: Node = {
        ...selectedNode,
        id: `${selectedNode.id}-copy-${Date.now()}`,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [selectedNode, setNodes]);

  // Workflow management
  const saveWorkflow = useCallback(() => {
    const workflowData = {
      ...workflow,
      nodes,
      edges,
    };
    console.log("Saving workflow:", workflowData);
    // Here you would typically save to your backend
  }, [workflow, nodes, edges]);

  const testWorkflow = useCallback(() => {
    console.log("Testing workflow with nodes:", nodes, "and edges:", edges);
    // Here you would typically send the workflow for testing
  }, [nodes, edges]);

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: "customer-support",
      name: "Customer Support Automation",
      description: "Automatically handle customer inquiries with AI-powered responses and smart routing",
      category: "Customer Service",
      estimatedTime: "5 minutes",
      complexity: "Simple",
      nodes: [
        {
          id: "start",
          type: "start",
          title: "Customer Message Received",
          description: "New message from customer",
          icon: <MessageSquare className="h-5 w-5" />,
          category: "Trigger",
          connections: ["process-1"],
        },
        {
          id: "process-1",
          type: "process",
          title: "Analyze Intent",
          description: "AI analyzes customer intent",
          icon: <Brain className="h-5 w-5" />,
          category: "AI Processing",
          connections: ["decision-1"],
        },
        {
          id: "decision-1",
          type: "decision",
          title: "Can Auto-Respond?",
          description: "Check if we can automatically respond",
          icon: <GitBranch className="h-5 w-5" />,
          category: "Logic",
          connections: ["process-2", "end"],
        },
        {
          id: "process-2",
          type: "process",
          title: "Generate Response",
          description: "AI generates appropriate response",
          icon: <Bot className="h-5 w-5" />,
          category: "AI Processing",
          connections: ["end"],
        },
        {
          id: "end",
          type: "end",
          title: "Send Response",
          description: "Response sent to customer",
          icon: <Mail className="h-5 w-5" />,
          category: "Action",
          connections: [],
        },
      ],
    },
    {
      id: "lead-qualification",
      name: "Lead Qualification Pipeline",
      description: "Automatically qualify and route sales leads based on predefined criteria",
      category: "Sales",
      estimatedTime: "8 minutes",
      complexity: "Medium",
      nodes: [
        {
          id: "start",
          type: "start",
          title: "New Lead Captured",
          description: "Lead form submitted",
          icon: <Users className="h-5 w-5" />,
          category: "Trigger",
          connections: ["process-1"],
        },
        {
          id: "process-1",
          type: "process",
          title: "Enrich Lead Data",
          description: "Gather additional lead information",
          icon: <Database className="h-5 w-5" />,
          category: "Data Processing",
          connections: ["decision-1"],
        },
        {
          id: "decision-1",
          type: "decision",
          title: "Qualified Lead?",
          description: "Check lead qualification criteria",
          icon: <BarChart3 className="h-5 w-5" />,
          category: "Logic",
          connections: ["process-2", "process-3"],
        },
        {
          id: "process-2",
          type: "process",
          title: "Route to Sales",
          description: "Assign to sales representative",
          icon: <ArrowRight className="h-5 w-5" />,
          category: "Action",
          connections: ["end"],
        },
        {
          id: "process-3",
          type: "process",
          title: "Add to Nurture Campaign",
          description: "Add to email nurture sequence",
          icon: <Mail className="h-5 w-5" />,
          category: "Marketing",
          connections: ["end"],
        },
        {
          id: "end",
          type: "end",
          title: "Process Complete",
          description: "Lead processed successfully",
          icon: <Shield className="h-5 w-5" />,
          category: "Completion",
          connections: [],
        },
      ],
    },
    {
      id: "content-moderation",
      name: "Content Moderation System",
      description: "Automatically moderate user-generated content using AI and human review",
      category: "Security",
      estimatedTime: "3 minutes",
      complexity: "Advanced",
      nodes: [
        {
          id: "start",
          type: "start",
          title: "Content Submitted",
          description: "User submits content",
          icon: <FileText className="h-5 w-5" />,
          category: "Trigger",
          connections: ["process-1"],
        },
        {
          id: "process-1",
          type: "process",
          title: "AI Content Analysis",
          description: "Analyze content for violations",
          icon: <Brain className="h-5 w-5" />,
          category: "AI Processing",
          connections: ["decision-1"],
        },
        {
          id: "decision-1",
          type: "decision",
          title: "Content Safe?",
          description: "Check if content meets guidelines",
          icon: <Shield className="h-5 w-5" />,
          category: "Security",
          connections: ["process-2", "process-3"],
        },
        {
          id: "process-2",
          type: "process",
          title: "Approve Content",
          description: "Content approved for publication",
          icon: <ArrowRight className="h-5 w-5" />,
          category: "Action",
          connections: ["end"],
        },
        {
          id: "process-3",
          type: "process",
          title: "Flag for Review",
          description: "Send to human moderator",
          icon: <Users className="h-5 w-5" />,
          category: "Review",
          connections: ["end"],
        },
        {
          id: "end",
          type: "end",
          title: "Moderation Complete",
          description: "Content moderation finished",
          icon: <Shield className="h-5 w-5" />,
          category: "Completion",
          connections: [],
        },
      ],
    },
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Customer Service": return <MessageSquare className="h-6 w-6" />;
      case "Sales": return <BarChart3 className="h-6 w-6" />;
      case "Security": return <Shield className="h-6 w-6" />;
      case "Marketing": return <Mail className="h-6 w-6" />;
      default: return <Workflow className="h-6 w-6" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "Customer Service": return "from-[#003135] to-[#024950]";
      case "Sales": return "from-[#024950] to-[#0FA4AF]";
      case "Security": return "from-[#964734] to-[#024950]";
      case "Marketing": return "from-[#0FA4AF] to-[#AFDDE5]";
      default: return "from-[#003135] to-[#024950]";
    }
  };

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setCurrentView("preview");
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setCurrentView("builder");
    }
  };

  const renderTemplateGallery = () => (
    <div className="p-6">
      {/* Page Header - Inline Breadcrumb Style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Workflow className="h-5 w-5 text-[#024950]" />
          <h1 className="text-xl font-semibold text-[#003135] dark:text-white">Workflow Templates</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentView("builder")}
          className="border-[#0FA4AF]/30 text-[#024950] hover:bg-[#0FA4AF]/10 dark:text-[#AFDDE5] dark:border-[#024950] dark:hover:bg-[#024950]/50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Custom
        </Button>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#024950] to-[#0FA4AF] rounded-2xl mb-6">
            <Workflow className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-[#003135] dark:text-white mb-6">
            Workflow Templates
          </h1>
          <p className="text-xl text-[#024950] dark:text-[#AFDDE5] max-w-3xl mx-auto leading-relaxed">
            Choose from our professionally designed workflow templates.
            Each template is optimized for specific business processes and can be customized to match your exact requirements.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {workflowTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border border-gray-100 overflow-hidden"
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Template Header */}
              <div className={`h-32 bg-gradient-to-r ${getCategoryGradient(template.category)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative p-6 h-full flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="font-bold text-xl mb-1">{template.name}</h3>
                    <p className="text-white/90 text-sm">{template.category}</p>
                  </div>
                  <div className="text-white/90">
                    {getCategoryIcon(template.category)}
                  </div>
                </div>
              </div>

              {/* Template Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {template.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{template.estimatedTime}</span>
                    </div>
                    <Badge className={`text-xs px-3 py-1 border ${getComplexityColor(template.complexity)}`}>
                      {template.complexity}
                    </Badge>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    {template.nodes.length} steps
                  </span>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r ${getCategoryGradient(template.category)} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    Preview <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Custom Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="px-12 py-6 text-lg border-2 border-dashed border-[#0FA4AF]/30 hover:border-[#0FA4AF] hover:bg-[#0FA4AF]/10 dark:hover:bg-[#024950]/50 transition-all duration-300 rounded-2xl text-[#024950] dark:text-[#AFDDE5]"
            onClick={() => setCurrentView("builder")}
          >
            <Plus className="h-6 w-6 mr-3" />
            Create Custom Workflow
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="p-6">
        {/* Page Header - Inline Breadcrumb Style */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("templates")}
              className="flex items-center space-x-2 text-[#024950] dark:text-[#AFDDE5] hover:bg-[#0FA4AF]/10 dark:hover:bg-[#024950]/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Templates</span>
            </Button>
            <span className="text-[#024950]/50 dark:text-[#AFDDE5]/50">/</span>
            <h1 className="text-xl font-semibold text-[#003135] dark:text-white">{selectedTemplate.name}</h1>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" size="lg" className="border-[#0FA4AF]/30 text-[#024950] hover:bg-[#0FA4AF]/10 dark:text-[#AFDDE5] dark:border-[#024950] dark:hover:bg-[#024950]/50">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <Button size="lg" onClick={handleUseTemplate} className="bg-gradient-to-r from-[#024950] to-[#0FA4AF] text-white hover:from-[#003135] hover:to-[#024950]">
              <Play className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </div>

        <div className="space-y-8">

          {/* Template Info */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 bg-gradient-to-r ${getCategoryGradient(selectedTemplate.category)} rounded-2xl text-white`}>
                  {getCategoryIcon(selectedTemplate.category)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedTemplate.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge className={`px-4 py-2 border ${getComplexityColor(selectedTemplate.complexity)}`}>
                  {selectedTemplate.complexity}
                </Badge>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{selectedTemplate.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Visualization */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Workflow Steps</h2>
            <div className="space-y-6">
              {selectedTemplate.nodes.map((node, index) => (
                <div key={node.id} className="flex items-center space-x-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#024950] to-[#0FA4AF] rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        {node.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {node.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {node.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {node.category}
                        </Badge>
                      </div>
                      <div className="text-gray-400">
                        {node.type === "decision" && <GitBranch className="h-6 w-6" />}
                        {node.type === "process" && <Zap className="h-6 w-6" />}
                        {node.type === "start" && <Play className="h-6 w-6" />}
                        {node.type === "end" && <Shield className="h-6 w-6" />}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < selectedTemplate.nodes.length - 1 && (
                    <div className="flex-shrink-0">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkflowBuilder = () => (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-[#AFDDE5]/10 to-[#964734]/5">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-b border-[#0FA4AF]/20 dark:border-[#024950] shadow-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("templates")}
              className="text-[#964734] dark:text-[#AFDDE5] hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 transition-all duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Templates
            </Button>
            <div className="h-6 w-px bg-[#964734]/30"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#964734] to-[#024950] rounded-lg flex items-center justify-center">
                <Workflow className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#003135] dark:text-white">
                  {workflow.name}
                </h1>
                <p className="text-xs text-[#964734] dark:text-[#AFDDE5]">
                  Drag & Drop Workflow Builder
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedNode && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-[#964734]/10 rounded-lg border border-[#964734]/30">
                <span className="text-sm text-[#964734] font-medium">
                  {selectedNode.data.label} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicateNode}
                  className="h-6 w-6 p-0 hover:bg-[#964734]/20"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDeleteNode}
                  className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={saveWorkflow}
              className="border-[#964734]/30 dark:border-[#024950] hover:bg-[#964734]/10 dark:hover:bg-[#964734]/20 text-[#964734] transition-all duration-300 group"
            >
              <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={testWorkflow}
              className="bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Test Workflow
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Enhanced Node Palette */}
          <div className="w-80 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-r border-[#0FA4AF]/20 dark:border-[#024950] p-4 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0FA4AF] to-[#964734] rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#003135] dark:text-white">Node Palette</h2>
                  <p className="text-xs text-[#964734] dark:text-[#AFDDE5]">Drag to canvas</p>
                </div>
              </div>

              {/* Trigger Nodes */}
              <div>
                <h3 className="font-semibold text-[#003135] dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-[#0FA4AF] rounded-full mr-2"></div>
                  Triggers
                </h3>
                <div className="space-y-2">
                  {nodeTypes.filter(node => node.category === "trigger").map((nodeType) => (
                    <DraggableNode
                      key={nodeType.id}
                      nodeType={nodeType}
                      onDragStart={onDragStart}
                    />
                  ))}
                </div>
              </div>

              {/* Action Nodes */}
              <div>
                <h3 className="font-semibold text-[#003135] dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-[#024950] rounded-full mr-2"></div>
                  Actions
                </h3>
                <div className="space-y-2">
                  {nodeTypes.filter(node => node.category === "action").map((nodeType) => (
                    <DraggableNode
                      key={nodeType.id}
                      nodeType={nodeType}
                      onDragStart={onDragStart}
                    />
                  ))}
                </div>
              </div>

              {/* Logic Nodes */}
              <div>
                <h3 className="font-semibold text-[#003135] dark:text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-[#964734] rounded-full mr-2"></div>
                  Logic & Control
                </h3>
                <div className="space-y-2">
                  {nodeTypes.filter(node => node.category === "logic").map((nodeType) => (
                    <DraggableNode
                      key={nodeType.id}
                      nodeType={nodeType}
                      onDragStart={onDragStart}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ReactFlow Canvas */}
          <div className="flex-1 relative">
            <div
              ref={reactFlowWrapper}
              className="w-full h-full"
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeDoubleClick}
                onInit={setReactFlowInstance}
                nodeTypes={customNodeTypes}
                fitView
                className="bg-gradient-to-br from-[#AFDDE5]/5 to-[#964734]/5"
              >
                <Background
                  color="#964734"
                  gap={20}
                  size={1}
                />
                <Controls
                  className="bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border border-[#964734]/30 rounded-lg shadow-lg"
                />
                <MiniMap
                  className="bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border border-[#964734]/30 rounded-lg shadow-lg"
                  nodeColor={(node) => {
                    switch (node.data.category) {
                      case "trigger": return "#0FA4AF";
                      case "action": return "#024950";
                      case "logic": return "#964734";
                      default: return "#AFDDE5";
                    }
                  }}
                />
              </ReactFlow>

              {/* Empty State */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-[#024950]/60 dark:text-[#AFDDE5]/60 max-w-md">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#964734]/20 to-[#0FA4AF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Workflow className="h-8 w-8 text-[#964734]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#003135] dark:text-white mb-2">
                      Start Building Your Workflow
                    </h3>
                    <p className="text-sm mb-4">
                      Drag nodes from the palette to create your automation workflow
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <MousePointer className="h-3 w-3" />
                        <span>Drag & Drop</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ArrowRight className="h-3 w-3" />
                        <span>Connect</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Settings className="h-3 w-3" />
                        <span>Configure</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="col-span-3 space-y-4">
            <Card className="bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950]">
              <CardHeader>
                <CardTitle className="text-lg text-[#003135] dark:text-white">Properties</CardTitle>
                <CardDescription className="text-[#024950] dark:text-[#AFDDE5]">
                  Configure selected node
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-[#024950]/60 dark:text-[#AFDDE5]/60 py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a node to configure its properties</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#003135] border border-[#0FA4AF]/20 dark:border-[#024950]">
              <CardHeader>
                <CardTitle className="text-lg text-[#003135] dark:text-white">Workflow Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name" className="text-[#024950] dark:text-[#AFDDE5]">Name</Label>
                  <Input
                    id="workflow-name"
                    placeholder="Enter workflow name"
                    className="border-[#0FA4AF]/30 focus:border-[#0FA4AF]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Properties Panel */}
          <div className="w-80 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-l border-[#0FA4AF]/20 dark:border-[#024950] p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Node Properties */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#964734] to-[#024950] rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#003135] dark:text-white">Properties</h2>
                    <p className="text-xs text-[#964734] dark:text-[#AFDDE5]">Configure node</p>
                  </div>
                </div>

                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-[#964734]/10 to-[#0FA4AF]/10 rounded-lg border border-[#964734]/30">
                      <div className="flex items-center space-x-3 mb-3">
                        {selectedNode.data.icon}
                        <div>
                          <h3 className="font-semibold text-[#003135] dark:text-white">
                            {selectedNode.data.label}
                          </h3>
                          <p className="text-xs text-[#964734] dark:text-[#AFDDE5]">
                            {selectedNode.data.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsConfigDialogOpen(true)}
                        className="w-full bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Configure Node
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[#024950]/60 dark:text-[#AFDDE5]/60 py-8">
                    <div className="w-12 h-12 bg-[#964734]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MousePointer className="h-6 w-6 text-[#964734]" />
                    </div>
                    <p className="text-sm">Select a node to configure its properties</p>
                  </div>
                )}
              </div>

              {/* Workflow Info */}
              <div>
                <h3 className="font-semibold text-[#003135] dark:text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-[#964734] rounded-full mr-2"></div>
                  Workflow Settings
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name" className="text-[#024950] dark:text-[#AFDDE5]">Name</Label>
                    <Input
                      id="workflow-name"
                      value={workflow.name}
                      onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter workflow name"
                      className="border-[#964734]/30 focus:border-[#964734] focus:ring-[#964734]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workflow-description" className="text-[#024950] dark:text-[#AFDDE5]">Description</Label>
                    <Textarea
                      id="workflow-description"
                      value={workflow.description}
                      onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your workflow"
                      rows={3}
                      className="border-[#964734]/30 focus:border-[#964734] focus:ring-[#964734]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#024950] dark:text-[#AFDDE5]">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={(checked) => setWorkflow(prev => ({ ...prev, isActive: checked }))}
                      />
                      <span className="text-sm text-[#024950] dark:text-[#AFDDE5]">
                        {workflow.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Stats */}
              <div className="p-4 bg-gradient-to-r from-[#0FA4AF]/10 to-[#964734]/10 rounded-lg border border-[#0FA4AF]/30">
                <h4 className="font-medium text-[#003135] dark:text-white mb-3">Workflow Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#024950] dark:text-[#AFDDE5]">Nodes:</span>
                    <span className="font-medium text-[#964734]">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#024950] dark:text-[#AFDDE5]">Connections:</span>
                    <span className="font-medium text-[#964734]">{edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#024950] dark:text-[#AFDDE5]">Status:</span>
                    <Badge className={workflow.isActive ? "bg-[#0FA4AF]/20 text-[#0FA4AF]" : "bg-gray-500/20 text-gray-500"}>
                      {workflow.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Configuration Dialog */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="max-w-2xl bg-white dark:bg-[#003135] border-[#964734]/30">
            <DialogHeader>
              <DialogTitle className="text-[#003135] dark:text-white flex items-center">
                {selectedNode?.data.icon}
                <span className="ml-2">Configure {selectedNode?.data.label}</span>
              </DialogTitle>
              <DialogDescription className="text-[#024950] dark:text-[#AFDDE5]">
                Set up the configuration for this node
              </DialogDescription>
            </DialogHeader>

            {selectedNode && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#024950] dark:text-[#AFDDE5]">Node Name</Label>
                    <Input
                      value={selectedNode.data.label}
                      className="border-[#964734]/30 focus:border-[#964734]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#024950] dark:text-[#AFDDE5]">Category</Label>
                    <Select value={selectedNode.data.category}>
                      <SelectTrigger className="border-[#964734]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trigger">Trigger</SelectItem>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="logic">Logic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#024950] dark:text-[#AFDDE5]">Description</Label>
                  <Textarea
                    value={selectedNode.data.description || ""}
                    placeholder="Enter node description"
                    className="border-[#964734]/30 focus:border-[#964734]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfigDialogOpen(false)}
                    className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Here you would update the node configuration
                      setIsConfigDialogOpen(false);
                    }}
                    className="bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white"
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ReactFlowProvider>
  );

  // Main render logic
  if (currentView === "preview") {
    return renderTemplatePreview();
  }

  if (currentView === "builder") {
    return renderWorkflowBuilder();
  }

  return renderTemplateGallery();
};

export default WorkflowBuilder;
