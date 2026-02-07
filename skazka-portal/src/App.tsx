import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import MainScreen from './pages/MainScreen';
import TaleGeneration from './pages/TaleGeneration';
import NarratorsSelection from './pages/NarratorsSelection';
import Subscription from './pages/Subscription';
import CoinsShop from './pages/CoinsShop';
import Collection from './pages/Collection';
import Profile from './pages/Profile';
import TalePlayer from './pages/TalePlayer';

// Store
import useStore from './store/useStore';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { hasSeenOnboarding, setHasSeenOnboarding } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            !hasSeenOnboarding ? (
              <Onboarding onComplete={() => setHasSeenOnboarding(true)} />
            ) : (
              <Navigate to="/main" />
            )
          } />
          <Route path="/main" element={<MainScreen />} />
          <Route path="/tale-generation" element={<TaleGeneration />} />
          <Route path="/narrators" element={<NarratorsSelection />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/coins" element={<CoinsShop />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tale/:id" element={<TalePlayer />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;