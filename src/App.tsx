import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { FeaturedProject } from "./components/FeaturedProject";
import { ProjectCards } from "./components/ProjectCards";
import { InteractiveTerminal } from "./components/Terminal";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <FeaturedProject />
        <ProjectCards />
        <InteractiveTerminal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
