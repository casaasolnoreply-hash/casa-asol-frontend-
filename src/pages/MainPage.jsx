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
import { HuipilStripe } from "../components/ui/GuatemalanMotifs";
import GuatemalaFrame from "../components/layout/GuatemalaFrame";
import LanguageSuggestionBar from "../components/layout/LanguageSuggestionBar";

export default function MainPage() {
  return (
    <GuatemalaFrame contentStyle={{ fontFamily: "'Segoe UI', sans-serif", color: "#333" }}>
      <ExpandModal />
      <LanguageSuggestionBar />
      <TopBar />
      <Navbar />
      <HuipilStripe height={8} />
      <main>
        <Hero />
        <Stats />
        <Programa />
        <Equipo />
        <Historia />
        <Financiacion />
        <DonacionCarousel />
        <Voluntariado />
        <Contacto />
      </main>
      <Footer />
    </GuatemalaFrame>
  );
}
