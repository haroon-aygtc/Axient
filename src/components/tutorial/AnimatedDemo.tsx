import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  X,
  Volume2,
  Maximize,
  CheckCircle,
  Sparkles,
  Zap,
  Bot,
  ArrowRight,
  MousePointer,
  Hand,
  Eye,
  Settings,
  Workflow,
  Brain,
  Database,
  Globe,
  MessageSquare,
} from "lucide-react";

interface AnimatedDemoProps {
  isOpen: boolean;
  onClose: () => void;
  module: "workflow-builder" | "knowledge-base" | "providers";
}

const AnimatedDemo: React.FC<AnimatedDemoProps> = ({ isOpen, onClose, module }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Demo scenes for workflow builder
  const demoScenes = [
    {
      id: "intro",
      title: "Welcome to Axient Workflow Builder",
      subtitle: "Create powerful AI automation in minutes",
      duration: 4000,
      type: "intro",
      content: {
        headline: "🚀 Build AI Workflows Visually",
        description: "Drag, drop, and connect nodes to create sophisticated automation workflows",
        features: ["No-Code Interface", "AI-Powered", "Enterprise Ready", "Real-time Testing"]
      }
    },
    {
      id: "palette",
      title: "Node Palette Overview",
      subtitle: "Your workflow building blocks",
      duration: 6000,
      type: "animated-ui",
      content: {
        nodes: [
          { type: "trigger", icon: Zap, label: "Webhook Trigger", color: "#0FA4AF", description: "Start workflows automatically" },
          { type: "action", icon: Bot, label: "AI Chat", color: "#024950", description: "Process with AI intelligence" },
          { type: "logic", icon: Settings, label: "Condition", color: "#964734", description: "Control workflow flow" }
        ]
      }
    },
    {
      id: "drag-drop",
      title: "Drag & Drop Magic",
      subtitle: "Watch nodes come to life",
      duration: 8000,
      type: "interactive-demo",
      content: {
        action: "drag-drop",
        steps: [
          "Select a trigger node",
          "Drag it to the canvas",
          "Watch it animate into place",
          "Add more nodes to build your workflow"
        ]
      }
    },
    {
      id: "connections",
      title: "Smart Connections",
      subtitle: "Link nodes to create logic",
      duration: 7000,
      type: "interactive-demo",
      content: {
        action: "connect",
        steps: [
          "Hover over node output",
          "Drag to create connection",
          "Smart snapping guides you",
          "Workflow logic is created"
        ]
      }
    },
    {
      id: "configuration",
      title: "Node Configuration",
      subtitle: "Customize every detail",
      duration: 6000,
      type: "modal-demo",
      content: {
        action: "configure",
        features: ["API Settings", "Conditions", "Data Mapping", "Error Handling"]
      }
    },
    {
      id: "testing",
      title: "Live Testing",
      subtitle: "See your workflow in action",
      duration: 5000,
      type: "execution-demo",
      content: {
        action: "test",
        steps: ["Click Test", "Watch execution", "See real results", "Deploy when ready"]
      }
    },
    {
      id: "completion",
      title: "You're Ready to Build!",
      subtitle: "Start creating your own workflows",
      duration: 4000,
      type: "completion",
      content: {
        achievements: ["✅ Learned drag & drop", "✅ Mastered connections", "✅ Configured nodes", "✅ Tested workflows"],
        cta: "Start Building Now"
      }
    }
  ];

  const totalDuration = demoScenes.reduce((sum, scene) => sum + scene.duration, 0);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentScene < demoScenes.length) {
      const scene = demoScenes[currentScene];
      const stepDuration = scene.duration / 100;

      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / scene.duration) * stepDuration;

          // Update animation phase based on progress
          const phase = Math.floor((newProgress / 100) * 4);
          setAnimationPhase(phase);

          if (newProgress >= 100) {
            // Move to next scene
            if (currentScene < demoScenes.length - 1) {
              setCurrentScene(currentScene + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return newProgress;
        });
      }, stepDuration);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentScene, demoScenes]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentScene < demoScenes.length - 1) {
      setCurrentScene(currentScene + 1);
      setProgress(0);
      setAnimationPhase(0);
    }
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setProgress(0);
    setAnimationPhase(0);
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentScene(0);
    setProgress(0);
    setAnimationPhase(0);
    onClose();
  };

  const currentSceneData = demoScenes[currentScene];
  const overallProgress = ((currentScene * 100 + progress) / (demoScenes.length * 100)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-black border-[#964734]/30 p-0 overflow-hidden">
        {/* Video-like Header */}
        <div className="relative bg-gradient-to-r from-[#964734] via-[#024950] to-[#0FA4AF] p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Interactive Demo</h2>
                <p className="text-sm text-white/80">Axient Workflow Builder</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <Eye className="h-3 w-3 mr-1" />
                Live Demo
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Demo Area */}
        <div className="flex-1 relative bg-gradient-to-br from-[#003135] to-[#024950] overflow-hidden">
          {/* Scene Content */}
          <div ref={canvasRef} className="h-full flex items-center justify-center p-8">
            {renderScene(currentSceneData, animationPhase)}
          </div>

          {/* Floating Scene Info */}
          <div className="absolute top-6 left-6 right-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#964734]/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{currentSceneData?.title}</h3>
                <Badge className="bg-[#964734]/20 text-[#964734] border-[#964734]/30">
                  {currentScene + 1} / {demoScenes.length}
                </Badge>
              </div>
              <p className="text-[#AFDDE5] text-sm">{currentSceneData?.subtitle}</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-20 left-6 right-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#964734]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Overall Progress</span>
                <span className="text-sm text-[#964734] font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Video-like Controls */}
        <div className="bg-black/90 backdrop-blur-sm p-4 border-t border-[#964734]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlay}
                size="sm"
                className="bg-[#964734] hover:bg-[#964734]/80 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleNext}
                size="sm"
                variant="outline"
                className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
                disabled={currentScene >= demoScenes.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleRestart}
                size="sm"
                variant="outline"
                className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Volume2 className="h-4 w-4" />
                <span>Interactive Demo</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scene Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/50">Scene Progress</span>
              <span className="text-xs text-[#964734]">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1 bg-white/10" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  function renderScene(scene: any, phase: number) {
    if (!scene) return null;

    switch (scene.type) {
      case "intro":
        return renderIntroScene(scene, phase);
      case "animated-ui":
        return renderAnimatedUIScene(scene, phase);
      case "interactive-demo":
        return renderInteractiveDemoScene(scene, phase);
      case "modal-demo":
        return renderModalDemoScene(scene, phase);
      case "execution-demo":
        return renderExecutionDemoScene(scene, phase);
      case "completion":
        return renderCompletionScene(scene, phase);
      default:
        return <div className="text-white">Scene not implemented</div>;
    }
  }

  function renderIntroScene(scene: any, phase: number) {
    return (
      <div className="text-center max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-3xl mb-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-3xl animate-pulse opacity-75"></div>
            <Workflow className="h-16 w-16 text-white relative z-10" />
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#964734] rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white animate-spin" />
            </div>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-[#AFDDE5] to-[#964734] bg-clip-text text-transparent">
            {scene.content.headline}
          </h1>
          <p className="text-2xl text-[#AFDDE5] mb-12 leading-relaxed">
            {scene.content.description}
          </p>
        </div>

        <div className={`transition-all duration-1000 delay-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {scene.content.features.map((feature: string, index: number) => (
              <div
                key={feature}
                className={`p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-[#964734]/30 transition-all duration-500 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CheckCircle className="h-8 w-8 text-[#0FA4AF] mx-auto mb-3" />
                <p className="text-white font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderAnimatedUIScene(scene: any, phase: number) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Node Palette Simulation */}
          <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#964734]/30">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-[#964734] rounded-lg mr-3"></div>
                Node Palette
              </h3>
              <div className="space-y-4">
                {scene.content.nodes.map((node: any, index: number) => (
                  <div
                    key={node.label}
                    className={`p-4 bg-white/5 rounded-lg border border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    style={{
                      transitionDelay: `${index * 300}ms`,
                      borderColor: phase >= 2 ? node.color : 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${node.color}20` }}
                      >
                        <node.icon className="h-5 w-5" style={{ color: node.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{node.label}</h4>
                        <p className="text-xs text-white/60">{node.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Simulation */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-500 ${phase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-gradient-to-br from-[#003135]/50 to-[#024950]/50 backdrop-blur-sm rounded-xl p-8 border border-[#0FA4AF]/30 h-96 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

              {/* Animated Nodes */}
              {phase >= 3 && (
                <>
                  <div className="absolute top-16 left-16 animate-bounce">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0FA4AF] to-[#024950] rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-white font-medium">Webhook</p>
                    </div>
                  </div>

                  <div className="absolute top-16 right-16 animate-pulse">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#964734] to-[#024950] rounded-xl flex items-center justify-center shadow-lg">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-white font-medium">AI Chat</p>
                    </div>
                  </div>

                  {/* Animated Connection */}
                  {phase >= 4 && (
                    <div className="absolute top-24 left-32 right-32">
                      <div className="h-0.5 bg-gradient-to-r from-[#0FA4AF] to-[#964734] animate-pulse">
                        <div className="w-3 h-3 bg-[#964734] rounded-full absolute -right-1.5 -top-1.5 animate-ping"></div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 rounded-lg p-3">
                  <p className="text-white text-sm">✨ Drag nodes from the palette to build your workflow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderInteractiveDemoScene(scene: any, phase: number) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative">
            {/* Simulated Mouse Cursor */}
            <div className={`absolute transition-all duration-2000 ${phase >= 2 ? 'translate-x-32 translate-y-16' : 'translate-x-0 translate-y-0'}`}>
              <MousePointer className="h-8 w-8 text-[#964734] animate-pulse" />
            </div>

            {/* Demo Canvas */}
            <div className="bg-gradient-to-br from-[#003135]/50 to-[#024950]/50 backdrop-blur-sm rounded-xl p-12 border border-[#0FA4AF]/30 relative">
              <div className="grid grid-cols-3 gap-8 h-64">
                {/* Source Node */}
                <div className={`flex items-center justify-center transition-all duration-1000 ${phase >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-[#0FA4AF] to-[#024950] rounded-xl flex items-center justify-center shadow-xl">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Connection Animation */}
                <div className="flex items-center justify-center">
                  {phase >= 3 && (
                    <div className="w-full h-1 bg-gradient-to-r from-[#0FA4AF] to-[#964734] rounded-full animate-pulse">
                      <div className="w-4 h-4 bg-[#964734] rounded-full absolute animate-ping"></div>
                    </div>
                  )}
                </div>

                {/* Target Node */}
                <div className={`flex items-center justify-center transition-all duration-1000 delay-1000 ${phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-[#964734] to-[#024950] rounded-xl flex items-center justify-center shadow-xl">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Step Instructions */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                  {scene.content.steps.map((step: string, index: number) => (
                    <div
                      key={step}
                      className={`flex items-center space-x-3 transition-all duration-500 ${phase > index ? 'opacity-100 text-white' : 'opacity-50 text-white/50'
                        }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${phase > index ? 'bg-[#964734]' : 'bg-white/30'}`}></div>
                      <p className="text-sm">{step}</p>
                      {phase > index && <CheckCircle className="h-4 w-4 text-[#0FA4AF]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderModalDemoScene(scene: any, phase: number) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Simulated Node */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <div className="w-24 h-24 bg-gradient-to-r from-[#964734] to-[#024950] rounded-xl flex items-center justify-center shadow-xl">
                <Settings className="h-12 w-12 text-white" />
              </div>
              {phase >= 2 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#0FA4AF] rounded-full flex items-center justify-center animate-ping">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              )}
            </div>
            <p className="text-white mt-4 text-lg">Double-click to configure</p>
          </div>

          {/* Simulated Configuration Modal */}
          {phase >= 3 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-[#964734]/30 animate-in slide-in-from-bottom duration-1000">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Node Configuration</h3>
                <div className="w-6 h-6 bg-[#964734]/30 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {scene.content.features.map((feature: string, index: number) => (
                  <div
                    key={feature}
                    className={`p-4 bg-white/5 rounded-lg border border-white/20 transition-all duration-500 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#964734]/30 rounded-lg flex items-center justify-center">
                        <Settings className="h-4 w-4 text-[#964734]" />
                      </div>
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <div className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm">Cancel</div>
                <div className="px-4 py-2 bg-gradient-to-r from-[#964734] to-[#024950] rounded-lg text-white text-sm">Save Configuration</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderExecutionDemoScene(scene: any, phase: number) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          {/* Workflow Execution Visualization */}
          <div className="bg-gradient-to-br from-[#003135]/50 to-[#024950]/50 backdrop-blur-sm rounded-xl p-8 border border-[#0FA4AF]/30">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Workflow Execution</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#0FA4AF] rounded-full animate-pulse"></div>
                <span className="text-[#0FA4AF] text-sm">Running</span>
              </div>
            </div>

            {/* Execution Flow */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { icon: Zap, label: "Trigger", status: phase >= 2 ? "completed" : "pending" },
                { icon: Bot, label: "AI Process", status: phase >= 3 ? "completed" : phase >= 2 ? "running" : "pending" },
                { icon: Database, label: "Save Data", status: phase >= 4 ? "completed" : phase >= 3 ? "running" : "pending" },
                { icon: MessageSquare, label: "Notify", status: phase >= 4 ? "running" : "pending" }
              ].map((step, index) => (
                <div key={step.label} className="text-center">
                  <div className={`relative w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-1000 ${step.status === "completed" ? "bg-gradient-to-r from-[#0FA4AF] to-[#024950]" :
                    step.status === "running" ? "bg-gradient-to-r from-[#964734] to-[#024950] animate-pulse" :
                      "bg-white/10"
                    }`}>
                    <step.icon className={`h-8 w-8 ${step.status === "pending" ? "text-white/50" : "text-white"
                      }`} />
                    {step.status === "completed" && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0FA4AF] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {step.status === "running" && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#964734] rounded-full animate-spin">
                        <div className="w-2 h-2 bg-white rounded-full m-1.5"></div>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${step.status === "pending" ? "text-white/50" : "text-white"
                    }`}>{step.label}</p>
                  <p className={`text-xs mt-1 ${step.status === "completed" ? "text-[#0FA4AF]" :
                    step.status === "running" ? "text-[#964734]" :
                      "text-white/30"
                    }`}>
                    {step.status === "completed" ? "✓ Done" :
                      step.status === "running" ? "⚡ Running" :
                        "⏳ Waiting"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderCompletionScene(scene: any, phase: number) {
    return (
      <div className="text-center max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Success Animation */}
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0FA4AF] to-[#964734] rounded-full animate-pulse"></div>
            <div className="relative w-28 h-28 bg-gradient-to-r from-[#0FA4AF] to-[#964734] rounded-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#964734] rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl font-bold text-white mb-6">
              🎉 Congratulations!
            </h1>
            <p className="text-xl text-[#AFDDE5] mb-8">
              You've mastered the Axient Workflow Builder
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {scene.content.achievements.map((achievement: string, index: number) => (
                <div
                  key={achievement}
                  className={`p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-[#0FA4AF]/30 transition-all duration-500 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <p className="text-white font-medium">{achievement}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white px-8 py-4 text-lg"
              >
                <Workflow className="h-5 w-5 mr-2" />
                {scene.content.cta}
              </Button>
              <p className="text-sm text-white/60">
                Ready to create your first automation workflow?
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AnimatedDemo;
