import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Note: Tooltip component not available, using alternative approach
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HelpCircle,
  Play,
  BookOpen,
  CheckCircle,
  RotateCcw,
  Settings,
  Lightbulb,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useTutorial } from "@/hooks/useTutorial";
import TutorialSystem from "./TutorialSystem";

interface TutorialTriggerProps {
  module: "workflow-builder" | "knowledge-base" | "providers";
  position?: "header" | "floating" | "inline";
  autoStart?: boolean;
  className?: string;
}

const TutorialTrigger: React.FC<TutorialTriggerProps> = ({
  module,
  position = "header",
  autoStart = true,
  className = "",
}) => {
  const {
    isOpen,
    currentModule,
    startTutorial,
    closeTutorial,
    completeTutorial,
    shouldAutoStart,
    getTutorialStatus,
    getTutorialStats,
    setTutorialEnabled,
    resetTutorialProgress,
    userPreferences,
  } = useTutorial();

  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  const tutorialStatus = getTutorialStatus(module);
  const tutorialStats = getTutorialStats();

  // Auto-start tutorial if enabled and not seen before
  useEffect(() => {
    if (autoStart && !hasAutoStarted && shouldAutoStart(module)) {
      const timer = setTimeout(() => {
        startTutorial(module);
        setHasAutoStarted(true);
      }, 1500); // Delay to let the page load

      return () => clearTimeout(timer);
    }
  }, [autoStart, hasAutoStarted, shouldAutoStart, module, startTutorial]);

  const handleStartTutorial = () => {
    startTutorial(module);
  };

  const handleResetProgress = () => {
    resetTutorialProgress();
    setHasAutoStarted(false);
  };

  const getModuleDisplayName = (moduleName: string) => {
    switch (moduleName) {
      case "workflow-builder":
        return "Workflow Builder";
      case "knowledge-base":
        return "Knowledge Base";
      case "providers":
        return "AI Providers";
      default:
        return moduleName;
    }
  };

  const getModuleDescription = (moduleName: string) => {
    switch (moduleName) {
      case "workflow-builder":
        return "Learn to create powerful AI automation workflows";
      case "knowledge-base":
        return "Discover how to manage and organize your knowledge";
      case "providers":
        return "Configure and manage AI service providers";
      default:
        return "Interactive tutorial for this module";
    }
  };

  // Floating position (bottom-right corner)
  if (position === "floating") {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-50 group ${className}`}>
          <Button
            onClick={handleStartTutorial}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white shadow-2xl hover:shadow-[#964734]/30 transition-all duration-300"
          >
            {tutorialStatus.hasCompleted ? (
              <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <HelpCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            )}
          </Button>

          {/* Hover tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white dark:bg-[#003135] border border-[#964734]/30 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
            <p className="font-medium text-[#003135] dark:text-white">
              {tutorialStatus.hasCompleted ? "Restart Tutorial" : "Start Tutorial"}
            </p>
            <p className="text-xs text-[#024950]/70 dark:text-[#AFDDE5]/70">
              {getModuleDescription(module)}
            </p>
          </div>

          {/* Progress indicator */}
          {!tutorialStatus.hasCompleted && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#964734] rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs font-bold text-white">!</span>
            </div>
          )}
        </div>

        <TutorialSystem
          isOpen={isOpen && currentModule === module}
          onClose={closeTutorial}
          onComplete={completeTutorial}
          targetComponent={module}
        />
      </>
    );
  }

  // Inline position
  if (position === "inline") {
    return (
      <>
        <div className={`inline-flex items-center space-x-2 ${className}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartTutorial}
            className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10 transition-all duration-300 group"
          >
            {tutorialStatus.hasCompleted ? (
              <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            ) : (
              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            )}
            {tutorialStatus.hasCompleted ? "Restart Tutorial" : "Start Tutorial"}
          </Button>

          {tutorialStatus.hasCompleted && (
            <Badge className="bg-[#0FA4AF]/20 text-[#0FA4AF] border-[#0FA4AF]/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        <TutorialSystem
          isOpen={isOpen && currentModule === module}
          onClose={closeTutorial}
          onComplete={completeTutorial}
          targetComponent={module}
        />
      </>
    );
  }

  // Header position (default)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10 transition-all duration-300 group ${className}`}
          >
            <HelpCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Tutorial
            {!tutorialStatus.hasCompleted && (
              <div className="w-2 h-2 bg-[#964734] rounded-full ml-2 animate-pulse" />
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-80 bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border-[#964734]/30 shadow-xl"
        >
          <DropdownMenuLabel>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#003135] dark:text-white">
                  {getModuleDisplayName(module)} Tutorial
                </p>
                <p className="text-xs text-[#024950] dark:text-[#AFDDE5] font-normal">
                  {getModuleDescription(module)}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[#964734]/20" />

          {/* Tutorial status */}
          <div className="px-2 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#003135] dark:text-white">Status</span>
              <Badge className={tutorialStatus.hasCompleted
                ? "bg-[#0FA4AF]/20 text-[#0FA4AF] border-[#0FA4AF]/30"
                : "bg-[#964734]/20 text-[#964734] border-[#964734]/30"
              }>
                {tutorialStatus.hasCompleted ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Available
                  </>
                )}
              </Badge>
            </div>

            {/* Overall progress */}
            <div className="bg-gradient-to-r from-[#964734]/10 to-[#0FA4AF]/10 p-3 rounded-lg border border-[#964734]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#003135] dark:text-white">Overall Progress</span>
                <span className="text-xs text-[#964734]">
                  {tutorialStats.completedCount}/{tutorialStats.totalCount}
                </span>
              </div>
              <div className="w-full bg-[#964734]/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#964734] to-[#0FA4AF] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tutorialStats.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-[#964734]/20" />

          {/* Actions */}
          <DropdownMenuItem
            onClick={handleStartTutorial}
            className="hover:bg-[#964734]/10 cursor-pointer"
          >
            {tutorialStatus.hasCompleted ? (
              <RotateCcw className="h-4 w-4 mr-3 text-[#964734]" />
            ) : (
              <Play className="h-4 w-4 mr-3 text-[#964734]" />
            )}
            <div>
              <p className="font-medium text-[#003135] dark:text-white">
                {tutorialStatus.hasCompleted ? "Restart Tutorial" : "Start Tutorial"}
              </p>
              <p className="text-xs text-[#024950] dark:text-[#AFDDE5]">
                {tutorialStatus.hasCompleted ? "Review the features again" : "Learn the basics in 3-5 minutes"}
              </p>
            </div>
          </DropdownMenuItem>

          {tutorialStats.completedCount > 0 && (
            <DropdownMenuItem
              onClick={handleResetProgress}
              className="hover:bg-[#964734]/10 cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-3 text-[#964734]" />
              <div>
                <p className="font-medium text-[#003135] dark:text-white">Reset Progress</p>
                <p className="text-xs text-[#024950] dark:text-[#AFDDE5]">
                  Clear all tutorial completion status
                </p>
              </div>
            </DropdownMenuItem>
          )}

          {/* Quick tips */}
          <DropdownMenuSeparator className="bg-[#964734]/20" />
          <div className="px-2 py-2">
            <div className="bg-[#0FA4AF]/10 p-2 rounded-lg border border-[#0FA4AF]/30">
              <div className="flex items-start space-x-2">
                <Zap className="h-3 w-3 text-[#0FA4AF] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#024950] dark:text-[#AFDDE5]">
                  <span className="font-medium">Tip:</span> Use keyboard shortcuts during tutorials:
                  ← → to navigate, ESC to exit, Space to pause
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <TutorialSystem
        isOpen={isOpen && currentModule === module}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        targetComponent={module}
      />
    </>
  );
};

export default TutorialTrigger;
