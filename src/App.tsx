import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Radio from "./pages/Radio";
import Contact from "./pages/Contact";
import Coran from "./pages/Coran";
import Tafsir from "./pages/Tafsir";
import Podcasts from "./pages/Podcasts";
import Conseils from "./pages/Conseils";
import ModernLayout from "./components/modern/ModernLayout";
import ModernHome from "./pages/modern/ModernHome";
import ModernListenLive from "./pages/modern/ModernListenLive";
import { useSiteConfig } from "./hooks/useSiteConfig";

// Lazy-loaded heavy pages (code splitting)
const YouTube = lazy(() => import("./pages/YouTube"));
const AdminSecretAccess = lazy(() => import("./pages/AdminSecretAccess"));
const LearningProgram = lazy(() => import("./pages/LearningProgram"));
const ModernCoranLearning = lazy(() => import("./pages/ModernCoranLearning"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-iqra-green border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const { config, loading } = useSiteConfig();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  if (config?.use_modern_ui) {
    return (
      <Routes>
        <Route path="/secret-radio-iqra-xyz" element={<AdminSecretAccess />} />
        <Route path="/secret-radio-iqra-xyz.html" element={<AdminSecretAccess />} />
        <Route path="/admin-access-secure-portal-9238" element={<Navigate to="/secret-radio-iqra-xyz" replace />} />
        <Route path="/admin" element={<Navigate to="/secret-radio-iqra-xyz" replace />} />

        <Route element={<ModernLayout />}>
          <Route path="/" element={<ModernHome />} />
          <Route path="/listen-live" element={<ModernListenLive />} />
          <Route path="/coran" element={<Coran />} />
          <Route path="/tafsir" element={<Tafsir />} />
          <Route path="/apprentissage" element={<LearningProgram />} />
          <Route path="/coran-apprentissage" element={<ModernCoranLearning />} />
          <Route path="/youtube" element={<YouTube />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/conseils" element={<Conseils />} />
        </Route>

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h1 className="text-4xl font-bold text-iqra-green">404</h1>
            <p className="text-gray-600">Page non trouvée</p>
            <a href="/" className="px-6 py-2 bg-iqra-gold text-iqra-green font-bold rounded-xl shadow-lg">Retour à l'accueil</a>
          </div>
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/secret-radio-iqra-xyz" element={<AdminSecretAccess />} />
      <Route path="/secret-radio-iqra-xyz.html" element={<AdminSecretAccess />} />
      <Route path="/admin-access-secure-portal-9238" element={<Navigate to="/secret-radio-iqra-xyz" replace />} />
      <Route path="/admin" element={<Navigate to="/secret-radio-iqra-xyz" replace />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/youtube" element={<YouTube />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/coran" element={<Coran />} />
        <Route path="/tafsir" element={<Tafsir />} />
        <Route path="/apprentissage" element={<LearningProgram />} />
        <Route path="/coran-apprentissage" element={<ModernCoranLearning />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/conseils" element={<Conseils />} />
      </Route>

      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
          <h1 className="text-4xl font-bold text-iqra-green">404</h1>
          <p className="text-gray-600">Page non trouvée</p>
          <a href="/" className="px-6 py-2 bg-iqra-gold text-iqra-green font-bold rounded-xl shadow-lg">Retour à l'accueil</a>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
