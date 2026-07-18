import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Energy2Green Website",
    description: "A modern corporate website for a renewable energy company, showcasing solar products, services, and company information with a responsive, professional design.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/kamyCodes",
    live: "#"
  },
  {
    title: "Sentinel NLP",
    description: "An AI-powered natural language processing platform designed to analyze, classify, and extract insights from text using modern NLP techniques and machine learning models.",
    tech: ["Python", "FastAPI", "Transformers", "Hugging Face", "PyTorch", "React"],
    github: "https://github.com/kamyCodes/FakeNewsCTIAnalyzer",
    live: "#"
  }
];

export function ProjectCards() {
  return (
    <section id="other-projects" className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Other Projects</h2>
          <div className="h-1 w-16 bg-emerald-500 mx-auto rounded-full mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div className="flex gap-3">
                  <a href={project.github} className="text-zinc-400 hover:text-emerald-500 transition-colors" target="_blank" rel="noreferrer">
                    <FaGithub size={20} />
                  </a>
                  <a href={project.live} className="text-zinc-400 hover:text-emerald-500 transition-colors" target="_blank" rel="noreferrer">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3">{project.title}</h3>
              <p className="text-zinc-400 mb-6 flex-grow">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map(tech => (
                  <span key={tech} className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
