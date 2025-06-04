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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Upload,
  FileText,
  Globe,
  Database,
  Search,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";

interface KnowledgeSource {
  id: string;
  name: string;
  type: "document" | "url" | "text" | "database";
  status: "processing" | "ready" | "error" | "syncing";
  size: number;
  lastUpdated: string;
  chunks: number;
  metadata: Record<string, any>;
}

const KnowledgeBase = () => {
  const [sources, setSources] = useState<KnowledgeSource[]>([
    {
      id: "1",
      name: "Product Documentation",
      type: "document",
      status: "ready",
      size: 2.5,
      lastUpdated: "2024-01-15",
      chunks: 156,
      metadata: { format: "PDF", pages: 45 },
    },
    {
      id: "2",
      name: "Company Website",
      type: "url",
      status: "syncing",
      size: 1.8,
      lastUpdated: "2024-01-14",
      chunks: 89,
      metadata: { url: "https://company.com", depth: 3 },
    },
    {
      id: "3",
      name: "FAQ Database",
      type: "database",
      status: "ready",
      size: 0.8,
      lastUpdated: "2024-01-13",
      chunks: 42,
      metadata: { table: "faqs", records: 42 },
    },
    {
      id: "4",
      name: "Support Articles",
      type: "text",
      status: "processing",
      size: 1.2,
      lastUpdated: "2024-01-12",
      chunks: 0,
      metadata: { articles: 25 },
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sources");
  const [newSource, setNewSource] = useState({
    name: "",
    type: "document" as KnowledgeSource["type"],
    content: "",
    url: "",
  });

  const handleAddSource = () => {
    const source: KnowledgeSource = {
      id: Date.now().toString(),
      name: newSource.name,
      type: newSource.type,
      status: "processing",
      size: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      chunks: 0,
      metadata: {},
    };

    setSources([...sources, source]);
    setIsAddDialogOpen(false);
    setNewSource({ name: "", type: "document", content: "", url: "" });
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources(sources.filter((source) => source.id !== sourceId));
  };

  const handleRefreshSource = (sourceId: string) => {
    setSources(
      sources.map((source) =>
        source.id === sourceId
          ? { ...source, status: "syncing" as const }
          : source,
      ),
    );
  };

  const getStatusBadge = (status: KnowledgeSource["status"]) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
        );
      case "syncing":
        return <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: KnowledgeSource["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "url":
        return <Globe className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const totalSources = sources.length;
  const readySources = sources.filter((s) => s.status === "ready").length;
  const totalChunks = sources.reduce((sum, s) => sum + s.chunks, 0);
  const totalSize = sources.reduce((sum, s) => sum + s.size, 0);

  return (
    <div className="bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">
              Manage your AI's knowledge sources and data
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Knowledge Source</DialogTitle>
                <DialogDescription>
                  Add a new source of knowledge for your AI assistant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source-name">Source Name</Label>
                  <Input
                    id="source-name"
                    value={newSource.name}
                    onChange={(e) =>
                      setNewSource({ ...newSource, name: e.target.value })
                    }
                    placeholder="Enter source name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-type">Source Type</Label>
                  <Select
                    value={newSource.type}
                    onValueChange={(value) =>
                      setNewSource({
                        ...newSource,
                        type: value as KnowledgeSource["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document Upload</SelectItem>
                      <SelectItem value="url">Website/URL</SelectItem>
                      <SelectItem value="text">Text Input</SelectItem>
                      <SelectItem value="database">
                        Database Connection
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newSource.type === "url" && (
                  <div className="space-y-2">
                    <Label htmlFor="source-url">URL</Label>
                    <Input
                      id="source-url"
                      value={newSource.url}
                      onChange={(e) =>
                        setNewSource({ ...newSource, url: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {newSource.type === "text" && (
                  <div className="space-y-2">
                    <Label htmlFor="source-content">Content</Label>
                    <Textarea
                      id="source-content"
                      value={newSource.content}
                      onChange={(e) =>
                        setNewSource({ ...newSource, content: e.target.value })
                      }
                      placeholder="Enter your text content here..."
                      rows={6}
                    />
                  </div>
                )}

                {newSource.type === "document" && (
                  <div className="space-y-2">
                    <Label>Document Upload</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supports PDF, DOC, TXT, MD files up to 10MB
                      </p>
                    </div>
                  </div>
                )}

                {newSource.type === "database" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="db-connection">Database Connection</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select database connection" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgres">
                            PostgreSQL - Main DB
                          </SelectItem>
                          <SelectItem value="mysql">
                            MySQL - Analytics
                          </SelectItem>
                          <SelectItem value="mongodb">
                            MongoDB - Content
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-query">Query/Table</Label>
                      <Textarea
                        id="db-query"
                        placeholder="SELECT * FROM knowledge_articles WHERE published = true"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSource}>Add Source</Button>
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
                Total Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSources}</div>
              <p className="text-xs text-muted-foreground">
                {readySources} ready, {totalSources - readySources} processing
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Knowledge Chunks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalChunks.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Searchable knowledge pieces
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSize.toFixed(1)} MB
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 100 MB limit
              </p>
              <Progress className="mt-2" value={(totalSize / 100) * 100} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">
                All sources up to date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="search">Search & Test</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid gap-4">
              {sources.map((source) => (
                <Card key={source.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(source.type)}
                        <div>
                          <CardTitle className="text-lg">
                            {source.name}
                          </CardTitle>
                          <CardDescription>
                            {source.type.charAt(0).toUpperCase() +
                              source.type.slice(1)}{" "}
                            • {source.size.toFixed(1)} MB • {source.chunks}{" "}
                            chunks
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(source.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRefreshSource(source.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <span className="text-sm font-medium">
                          Last Updated
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {source.lastUpdated}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Status</span>
                        <p className="text-sm text-muted-foreground">
                          {source.status === "processing" &&
                            "Processing content..."}
                          {source.status === "ready" && "Ready for queries"}
                          {source.status === "syncing" && "Syncing updates..."}
                          {source.status === "error" && "Error occurred"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Metadata</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(source.metadata).map(
                            ([key, value]) => (
                              <Badge
                                key={key}
                                variant="outline"
                                className="text-xs"
                              >
                                {key}: {value}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                    {source.status === "processing" && (
                      <div className="mt-4">
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Processing... 65% complete
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Knowledge Retrieval</CardTitle>
                <CardDescription>
                  Search your knowledge base to test retrieval accuracy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter your search query..."
                    className="flex-1"
                  />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <ScrollArea className="h-64 w-full rounded-md border p-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">
                            Product Documentation
                          </span>
                          <Badge variant="outline">Score: 0.92</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Our product offers comprehensive analytics and
                          reporting features that help businesses make
                          data-driven decisions...
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">
                            FAQ Database
                          </span>
                          <Badge variant="outline">Score: 0.87</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Q: How do I access the analytics dashboard? A:
                          Navigate to the Analytics section in the main menu...
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Settings</CardTitle>
                <CardDescription>
                  Configure how your knowledge base processes and retrieves
                  information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="chunk-size">Chunk Size</Label>
                    <Input
                      id="chunk-size"
                      type="number"
                      min="100"
                      max="2000"
                      defaultValue="512"
                    />
                    <p className="text-xs text-muted-foreground">
                      Size of text chunks for processing (tokens)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chunk-overlap">Chunk Overlap</Label>
                    <Input
                      id="chunk-overlap"
                      type="number"
                      min="0"
                      max="200"
                      defaultValue="50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Overlap between chunks (tokens)
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync" defaultChecked />
                    <Label htmlFor="auto-sync">Auto-sync sources</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="semantic-search" defaultChecked />
                    <Label htmlFor="semantic-search">
                      Enable semantic search
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="metadata-filtering" />
                    <Label htmlFor="metadata-filtering">
                      Metadata filtering
                    </Label>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="embedding-model">Embedding Model</Label>
                  <Select defaultValue="openai">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">
                        OpenAI text-embedding-ada-002
                      </SelectItem>
                      <SelectItem value="cohere">Cohere Embed v3</SelectItem>
                      <SelectItem value="sentence-transformers">
                        Sentence Transformers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KnowledgeBase;
