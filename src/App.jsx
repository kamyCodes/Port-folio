import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-500 origin-left z-[100]"
    />
  );
}

function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        transition: "left 0.12s ease-out, top 0.12s ease-out",
      }}
    />
  );
}

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <ScrollProgressBar />
      <MouseGlow />
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
