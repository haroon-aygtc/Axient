import { useState, useEffect, useCallback } from "react";

// Tutorial preferences interface
interface TutorialPreferences {
  hasSeenWorkflowTutorial: boolean;
  hasSeenKnowledgeTutorial: boolean;
  hasSeenProvidersTutorial: boolean;
  tutorialEnabled: boolean;
  autoStartTutorials: boolean;
  lastTutorialDate?: string;
}

// Tutorial state interface
interface TutorialState {
  isOpen: boolean;
  currentModule: "workflow-builder" | "knowledge-base" | "providers" | null;
  hasCompleted: boolean;
  userPreferences: TutorialPreferences;
}

// Local storage key
const TUTORIAL_STORAGE_KEY = "axient-tutorial-preferences";

// Default preferences
const defaultPreferences: TutorialPreferences = {
  hasSeenWorkflowTutorial: false,
  hasSeenKnowledgeTutorial: false,
  hasSeenProvidersTutorial: false,
  tutorialEnabled: true,
  autoStartTutorials: true,
};

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isOpen: false,
    currentModule: null,
    hasCompleted: false,
    userPreferences: defaultPreferences,
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences) as TutorialPreferences;
        setTutorialState(prev => ({
          ...prev,
          userPreferences: { ...defaultPreferences, ...preferences },
        }));
      } catch (error) {
        console.warn("Failed to parse tutorial preferences:", error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((preferences: Partial<TutorialPreferences>) => {
    const updatedPreferences = { ...tutorialState.userPreferences, ...preferences };
    setTutorialState(prev => ({
      ...prev,
      userPreferences: updatedPreferences,
    }));
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(updatedPreferences));
  }, [tutorialState.userPreferences]);

  // Start tutorial for a specific module
  const startTutorial = useCallback((module: "workflow-builder" | "knowledge-base" | "providers") => {
    if (!tutorialState.userPreferences.tutorialEnabled) {
      return;
    }

    setTutorialState(prev => ({
      ...prev,
      isOpen: true,
      currentModule: module,
      hasCompleted: false,
    }));
  }, [tutorialState.userPreferences.tutorialEnabled]);

  // Close tutorial
  const closeTutorial = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isOpen: false,
      currentModule: null,
    }));
  }, []);

  // Complete tutorial
  const completeTutorial = useCallback(() => {
    const module = tutorialState.currentModule;
    if (!module) return;

    // Mark tutorial as completed for this module
    const completionKey = `hasSeen${module.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}Tutorial` as keyof TutorialPreferences;

    savePreferences({
      [completionKey]: true,
      lastTutorialDate: new Date().toISOString(),
    });

    setTutorialState(prev => ({
      ...prev,
      hasCompleted: true,
    }));

    // Auto-close after a short delay
    setTimeout(() => {
      closeTutorial();
    }, 2000);
  }, [tutorialState.currentModule, savePreferences, closeTutorial]);

  // Check if tutorial should auto-start for a module
  const shouldAutoStart = useCallback((module: "workflow-builder" | "knowledge-base" | "providers") => {
    if (!tutorialState.userPreferences.tutorialEnabled || !tutorialState.userPreferences.autoStartTutorials) {
      return false;
    }

    const completionKey = `hasSeen${module.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}Tutorial` as keyof TutorialPreferences;

    return !tutorialState.userPreferences[completionKey];
  }, [tutorialState.userPreferences]);

  // Enable/disable tutorials
  const setTutorialEnabled = useCallback((enabled: boolean) => {
    savePreferences({ tutorialEnabled: enabled });
  }, [savePreferences]);

  // Enable/disable auto-start
  const setAutoStartEnabled = useCallback((enabled: boolean) => {
    savePreferences({ autoStartTutorials: enabled });
  }, [savePreferences]);

  // Reset all tutorial progress
  const resetTutorialProgress = useCallback(() => {
    const resetPreferences: TutorialPreferences = {
      ...defaultPreferences,
      tutorialEnabled: tutorialState.userPreferences.tutorialEnabled,
      autoStartTutorials: tutorialState.userPreferences.autoStartTutorials,
    };
    
    setTutorialState(prev => ({
      ...prev,
      userPreferences: resetPreferences,
    }));
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(resetPreferences));
  }, [tutorialState.userPreferences.tutorialEnabled, tutorialState.userPreferences.autoStartTutorials]);

  // Get tutorial completion status for a module
  const getTutorialStatus = useCallback((module: "workflow-builder" | "knowledge-base" | "providers") => {
    const completionKey = `hasSeen${module.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}Tutorial` as keyof TutorialPreferences;

    return {
      hasCompleted: tutorialState.userPreferences[completionKey] as boolean,
      canAutoStart: shouldAutoStart(module),
    };
  }, [tutorialState.userPreferences, shouldAutoStart]);

  // Get overall tutorial statistics
  const getTutorialStats = useCallback(() => {
    const { hasSeenWorkflowTutorial, hasSeenKnowledgeTutorial, hasSeenProvidersTutorial } = tutorialState.userPreferences;
    const completedCount = [hasSeenWorkflowTutorial, hasSeenKnowledgeTutorial, hasSeenProvidersTutorial].filter(Boolean).length;
    const totalCount = 3;
    const completionPercentage = (completedCount / totalCount) * 100;

    return {
      completedCount,
      totalCount,
      completionPercentage,
      isFullyCompleted: completedCount === totalCount,
    };
  }, [tutorialState.userPreferences]);

  return {
    // State
    isOpen: tutorialState.isOpen,
    currentModule: tutorialState.currentModule,
    hasCompleted: tutorialState.hasCompleted,
    userPreferences: tutorialState.userPreferences,

    // Actions
    startTutorial,
    closeTutorial,
    completeTutorial,
    setTutorialEnabled,
    setAutoStartEnabled,
    resetTutorialProgress,

    // Utilities
    shouldAutoStart,
    getTutorialStatus,
    getTutorialStats,
  };
};

export default useTutorial;
