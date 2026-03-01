import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initData } from './utils/storage';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { IdeaEngine } from './pages/IdeaEngine';
import { OpportunityRadar } from './pages/OpportunityRadar';
import { ValidationSprint } from './pages/ValidationSprint';
import { MoatBuilder } from './pages/MoatBuilder';
import { MonetisationLab } from './pages/MonetisationLab';
import { PersonaBuilder } from './pages/PersonaBuilder';
import { CompetitorMap } from './pages/CompetitorMap';
import { GrowthOS } from './pages/GrowthOS';
import { Hiring } from './pages/Hiring';
import { LegalSetup } from './pages/LegalSetup';
import { Fundraising } from './pages/Fundraising';
import { IdeaLog } from './pages/IdeaLog';
import { KPIDashboard } from './pages/KPIDashboard';
import { WeeklyExecution } from './pages/WeeklyExecution';
import { LaunchPlaybook } from './pages/LaunchPlaybook';
import { PitchDeck } from './pages/PitchDeck';
import { MissionControl } from './pages/MissionControl';
import { RiskAlerts } from './pages/RiskAlerts';

function DataLoader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initData().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="flex-col items-center gap-4">
          <div className="text-secondary tracking-widest uppercase text-sm animate-pulse font-bold">Initializing DB...</div>
        </div>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <DataLoader>
      <Toaster position="top-right" theme="dark" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/mission-control" replace />} />
            <Route path="mission-control" element={<MissionControl />} />
            <Route path="weekly-execution" element={<WeeklyExecution />} />

            <Route path="idea-engine" element={<IdeaEngine />} />
            <Route path="persona-builder" element={<PersonaBuilder />} />
            <Route path="validation-sprint" element={<ValidationSprint />} />
            <Route path="opportunity-radar" element={<OpportunityRadar />} />

            <Route path="moat-builder" element={<MoatBuilder />} />
            <Route path="monetisation-lab" element={<MonetisationLab />} />
            <Route path="competitor-map" element={<CompetitorMap />} />

            <Route path="kpi-dashboard" element={<KPIDashboard />} />
            <Route path="risk-alerts" element={<RiskAlerts />} />

            <Route path="idea-log" element={<IdeaLog />} />
            <Route path="growth-os" element={<GrowthOS />} />
            <Route path="hiring" element={<Hiring />} />
            <Route path="legal" element={<LegalSetup />} />
            <Route path="fundraising" element={<Fundraising />} />
            <Route path="launch-playbook" element={<LaunchPlaybook />} />
            <Route path="pitch-deck" element={<PitchDeck />} />
          </Route>
        </Routes>
      </Router>
    </DataLoader>
  );
}

export default App;
