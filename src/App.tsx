import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Radio from "./pages/Radio";
import YouTube from "./pages/YouTube";
import Contact from "./pages/Contact";
import Coran from "./pages/Coran";
import Podcasts from "./pages/Podcasts";
import Conseils from "./pages/Conseils";
import AdminSecretAccess from "./pages/AdminSecretAccess";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes with and without .html for flexibility */}
        <Route path="/secret-radio-iqra-xyz" element={<AdminSecretAccess />} />
        <Route path="/secret-radio-iqra-xyz.html" element={<AdminSecretAccess />} />
        
        {/* Redirect old admin paths if hit */}
        <Route path="/admin-access-secure-portal-9238" element={<Navigate to="/secret-radio-iqra-xyz" replace />} />
        <Route path="/admin" element={<Navigate to="/secret-radio-iqra-xyz" replace />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/youtube" element={<YouTube />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/coran" element={<Coran />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/conseils" element={<Conseils />} />
        </Route>

        {/* Catch-all route to avoid white page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h1 className="text-4xl font-bold text-iqra-green">404</h1>
            <p className="text-gray-600">Page non trouvée</p>
            <a href="/" className="px-6 py-2 bg-iqra-gold text-iqra-green font-bold rounded-xl shadow-lg">Retour à l'accueil</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}
