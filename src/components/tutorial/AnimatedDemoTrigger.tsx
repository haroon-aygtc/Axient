import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Video,
  Sparkles,
  Eye,
  Clock,
  Zap,
  HelpCircle,
} from "lucide-react";
import AnimatedDemo from "./AnimatedDemo";

interface AnimatedDemoTriggerProps {
  module: "workflow-builder" | "knowledge-base" | "providers";
  position?: "header" | "floating" | "inline" | "card";
  className?: string;
}

const AnimatedDemoTrigger: React.FC<AnimatedDemoTriggerProps> = ({
  module,
  position = "inline",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getModuleInfo = (moduleName: string) => {
    switch (moduleName) {
      case "workflow-builder":
        return {
          title: "Workflow Builder Demo",
          description: "Watch an interactive demo of drag & drop workflow creation",
          duration: "3-5 min",
          features: ["Drag & Drop", "Node Connections", "Live Testing", "AI Integration"]
        };
      case "knowledge-base":
        return {
          title: "Knowledge Base Demo",
          description: "Explore knowledge management and AI-powered search",
          duration: "2-4 min",
          features: ["Document Upload", "AI Search", "Smart Organization", "Insights"]
        };
      case "providers":
        return {
          title: "AI Providers Demo",
          description: "Learn how to configure and manage AI service providers",
          duration: "2-3 min",
          features: ["Provider Setup", "API Configuration", "Testing", "Monitoring"]
        };
      default:
        return {
          title: "Interactive Demo",
          description: "Watch how this feature works",
          duration: "3-5 min",
          features: ["Interactive", "Visual", "Engaging", "Educational"]
        };
    }
  };

  const moduleInfo = getModuleInfo(module);

  // Floating position (bottom-right corner)
  if (position === "floating") {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-50 group ${className}`}>
          <Button
            onClick={handleOpen}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#964734] via-[#024950] to-[#0FA4AF] hover:from-[#0FA4AF] hover:to-[#964734] text-white shadow-2xl hover:shadow-[#964734]/30 transition-all duration-500 animate-pulse hover:animate-none"
          >
            <Video className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
          </Button>

          {/* Floating tooltip */}
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-sm border border-[#964734]/30 rounded-xl p-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">{moduleInfo.title}</p>
                <p className="text-xs text-[#AFDDE5]">{moduleInfo.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-[#964734]" />
                  <span className="text-xs text-[#964734]">{moduleInfo.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pulsing indicator */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#964734] rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>

        <AnimatedDemo
          isOpen={isOpen}
          onClose={handleClose}
          module={module}
        />
      </>
    );
  }

  // Card position (featured demo card)
  if (position === "card") {
    return (
      <>
        <div className={`bg-gradient-to-br from-[#964734]/10 via-[#024950]/10 to-[#0FA4AF]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#964734]/30 hover:border-[#964734]/50 transition-all duration-500 hover:scale-105 group cursor-pointer ${className}`} onClick={handleOpen}>
          {/* Video Preview */}
          <div className="relative mb-6">
            <div className="w-full h-48 bg-gradient-to-br from-[#003135] to-[#024950] rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              {/* Animated Preview Elements */}
              <div className="relative z-10 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0FA4AF] to-[#024950] rounded-xl flex items-center justify-center animate-pulse">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="w-1 h-8 bg-gradient-to-b from-[#0FA4AF] to-[#964734] rounded-full animate-pulse"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-[#964734] to-[#024950] rounded-xl flex items-center justify-center animate-pulse">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-10 w-10 text-white ml-1" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/70 text-white border-[#964734]/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {moduleInfo.duration}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-[#003135] dark:text-white mb-2 flex items-center">
                <Video className="h-6 w-6 text-[#964734] mr-3" />
                {moduleInfo.title}
              </h3>
              <p className="text-[#024950] dark:text-[#AFDDE5]">
                {moduleInfo.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2">
              {moduleInfo.features.map((feature, index) => (
                <div key={feature} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#964734] rounded-full"></div>
                  <span className="text-sm text-[#024950] dark:text-[#AFDDE5]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              className="w-full bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Watch Interactive Demo
              <Sparkles className="h-4 w-4 ml-2 group-hover:rotate-180 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        <AnimatedDemo
          isOpen={isOpen}
          onClose={handleClose}
          module={module}
        />
      </>
    );
  }

  // Inline position
  if (position === "inline") {
    return (
      <>
        <Button
          onClick={handleOpen}
          className={`bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}
        >
          <Video className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          Watch Demo
          <Badge className="ml-2 bg-white/20 text-white border-white/30">
            {moduleInfo.duration}
          </Badge>
        </Button>

        <AnimatedDemo
          isOpen={isOpen}
          onClose={handleClose}
          module={module}
        />
      </>
    );
  }

  // Header position (default)
  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        size="sm"
        className={`border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10 transition-all duration-300 group ${className}`}
      >
        <Video className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
        Interactive Demo
        <div className="w-2 h-2 bg-[#964734] rounded-full ml-2 animate-pulse" />
      </Button>

      <AnimatedDemo
        isOpen={isOpen}
        onClose={handleClose}
        module={module}
      />
    </>
  );
};

export default AnimatedDemoTrigger;
