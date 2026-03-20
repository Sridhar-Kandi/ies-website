import { useState, useEffect } from "react";
import { getTheme } from "./data/theme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { AboutSection, NewsSection, AllianceSection, StudentProjectsPreview, ResearchSection, TeamBanner } from "./components/HomeSections";
import Footer from "./components/Footer";
import MembersPage from "./pages/MembersPage";
import ProjectsPage from "./pages/ProjectsPage";
import MemberProfile from "./pages/MemberProfile";
import ThesesPage from "./pages/ThesesPage";
import PositionsPage from "./pages/PositionsPage";
import ContactPage from "./pages/ContactPage";
import ResearchDetailPage from "./pages/ResearchDetailPage";
import AdminApp from "./admin/AdminApp";

export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("home");

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') setPage('admin');
      else if (hash) setPage(hash);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const go = (p) => {
    setPage(p);
    window.location.hash = p === 'home' ? '' : p;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin panel
  if (page === 'admin') {
    return <div style={{ fontFamily: "'Poppins',sans-serif" }}>
      <style>{`body { zoom: 1 !important; }`}</style>
      <AdminApp />
    </div>;
  }

  const t = getTheme(dark);
  const isResearch = page.startsWith("research-");
  const isMember = page.startsWith("member-");
  const researchId = isResearch ? page.replace("research-", "") : null;
  const memberId = isMember ? page.replace("member-", "") : null;

  return (
    <div style={{ fontFamily: "'Poppins',sans-serif", background: t.bg, minHeight: "100vh", transition: "background 0.4s" }}>
      <Navbar dark={dark} setDark={setDark} currentPage={page} navigate={go} />
      {page === "home" && <>
        <Hero dark={dark} />
        <AboutSection dark={dark} />
        <NewsSection dark={dark} navigate={go} />
        <TeamBanner dark={dark} />
        <AllianceSection dark={dark} />
        <StudentProjectsPreview dark={dark} navigate={go} />
        <ResearchSection dark={dark} navigate={go} />
      </>}
      {page === "members" && <MembersPage dark={dark} navigate={go} />}
      {page === "projects" && <ProjectsPage dark={dark} navigate={go} />}
      {page === "theses" && <ThesesPage dark={dark} navigate={go} />}
      {page === "positions" && <PositionsPage dark={dark} navigate={go} />}
      {page === "contact" && <ContactPage dark={dark} navigate={go} />}
      {isMember && <MemberProfile dark={dark} navigate={go} memberId={memberId} />}
      {isResearch && <ResearchDetailPage dark={dark} navigate={go} areaId={researchId} />}
      <Footer dark={dark} />
    </div>
  );
}
