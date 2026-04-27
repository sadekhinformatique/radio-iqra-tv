import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        <Route path="/secret-radio-iqra-xyz" element={<AdminSecretAccess />} />
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
      </Routes>
    </Router>
  );
}
