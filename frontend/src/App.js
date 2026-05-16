import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorFollower from './components/CursorFollower';
import ScrollToTop from './components/ScrollToTop';
import CommandPalette from './components/CommandPalette';
import KonamiCode from './components/KonamiCode';
import CmdKHint from './components/CmdKHint';
import ReadingProgress from './components/ReadingProgress';
import AchievementToast from './components/AchievementToast';
import ExplorerSidebar from './components/ExplorerSidebar';
import QuickActionsDock from './components/QuickActionsDock';
import AvailabilityBadge from './components/AvailabilityBadge';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import PortfolioForm from './pages/PortfolioForm';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Terminal from './pages/Terminal';
import NotFound from './pages/NotFound';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AchievementProvider } from './contexts/AchievementContext';
import { printConsoleWelcome } from './utils/consoleMessage';
import { registerServiceWorker } from './utils/registerSW';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/portfolio/:id" element={<PageTransition><PortfolioDetail /></PageTransition>} />
        <Route path="/portfolio/new" element={<PageTransition><PortfolioForm /></PageTransition>} />
        <Route path="/portfolio/edit/:id" element={<PageTransition><PortfolioForm /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terminal" element={<PageTransition><Terminal /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    printConsoleWelcome();
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AchievementProvider>
          <Router>
            {/* SmoothScroll (Lenis) disabled — native scroll feels snappier with many animations */}
            <ScrollToTop />
            <ReadingProgress />
            <div className="App">
              <CursorFollower />
              <CommandPalette />
              <KonamiCode />
              <CmdKHint />
              <AchievementToast />
              <ExplorerSidebar />
              <QuickActionsDock />
              <AvailabilityBadge variant="bar" />
              <Navbar />
              <main className="main-content">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </AchievementProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
