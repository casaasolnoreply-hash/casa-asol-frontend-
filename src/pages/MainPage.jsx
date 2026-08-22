import TopBar       from "../components/layout/TopBar";
import Navbar       from "../components/layout/Navbar";
import Footer       from "../components/layout/Footer";
import Hero         from "../components/sections/Hero";
import Stats        from "../components/sections/Stats";
import Historia     from "../components/sections/Historia";
import Programa     from "../components/sections/Programa";
import Equipo       from "../components/sections/Equipo";
import Financiacion      from "../components/sections/Financiacion";
import DonacionCarousel  from "../components/sections/DonacionCarousel";
import Voluntariado      from "../components/sections/Voluntariado";
import Contacto     from "../components/sections/Contacto";
import ExpandModal  from "../components/modals/ExpandModal";

export default function MainPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#333", minHeight: "100vh" }}>
      <ExpandModal />
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Historia />
        <Programa />
        <Equipo />
        <Financiacion />
        <DonacionCarousel />
        <Voluntariado />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
