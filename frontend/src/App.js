import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorFollower from './components/CursorFollower';
import IntroLoader from './components/IntroLoader';
import RouteLoader from './components/RouteLoader';
import ScrollToTop from './components/ScrollToTop';
import CommandPalette from './components/CommandPalette';
import KonamiCode from './components/KonamiCode';
import CmdKHint from './components/CmdKHint';
import ReadingProgress from './components/ReadingProgress';
import AchievementToast from './components/AchievementToast';
import ExplorerSidebar from './components/ExplorerSidebar';
import QuickActionsDock from './components/QuickActionsDock';
import ChannelTalk from './components/ChannelTalk';
import AvailabilityBadge from './components/AvailabilityBadge';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AchievementProvider } from './contexts/AchievementContext';
import { printConsoleWelcome } from './utils/consoleMessage';
import { registerServiceWorker } from './utils/registerSW';
import './App.css';

// Lazy-load route pages so the branded <RouteLoader/> shows only when a page
// actually needs to load (its code chunk isn't downloaded yet). The small
// minimum delay keeps the fill animation readable; already-loaded pages
// navigate instantly with no loader. Home stays eager so the initial visit
// is handled by the intro animation rather than this loader.
const withMinDelay = (factory, ms = 950) =>
  lazy(() =>
    Promise.all([factory(), new Promise((resolve) => setTimeout(resolve, ms))])
      .then(([module]) => module)
  );

const Services = withMinDelay(() => import('./pages/Services'));
const References = withMinDelay(() => import('./pages/References'));
const ReferenceDetail = withMinDelay(() => import('./pages/ReferenceDetail'));
const Portfolio = withMinDelay(() => import('./pages/Portfolio'));
const PortfolioDetail = withMinDelay(() => import('./pages/PortfolioDetail'));
const PortfolioForm = withMinDelay(() => import('./pages/PortfolioForm'));
const Contact = withMinDelay(() => import('./pages/Contact'));
const About = withMinDelay(() => import('./pages/About'));
const Admin = withMinDelay(() => import('./pages/Admin'));
const Privacy = withMinDelay(() => import('./pages/Privacy'));
const Terminal = withMinDelay(() => import('./pages/Terminal'));
const NotFound = withMinDelay(() => import('./pages/NotFound'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/references" element={<PageTransition><References /></PageTransition>} />
          <Route path="/references/:slug" element={<PageTransition><ReferenceDetail /></PageTransition>} />
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
    </Suspense>
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
            <IntroLoader />
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
              <ChannelTalk />
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
