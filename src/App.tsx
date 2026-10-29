import React, { useState, useEffect, useCallback } from 'react';
import { 
  DecisionChoice, 
  DecisionStageId, 
  EndingData, 
  SimulationState, 
  UserProfile 
} from './types';
import { 
  evaluateSimulationOutcome, 
  getCurrentStageData, 
  getNextStageId, 
  INITIAL_SIMULATION_STATE 
} from './engine/stateMachine';
import { Header } from './components/Header';
import { OnboardingScreen } from './components/OnboardingScreen';
import { IncidentScreen } from './components/IncidentScreen';
import { ConsequenceModal } from './components/ConsequenceModal';
import { TutorDrawer } from './components/TutorDrawer';
import { EndingScreen } from './components/EndingScreen';
import { DeviceFrame } from './components/DeviceFrame';

export const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>(INITIAL_SIMULATION_STATE);
  const [ending, setEnding] = useState<EndingData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  // Timer countdown for Experienced level users
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (
      state.isSimulating &&
      !state.isCompleted &&
      !state.activeConsequence &&
      state.profile?.experience === 'experienced'
    ) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isSimulating, state.isCompleted, state.activeConsequence, state.profile?.experience]);

  // Handle timeout on Experienced mode: automatically selects Option B (hotfix/skip/raw) due to panic/urgency
  const handleTimeout = useCallback(() => {
    if (state.activeConsequence || state.isCompleted) return;

    // Automatic selection of Option B on time expiry
    const stage = getCurrentStageData(state.currentStageId);
    setState((prev) => ({
      ...prev,
      decisions: {
        ...prev.decisions,
        [prev.currentStageId]: 'B',
      },
      activeConsequence: stage.consequences.B,
    }));
  }, [state.activeConsequence, state.isCompleted, state.currentStageId]);

  // Handle starting simulation from Onboarding
  const handleStartSimulation = (profile: UserProfile) => {
    setState({
      profile,
      currentStageId: 1,
      decisions: {},
      activeConsequence: null,
      isSimulating: true,
      isCompleted: false,
      isTutorOpen: false,
    });
    setEnding(null);
    setTimeRemaining(60);
  };

  // Handle selecting an option in current decision stage
  const handleSelectOption = (choice: DecisionChoice) => {
    const currentStage = getCurrentStageData(state.currentStageId);
    const consequence = currentStage.consequences[choice];

    setState((prev) => ({
      ...prev,
      decisions: {
        ...prev.decisions,
        [prev.currentStageId]: choice,
      },
      activeConsequence: consequence,
    }));
  };

  // Handle proceeding after reviewing the consequence
  const handleProceedConsequence = () => {
    const nextStageId = getNextStageId(state.currentStageId);

    if (nextStageId) {
      // Proceed to next stage
      setState((prev) => ({
        ...prev,
        currentStageId: nextStageId,
        activeConsequence: null,
      }));
      // Reset timer for the new stage
      setTimeRemaining(60);
    } else {
      // All 3 stages completed: evaluate outcome
      const finalEnding = evaluateSimulationOutcome(state.decisions);
      setEnding(finalEnding);
      setState((prev) => ({
        ...prev,
        activeConsequence: null,
        isCompleted: true,
      }));
    }
  };

  // Handle restarting simulation
  const handleRestart = () => {
    setState(INITIAL_SIMULATION_STATE);
    setEnding(null);
    setTimeRemaining(60);
  };

  return (
    <DeviceFrame>
      <div className="flex flex-col min-h-full">
        {/* Navigation & Status Header */}
        <Header
          isSimulating={state.isSimulating && !state.isCompleted}
          currentStageId={state.currentStageId}
          profile={state.profile}
          onOpenTutor={() => setState((prev) => ({ ...prev, isTutorOpen: true }))}
          timeRemaining={state.profile?.experience === 'experienced' ? timeRemaining : undefined}
        />

        {/* Dynamic Screen View */}
        <div className="flex-1">
          {!state.isSimulating ? (
            /* SCREEN 1: Onboarding */
            <OnboardingScreen onStartSimulation={handleStartSimulation} />
          ) : !state.isCompleted ? (
            /* SCREEN 2: Incident Decision Stage */
            <IncidentScreen
              stage={getCurrentStageData(state.currentStageId)}
              profile={state.profile}
              onSelectOption={handleSelectOption}
              onOpenTutor={() => setState((prev) => ({ ...prev, isTutorOpen: true }))}
              timeRemaining={timeRemaining}
              onTimeout={handleTimeout}
            />
          ) : ending ? (
            /* SCREEN 3: Ending Screen */
            <EndingScreen
              ending={ending}
              profile={state.profile}
              decisions={state.decisions}
              onRestart={handleRestart}
            />
          ) : null}
        </div>

        {/* Technical Consequence Modal */}
        <ConsequenceModal
          consequence={state.activeConsequence}
          onProceed={handleProceedConsequence}
          isFinalStage={state.currentStageId === 3}
        />

        {/* Socratic AI Tutor Drawer / Modal */}
        <TutorDrawer
          isOpen={state.isTutorOpen}
          onClose={() => setState((prev) => ({ ...prev, isTutorOpen: false }))}
          currentStageId={state.currentStageId}
          profile={state.profile}
        />
      </div>
    </DeviceFrame>
  );
};

export default App;
