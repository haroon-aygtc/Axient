import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lightbulb,
  Target,
  Zap,
  ArrowDown,
  MousePointer,
  Hand,
  Eye,
  Settings,
  Workflow,
} from "lucide-react";

// Tutorial step interface
interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "drag" | "hover" | "none";
  content: React.ReactNode;
  businessValue?: string;
  nextAction?: string;
  allowInteraction?: boolean;
}

// Tutorial state interface
interface TutorialState {
  isActive: boolean;
  currentStep: number;
  isPlaying: boolean;
  isPaused: boolean;
  hasCompleted: boolean;
  userProgress: number[];
}

// Props interface
interface TutorialSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  targetComponent: "workflow-builder" | "knowledge-base" | "providers";
}

const TutorialSystem: React.FC<TutorialSystemProps> = ({
  isOpen,
  onClose,
  onComplete,
  targetComponent,
}) => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isActive: false,
    currentStep: 0,
    isPlaying: false,
    isPaused: false,
    hasCompleted: false,
    userProgress: [],
  });

  const [showWelcome, setShowWelcome] = useState(true);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Workflow Builder Tutorial Steps
  const workflowBuilderSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to Workflow Builder",
      description: "Let's explore how to create powerful AI automation workflows",
      target: ".workflow-canvas",
      position: "center",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-full flex items-center justify-center mx-auto">
            <Workflow className="h-8 w-8 text-white" />
          </div>
          <p className="text-[#024950] dark:text-[#AFDDE5]">
            In the next few minutes, you'll learn how to build sophisticated automation workflows
            that can handle complex business processes with AI intelligence.
          </p>
        </div>
      ),
      businessValue: "Automate repetitive tasks and scale your operations efficiently",
    },
    {
      id: "node-palette",
      title: "Node Palette Overview",
      description: "Discover the building blocks of your workflows",
      target: ".node-palette",
      position: "right",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#0FA4AF] rounded-full"></div>
            <span className="text-sm font-medium">Triggers</span>
            <span className="text-xs text-[#024950]/70">Start workflows</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#024950] rounded-full"></div>
            <span className="text-sm font-medium">Actions</span>
            <span className="text-xs text-[#024950]/70">Perform tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#964734] rounded-full"></div>
            <span className="text-sm font-medium">Logic</span>
            <span className="text-xs text-[#024950]/70">Control flow</span>
          </div>
        </div>
      ),
      businessValue: "Each node type serves a specific purpose in your automation pipeline",
    },
    {
      id: "drag-drop-demo",
      title: "Drag & Drop Magic",
      description: "Watch how easy it is to add nodes to your workflow",
      target: ".draggable-node:first-child",
      position: "right",
      action: "drag",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Hand className="h-4 w-4 text-[#964734]" />
            <span className="text-sm">Try dragging this node to the canvas</span>
          </div>
          <p className="text-xs text-[#024950]/70">
            Simply click and drag any node from the palette to the canvas to add it to your workflow.
          </p>
        </div>
      ),
      allowInteraction: true,
      nextAction: "Drag the highlighted node to the canvas",
    },
    {
      id: "node-connections",
      title: "Connecting Nodes",
      description: "Create workflow logic by connecting nodes together",
      target: ".react-flow__node:first-child",
      position: "top",
      action: "click",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ArrowDown className="h-4 w-4 text-[#964734]" />
            <span className="text-sm">Connect nodes to define execution order</span>
          </div>
          <p className="text-xs text-[#024950]/70">
            Drag from the output handle of one node to the input handle of another to create connections.
          </p>
        </div>
      ),
      businessValue: "Connections define the logical flow and sequence of your automation",
    },
    {
      id: "node-configuration",
      title: "Node Configuration",
      description: "Customize node behavior with detailed settings",
      target: ".react-flow__node",
      position: "left",
      action: "click",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-[#964734]" />
            <span className="text-sm">Double-click to configure nodes</span>
          </div>
          <p className="text-xs text-[#024950]/70">
            Each node can be customized with specific parameters, API endpoints, conditions, and more.
          </p>
        </div>
      ),
      businessValue: "Fine-tune each step to match your exact business requirements",
    },
    {
      id: "canvas-controls",
      title: "Canvas Navigation",
      description: "Master the canvas controls for better workflow management",
      target: ".react-flow__controls",
      position: "left",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-[#964734]" />
            <span className="text-sm">Zoom, pan, and navigate your workflow</span>
          </div>
          <p className="text-xs text-[#024950]/70">
            Use the controls to zoom in/out, fit the view, and navigate large workflows efficiently.
          </p>
        </div>
      ),
    },
    {
      id: "properties-panel",
      title: "Properties Panel",
      description: "Monitor and manage your workflow settings",
      target: ".properties-panel",
      position: "left",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-[#964734]" />
            <span className="text-sm">Real-time workflow statistics and settings</span>
          </div>
          <p className="text-xs text-[#024950]/70">
            View node count, connections, and configure workflow-level settings like name and activation status.
          </p>
        </div>
      ),
    },
    {
      id: "workflow-management",
      title: "Workflow Management",
      description: "Save, test, and activate your workflows",
      target: ".workflow-header",
      position: "bottom",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-[#964734]" />
            <span className="text-sm">Deploy your automation to production</span>
          </div>
          <p className="text-xs text-[#024950]/70">
            Test your workflow logic, save drafts, and activate workflows to start automating your processes.
          </p>
        </div>
      ),
      businessValue: "Turn your workflow designs into live automation that works 24/7",
    },
  ];

  const currentSteps = workflowBuilderSteps;

  // Calculate progress percentage
  const progressPercentage = (tutorialState.currentStep / (currentSteps.length - 1)) * 100;

  // Highlight target element
  const highlightElement = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      setHighlightedElement(element);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Start tutorial
  const startTutorial = useCallback(() => {
    setShowWelcome(false);
    setTutorialState(prev => ({
      ...prev,
      isActive: true,
      isPlaying: true,
      currentStep: 0,
    }));
    highlightElement(currentSteps[0].target);
  }, [currentSteps, highlightElement]);

  // Next step
  const nextStep = useCallback(() => {
    const nextStepIndex = tutorialState.currentStep + 1;
    if (nextStepIndex < currentSteps.length) {
      setTutorialState(prev => ({
        ...prev,
        currentStep: nextStepIndex,
        userProgress: [...prev.userProgress, prev.currentStep],
      }));
      highlightElement(currentSteps[nextStepIndex].target);
    } else {
      // Tutorial completed
      setTutorialState(prev => ({
        ...prev,
        hasCompleted: true,
        isPlaying: false,
      }));
      onComplete();
    }
  }, [tutorialState.currentStep, currentSteps, highlightElement, onComplete]);

  // Previous step
  const previousStep = useCallback(() => {
    const prevStepIndex = tutorialState.currentStep - 1;
    if (prevStepIndex >= 0) {
      setTutorialState(prev => ({
        ...prev,
        currentStep: prevStepIndex,
      }));
      highlightElement(currentSteps[prevStepIndex].target);
    }
  }, [tutorialState.currentStep, currentSteps, highlightElement]);

  // Pause/Resume tutorial
  const togglePause = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // Skip tutorial
  const skipTutorial = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isActive: false,
      isPlaying: false,
    }));
    setHighlightedElement(null);
    onClose();
  }, [onClose]);

  // Restart tutorial
  const restartTutorial = useCallback(() => {
    setTutorialState({
      isActive: true,
      currentStep: 0,
      isPlaying: true,
      isPaused: false,
      hasCompleted: false,
      userProgress: [],
    });
    setShowWelcome(false);
    highlightElement(currentSteps[0].target);
  }, [currentSteps, highlightElement]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!tutorialState.isActive) return;

      switch (event.key) {
        case "ArrowRight":
        case "Enter":
          event.preventDefault();
          nextStep();
          break;
        case "ArrowLeft":
          event.preventDefault();
          previousStep();
          break;
        case "Escape":
          event.preventDefault();
          skipTutorial();
          break;
        case " ":
          event.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [tutorialState.isActive, nextStep, previousStep, skipTutorial, togglePause]);

  const currentStep = currentSteps[tutorialState.currentStep];

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={isOpen && showWelcome} onOpenChange={() => { }}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#003135] border-[#964734]/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#003135] dark:text-white flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-lg flex items-center justify-center mr-3">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              Interactive Tutorial
            </DialogTitle>
            <DialogDescription className="text-[#024950] dark:text-[#AFDDE5] text-lg">
              Learn to build powerful AI workflows in just a few minutes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Hand, title: "Interactive", desc: "Hands-on learning" },
                { icon: Zap, title: "Quick", desc: "3-5 minutes" },
                { icon: Target, title: "Practical", desc: "Real-world skills" },
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-r from-[#964734]/10 to-[#0FA4AF]/10 rounded-lg border border-[#964734]/20">
                  <feature.icon className="h-8 w-8 text-[#964734] mx-auto mb-2" />
                  <h3 className="font-semibold text-[#003135] dark:text-white">{feature.title}</h3>
                  <p className="text-xs text-[#024950] dark:text-[#AFDDE5]">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#0FA4AF]/10 to-[#964734]/10 p-4 rounded-lg border border-[#0FA4AF]/30">
              <h4 className="font-semibold text-[#003135] dark:text-white mb-2">What you'll learn:</h4>
              <ul className="space-y-1 text-sm text-[#024950] dark:text-[#AFDDE5]">
                <li>• Drag & drop workflow creation</li>
                <li>• Node configuration and connections</li>
                <li>• Canvas navigation and controls</li>
                <li>• Workflow testing and deployment</li>
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
              >
                Skip Tutorial
              </Button>
              <Button
                onClick={startTutorial}
                className="bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white px-8"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Tutorial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tutorial Overlay */}
      {tutorialState.isActive && (
        <>
          {/* Dark overlay */}
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] pointer-events-none"
            style={{
              clipPath: highlightedElement
                ? `polygon(0% 0%, 0% 100%, ${highlightedElement.getBoundingClientRect().left - 8
                }px 100%, ${highlightedElement.getBoundingClientRect().left - 8
                }px ${highlightedElement.getBoundingClientRect().top - 8
                }px, ${highlightedElement.getBoundingClientRect().right + 8
                }px ${highlightedElement.getBoundingClientRect().top - 8
                }px, ${highlightedElement.getBoundingClientRect().right + 8
                }px ${highlightedElement.getBoundingClientRect().bottom + 8
                }px, ${highlightedElement.getBoundingClientRect().left - 8
                }px ${highlightedElement.getBoundingClientRect().bottom + 8
                }px, ${highlightedElement.getBoundingClientRect().left - 8
                }px 100%, 100% 100%, 100% 0%)`
                : "none",
            }}
          />

          {/* Highlight border */}
          {highlightedElement && (
            <div
              className="fixed z-[9999] pointer-events-none border-2 border-[#964734] rounded-lg shadow-lg"
              style={{
                top: highlightedElement.getBoundingClientRect().top - 4,
                left: highlightedElement.getBoundingClientRect().left - 4,
                width: highlightedElement.getBoundingClientRect().width + 8,
                height: highlightedElement.getBoundingClientRect().height + 8,
                boxShadow: "0 0 0 4px rgba(150, 71, 52, 0.2), 0 0 20px rgba(150, 71, 52, 0.3)",
              }}
            >
              {/* Pulsing animation */}
              <div className="absolute inset-0 border-2 border-[#964734] rounded-lg animate-pulse opacity-50" />
            </div>
          )}

          {/* Tutorial Tooltip */}
          {currentStep && (
            <div
              ref={tooltipRef}
              className="fixed z-[10000] max-w-sm bg-white/95 dark:bg-[#003135]/95 backdrop-blur-sm border border-[#964734]/30 rounded-xl shadow-2xl p-6"
              style={{
                top: highlightedElement
                  ? currentStep.position === "top"
                    ? highlightedElement.getBoundingClientRect().top - 280
                    : currentStep.position === "bottom"
                      ? highlightedElement.getBoundingClientRect().bottom + 20
                      : currentStep.position === "left"
                        ? highlightedElement.getBoundingClientRect().top
                        : currentStep.position === "right"
                          ? highlightedElement.getBoundingClientRect().top
                          : "50%"
                  : "50%",
                left: highlightedElement
                  ? currentStep.position === "left"
                    ? highlightedElement.getBoundingClientRect().left - 400
                    : currentStep.position === "right"
                      ? highlightedElement.getBoundingClientRect().right + 20
                      : currentStep.position === "center"
                        ? "50%"
                        : highlightedElement.getBoundingClientRect().left
                  : "50%",
                transform: currentStep.position === "center" ? "translate(-50%, -50%)" : "none",
              }}
            >
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-[#964734]/20 text-[#964734] border-[#964734]/30">
                  Step {tutorialState.currentStep + 1} of {currentSteps.length}
                </Badge>
                <div className="flex items-center space-x-1">
                  {currentSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index <= tutorialState.currentStep
                        ? "bg-[#964734]"
                        : "bg-[#964734]/20"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#003135] dark:text-white mb-2">
                    {currentStep.title}
                  </h3>
                  <p className="text-sm text-[#024950] dark:text-[#AFDDE5] mb-3">
                    {currentStep.description}
                  </p>
                </div>

                {/* Custom content */}
                <div className="bg-gradient-to-r from-[#964734]/5 to-[#0FA4AF]/5 p-4 rounded-lg border border-[#964734]/20">
                  {currentStep.content}
                </div>

                {/* Business value */}
                {currentStep.businessValue && (
                  <div className="bg-[#0FA4AF]/10 p-3 rounded-lg border border-[#0FA4AF]/30">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 text-[#0FA4AF] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#024950] dark:text-[#AFDDE5]">
                        <span className="font-medium">Business Value:</span> {currentStep.businessValue}
                      </p>
                    </div>
                  </div>
                )}

                {/* Next action hint */}
                {currentStep.nextAction && (
                  <div className="bg-[#964734]/10 p-3 rounded-lg border border-[#964734]/30">
                    <div className="flex items-start space-x-2">
                      <MousePointer className="h-4 w-4 text-[#964734] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#964734] font-medium">
                        {currentStep.nextAction}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#964734]/20">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousStep}
                    disabled={tutorialState.currentStep === 0}
                    className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                    className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
                  >
                    {tutorialState.isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={skipTutorial}
                    className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white"
                  >
                    {tutorialState.currentStep === currentSteps.length - 1 ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-[#964734]/20"
                />
                <p className="text-xs text-[#024950]/70 dark:text-[#AFDDE5]/70 mt-1 text-center">
                  {Math.round(progressPercentage)}% Complete
                </p>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="mt-4 pt-3 border-t border-[#964734]/10">
                <p className="text-xs text-[#024950]/50 dark:text-[#AFDDE5]/50 text-center">
                  Use ← → arrow keys to navigate • ESC to exit • Space to pause
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Completion Dialog */}
      <Dialog open={tutorialState.hasCompleted} onOpenChange={() => { }}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#003135] border-[#964734]/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#003135] dark:text-white flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#964734] to-[#0FA4AF] rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              Tutorial Completed!
            </DialogTitle>
            <DialogDescription className="text-[#024950] dark:text-[#AFDDE5]">
              Congratulations! You've mastered the workflow builder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-r from-[#0FA4AF]/10 to-[#964734]/10 p-4 rounded-lg border border-[#0FA4AF]/30">
              <h4 className="font-semibold text-[#003135] dark:text-white mb-2">You've learned:</h4>
              <ul className="space-y-1 text-sm text-[#024950] dark:text-[#AFDDE5]">
                <li>✓ Node palette and categories</li>
                <li>✓ Drag & drop functionality</li>
                <li>✓ Node connections and configuration</li>
                <li>✓ Canvas controls and navigation</li>
                <li>✓ Workflow management and deployment</li>
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={restartTutorial}
                className="border-[#964734]/30 text-[#964734] hover:bg-[#964734]/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Tutorial
              </Button>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-[#964734] to-[#024950] hover:from-[#024950] hover:to-[#0FA4AF] text-white"
              >
                Start Building
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TutorialSystem;
