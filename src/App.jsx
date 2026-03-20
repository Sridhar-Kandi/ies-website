import{useState}from"react";import{getTheme}from"./data/theme";
import Navbar from"./components/Navbar";import Hero from"./components/Hero";
import{AboutSection,NewsSection,AllianceSection,StudentProjectsPreview,ResearchSection,TeamBanner}from"./components/HomeSections";
import Footer from"./components/Footer";
import MembersPage from"./pages/MembersPage";import ProjectsPage from"./pages/ProjectsPage";
import ProfessorProfile from"./pages/ProfessorProfile";import ThesesPage from"./pages/ThesesPage";
import PositionsPage from"./pages/PositionsPage";import ContactPage from"./pages/ContactPage";
import ResearchDetailPage from"./pages/ResearchDetailPage";

export default function App(){
  const[dark,setDark]=useState(true);const[page,setPage]=useState("home");
  const go=p=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"});};
  const t=getTheme(dark);
  const isResearch=page.startsWith("research-");
  const researchId=isResearch?page.replace("research-",""):null;

  return<div style={{fontFamily:"'Poppins',sans-serif",background:t.bg,minHeight:"100vh",transition:"background 0.4s"}}>
    <Navbar dark={dark} setDark={setDark} currentPage={page} navigate={go}/>
    {page==="home"&&<>
      <Hero dark={dark}/>
      <AboutSection dark={dark}/>
      <NewsSection dark={dark} navigate={go}/>
      <TeamBanner dark={dark}/>
      <AllianceSection dark={dark}/>
      <StudentProjectsPreview dark={dark} navigate={go}/>
      <ResearchSection dark={dark} navigate={go}/>
    </>}
    {page==="members"&&<MembersPage dark={dark} navigate={go}/>}
    {page==="projects"&&<ProjectsPage dark={dark} navigate={go}/>}
    {page==="theses"&&<ThesesPage dark={dark} navigate={go}/>}
    {page==="positions"&&<PositionsPage dark={dark} navigate={go}/>}
    {page==="contact"&&<ContactPage dark={dark} navigate={go}/>}
    {page==="professor-profile"&&<ProfessorProfile dark={dark} navigate={go}/>}
    {isResearch&&<ResearchDetailPage dark={dark} navigate={go} areaId={researchId}/>}
    <Footer dark={dark}/>
  </div>;
}
