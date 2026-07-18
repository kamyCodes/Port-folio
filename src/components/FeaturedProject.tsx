import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, Code2 } from "lucide-react";

export function FeaturedProject() {
  return (
    <section id="featured-project" className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Case Study</h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <span className="text-emerald-500 font-semibold mb-2">Featured Project</span>
              <h3 className="text-3xl font-bold mb-4">Local Job Connect</h3>
              
              <div className="prose prose-invert mb-8">
                <p className="text-zinc-400">
                  A dual-portal job platform that connects local businesses with nearby talent, featuring separate experiences for employers and job seekers.
                </p>
                <h4 className="text-white mt-4 font-semibold">The Problem</h4>
                <p className="text-zinc-400">
                  Local businesses struggle to find nearby talent quickly, often getting lost in large generic job boards.
                </p>
                <h4 className="text-white mt-4 font-semibold">The Solution</h4>
                <p className="text-zinc-400">
                  A localized platform with AI resume parsing, real-time messaging, and specialized dashboards to bridge the gap seamlessly.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-zinc-950 rounded-full text-xs text-zinc-300 border border-zinc-800">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a href="https://github.com/kamyCodes/Local-Job-Connect" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-full transition-colors">
                  <FaGithub size={20} />
                  <span>GitHub</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black hover:bg-emerald-400 rounded-full transition-colors font-medium">
                  <ExternalLink size={20} />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-zinc-950 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              {/* Placeholder for project screenshot */}
              <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-2xl relative z-10">
                <Code2 size={48} className="text-zinc-700" />
                <span className="ml-4 text-zinc-600 font-mono">App Screenshot</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
