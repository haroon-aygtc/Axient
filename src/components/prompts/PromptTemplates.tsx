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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Play,
  FileText,
  Tag,
  Clock,
} from "lucide-react";

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | "customer-service"
    | "technical-support"
    | "sales"
    | "general"
    | "custom";
  template: string;
  variables: string[];
  usage: number;
  lastUsed: string;
  isActive: boolean;
  tags: string[];
}

const PromptTemplates = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([
    {
      id: "1",
      name: "Customer Support Response",
      description: "Standard template for customer support interactions",
      category: "customer-service",
      template: `You are a helpful customer support representative. Please respond to the customer's inquiry with empathy and provide clear, actionable solutions.

Customer Query: {query}
Customer Context: {context}
Knowledge Base Results: {knowledge}

Please provide a helpful response that:
1. Acknowledges the customer's concern
2. Provides a clear solution or next steps
3. Offers additional assistance if needed

Response:`,
      variables: ["query", "context", "knowledge"],
      usage: 245,
      lastUsed: "2024-01-15",
      isActive: true,
      tags: ["support", "customer", "standard"],
    },
    {
      id: "2",
      name: "Technical Troubleshooting",
      description: "Template for technical support and troubleshooting",
      category: "technical-support",
      template: `You are a technical support specialist. Help the user troubleshoot their technical issue with step-by-step guidance.

Issue Description: {issue}
System Information: {system_info}
Error Details: {error_details}

Provide a structured troubleshooting response:
1. Acknowledge the issue
2. List possible causes
3. Provide step-by-step solutions
4. Suggest preventive measures

Response:`,
      variables: ["issue", "system_info", "error_details"],
      usage: 156,
      lastUsed: "2024-01-14",
      isActive: true,
      tags: ["technical", "troubleshooting", "support"],
    },
    {
      id: "3",
      name: "Sales Inquiry Response",
      description:
        "Template for handling sales inquiries and product questions",
      category: "sales",
      template: `You are a knowledgeable sales representative. Help the prospect understand our products and services.

Prospect Inquiry: {inquiry}
Product Interest: {product}
Company Size: {company_size}

Provide a compelling response that:
1. Addresses their specific needs
2. Highlights relevant product benefits
3. Includes a clear call-to-action
4. Offers to schedule a demo or consultation

Response:`,
      variables: ["inquiry", "product", "company_size"],
      usage: 89,
      lastUsed: "2024-01-13",
      isActive: true,
      tags: ["sales", "inquiry", "product"],
    },
    {
      id: "4",
      name: "General Q&A",
      description: "General purpose template for answering questions",
      category: "general",
      template: `You are a helpful AI assistant. Answer the user's question accurately and concisely.

User Question: {question}
Context: {context}
Relevant Information: {information}

Provide a clear, accurate answer that:
1. Directly addresses the question
2. Uses the provided context and information
3. Is easy to understand
4. Offers additional help if needed

Answer:`,
      variables: ["question", "context", "information"],
      usage: 312,
      lastUsed: "2024-01-15",
      isActive: true,
      tags: ["general", "qa", "standard"],
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PromptTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "general" as PromptTemplate["category"],
    template: "",
    tags: "",
  });

  const handleAddTemplate = () => {
    const variables = extractVariables(newTemplate.template);
    const template: PromptTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      template: newTemplate.template,
      variables,
      usage: 0,
      lastUsed: new Date().toISOString().split("T")[0],
      isActive: true,
      tags: newTemplate.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setTemplates([...templates, template]);
    setIsAddDialogOpen(false);
    setNewTemplate({
      name: "",
      description: "",
      category: "general",
      template: "",
      tags: "",
    });
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;

    const variables = extractVariables(newTemplate.template);
    const updatedTemplate: PromptTemplate = {
      ...selectedTemplate,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      template: newTemplate.template,
      variables,
      tags: newTemplate.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id ? updatedTemplate : t,
      ),
    );
    setIsEditDialogOpen(false);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === templateId ? { ...t, isActive: !t.isActive } : t,
      ),
    );
  };

  const handleCopyTemplate = (template: PromptTemplate) => {
    navigator.clipboard.writeText(template.template);
  };

  const openEditDialog = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      template: template.template,
      tags: template.tags.join(", "),
    });
    setIsEditDialogOpen(true);
  };

  const extractVariables = (template: string): string[] => {
    const matches = template.match(/{([^}]+)}/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  };

  const getCategoryBadge = (category: PromptTemplate["category"]) => {
    const colors = {
      "customer-service": "bg-blue-100 text-blue-800",
      "technical-support": "bg-green-100 text-green-800",
      sales: "bg-purple-100 text-purple-800",
      general: "bg-gray-100 text-gray-800",
      custom: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge className={colors[category]}>
        {category.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const totalUsage = templates.reduce((sum, t) => sum + t.usage, 0);

  return (
    <div className="bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Prompt Templates</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage reusable prompt templates for your AI workflows
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Prompt Template</DialogTitle>
                <DialogDescription>
                  Create a new reusable prompt template for your AI workflows
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) =>
                        setNewTemplate({
                          ...newTemplate,
                          category: value as PromptTemplate["category"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer-service">
                          Customer Service
                        </SelectItem>
                        <SelectItem value="technical-support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    value={newTemplate.description}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-content">Template Content</Label>
                  <Textarea
                    id="template-content"
                    value={newTemplate.template}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        template: e.target.value,
                      })
                    }
                    placeholder="Enter your prompt template here. Use {variable_name} for variables."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use curly braces to define variables: {"{"}variable_name
                    {"}"}. Variables will be automatically detected.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-tags">Tags</Label>
                  <Input
                    id="template-tags"
                    value={newTemplate.tags}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, tags: e.target.value })
                    }
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTemplate}>Create Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTemplates}</div>
              <p className="text-xs text-muted-foreground">
                {activeTemplates} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalUsage.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all templates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">General Q&A</div>
              <p className="text-xs text-muted-foreground">
                312 uses this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Different categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="bg-background">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Category</span>
                  {getCategoryBadge(template.category)}
                </div>

                <div>
                  <span className="text-sm font-medium">Variables</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables.length > 0 ? (
                      template.variables.map((variable) => (
                        <Badge
                          key={variable}
                          variant="outline"
                          className="text-xs"
                        >
                          {variable}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No variables
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-muted-foreground">
                      Used {template.usage} times
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {template.lastUsed}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(template.id)}
                  >
                    {template.isActive ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Prompt Template</DialogTitle>
              <DialogDescription>
                Modify the selected prompt template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-template-name">Template Name</Label>
                  <Input
                    id="edit-template-name"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-template-category">Category</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) =>
                      setNewTemplate({
                        ...newTemplate,
                        category: value as PromptTemplate["category"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-service">
                        Customer Service
                      </SelectItem>
                      <SelectItem value="technical-support">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-description">Description</Label>
                <Input
                  id="edit-template-description"
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-content">Template Content</Label>
                <Textarea
                  id="edit-template-content"
                  value={newTemplate.template}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      template: e.target.value,
                    })
                  }
                  placeholder="Enter your prompt template here. Use {variable_name} for variables."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-tags">Tags</Label>
                <Input
                  id="edit-template-tags"
                  value={newTemplate.tags}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, tags: e.target.value })
                  }
                  placeholder="Enter tags separated by commas"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditTemplate}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PromptTemplates;
