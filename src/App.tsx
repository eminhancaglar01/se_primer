import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  DecisionChoice, 
  DecisionStageId, 
  EndingData, 
  ModelPrediction, 
  SimulationState, 
  UserProfile 
} from './types';
import { 
  evaluateSimulationOutcome, 
  generateSessionId, 
  getCurrentStageData, 
  getNextStageId, 
  INITIAL_SIMULATION_STATE 
} from './engine/stateMachine';
import { createDecisionRecord, downloadCSVFile, recordsToCSV } from './services/dataCollector';
import { evaluateSceneSupportNeed, getInferenceSession } from './services/onnxInference';
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
  const [stageElapsedSec, setStageElapsedSec] = useState<number>(0);
  const stageStartTimeRef = useRef<number>(Date.now());

  // Model session initialization
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setState(prev => ({ ...prev, modelStatus: 'loading' }));
      try {
        const session = await getInferenceSession();
        if (isMounted) {
          setState(prev => ({
            ...prev,
            modelStatus: session ? 'ready' : 'fallback',
          }));
        }
      } catch {
        if (isMounted) {
          setState(prev => ({ ...prev, modelStatus: 'fallback' }));
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Timer countdown for Experienced level users & Scene elapsed time tracking
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (
      state.isSimulating &&
      !state.isCompleted &&
      !state.activeConsequence &&
      !state.isTutorOpen
    ) {
      interval = setInterval(() => {
        // Track elapsed seconds in current stage
        const elapsed = (Date.now() - stageStartTimeRef.current) / 1000;
        setStageElapsedSec(Math.round(elapsed * 10) / 10);

        // Experienced timer countdown
        if (state.profile?.experience === 'experienced') {
          setTimeRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isSimulating, state.isCompleted, state.activeConsequence, state.isTutorOpen, state.profile?.experience]);

  // Real-time ML Inference update
  useEffect(() => {
    if (!state.isSimulating || state.isCompleted || !state.profile) return;

    let isSubscribed = true;
    const runInference = async () => {
      // Calculate previous wrong decisions
      let prevWrongs = 0;
      if (state.currentStageId >= 2 && state.decisions[1] === 'B') prevWrongs++;
      if (state.currentStageId === 3 && state.decisions[2] === 'B') prevWrongs++;

      try {
        const pred = await evaluateSceneSupportNeed(
          state.profile!.experience,
          state.currentStageId,
          stageElapsedSec,
          state.currentStageSwitchCount,
          prevWrongs,
          state.totalTutorQuestionsAsked
        );
        if (isSubscribed) {
          setState(prev => ({ ...prev, currentPrediction: pred }));
        }
      } catch (err) {
        console.warn('Real-time inference error:', err);
      }
    };

    runInference();
    return () => { isSubscribed = false; };
  }, [
    state.isSimulating,
    state.isCompleted,
    state.currentStageId,
    state.currentStageSwitchCount,
    state.totalTutorQuestionsAsked,
    Math.floor(stageElapsedSec / 5), // re-evaluate every 5 seconds or on telemetry changes
    state.profile,
  ]);

  // Handle timeout on Experienced mode: automatically selects Option B (hotfix/skip/raw) due to panic/urgency
  const handleTimeout = useCallback(() => {
    if (state.activeConsequence || state.isCompleted) return;

    const stage = getCurrentStageData(state.currentStageId);
    handleSelectOption('B');
  }, [state.activeConsequence, state.isCompleted, state.currentStageId]);

  // Handle starting simulation from Onboarding
  const handleStartSimulation = (profile: UserProfile) => {
    const newSessionId = generateSessionId();
    stageStartTimeRef.current = Date.now();
    setStageElapsedSec(0);
    setTimeRemaining(60);
    setEnding(null);

    setState({
      profile,
      currentStageId: 1,
      decisions: {},
      activeConsequence: null,
      isSimulating: true,
      isCompleted: false,
      isTutorOpen: false,
      sessionId: newSessionId,
      dataCollectionMode: true,
      records: [],
      currentStageStartTime: stageStartTimeRef.current,
      currentStageSwitchCount: 0,
      totalTutorQuestionsAsked: 0,
      currentPrediction: null,
      modelStatus: state.modelStatus,
    });
  };

  // Track hesitation / card switches
  const handleCardSwitch = () => {
    setState(prev => ({
      ...prev,
      currentStageSwitchCount: prev.currentStageSwitchCount + 1,
    }));
  };

  // Track AI tutor questions asked
  const handleQuestionAsked = () => {
    setState(prev => ({
      ...prev,
      totalTutorQuestionsAsked: prev.totalTutorQuestionsAsked + 1,
    }));
  };

  // Handle selecting an option in current decision stage
  const handleSelectOption = (choice: DecisionChoice) => {
    if (!state.profile) return;
    const currentStage = getCurrentStageData(state.currentStageId);
    const consequence = currentStage.consequences[choice];

    // Compute duration
    const duration = Math.max(0.5, (Date.now() - stageStartTimeRef.current) / 1000);

    // Compute previous errors before this stage
    let prevWrongs = 0;
    if (state.currentStageId >= 2 && state.decisions[1] === 'B') prevWrongs++;
    if (state.currentStageId === 3 && state.decisions[2] === 'B') prevWrongs++;

    // Generate telemetry record
    const newRecord = createDecisionRecord(
      state.sessionId,
      state.currentStageId,
      state.profile,
      choice,
      duration,
      state.currentStageSwitchCount,
      prevWrongs,
      state.totalTutorQuestionsAsked,
      'gercek'
    );

    setState((prev) => ({
      ...prev,
      decisions: {
        ...prev.decisions,
        [prev.currentStageId]: choice,
      },
      records: [...prev.records, newRecord],
      activeConsequence: consequence,
    }));
  };

  // Handle proceeding after reviewing the consequence
  const handleProceedConsequence = () => {
    const nextStageId = getNextStageId(state.currentStageId);

    if (nextStageId) {
      // Proceed to next stage
      stageStartTimeRef.current = Date.now();
      setStageElapsedSec(0);
      setTimeRemaining(60);

      setState((prev) => ({
        ...prev,
        currentStageId: nextStageId,
        activeConsequence: null,
        currentStageStartTime: stageStartTimeRef.current,
        currentStageSwitchCount: 0,
      }));
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

  // Export session records to CSV file
  const handleExportCSV = () => {
    if (state.records.length === 0) return;
    const csvContent = recordsToCSV(state.records);
    downloadCSVFile(`se_primer_${state.sessionId}.csv`, csvContent);
  };

  // Handle restarting simulation
  const handleRestart = () => {
    stageStartTimeRef.current = Date.now();
    setStageElapsedSec(0);
    setTimeRemaining(60);
    setEnding(null);

    setState({
      ...INITIAL_SIMULATION_STATE,
      sessionId: generateSessionId(),
      modelStatus: state.modelStatus,
    });
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
          modelStatus={state.modelStatus}
          recordedCount={state.records.length}
          onExportCSV={handleExportCSV}
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
              prediction={state.currentPrediction}
              onCardSwitch={handleCardSwitch}
              durationSec={stageElapsedSec}
            />
          ) : ending ? (
            /* SCREEN 3: Ending Screen */
            <EndingScreen
              ending={ending}
              profile={state.profile}
              decisions={state.decisions}
              onRestart={handleRestart}
              records={state.records}
              onExportCSV={handleExportCSV}
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
          onQuestionAsked={handleQuestionAsked}
        />
      </div>
    </DeviceFrame>
  );
};

export default App;
