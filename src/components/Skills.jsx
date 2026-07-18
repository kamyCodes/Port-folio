import { motion } from "framer-motion";
import { useState } from "react";

const skills = {
  Frontend: [
    { name: "React", iconClass: "devicon-react-original", context: "Used in Local Job Connect & Sentinel NLP" },
    { name: "Next.js", iconClass: "devicon-nextjs-plain", context: "Used in Energy2Green" },
    { name: "Vite", iconClass: "devicon-vitejs-plain", context: "Powers this portfolio" },
    { name: "Tailwind CSS", iconClass: "devicon-tailwindcss-original", context: "Styling across all projects" },
  ],
  Backend: [
    { name: "Node.js", iconClass: "devicon-nodejs-plain", context: "Used in Local Job Connect" },
    { name: "Python", iconClass: "devicon-python-plain", context: "Used in FakeNewsCTIAnalyzer & Sentinel NLP" },
  ],
  Databases: [
    { name: "MongoDB", iconClass: "devicon-mongodb-plain", context: "Database for Local Job Connect" },
    { name: "MySQL", iconClass: "devicon-mysql-plain", context: "Used in backend projects" },
    { name: "PostgreSQL", iconClass: "devicon-postgresql-plain", context: "Relational data storage" },
  ],
  AI: [
    { name: "AI APIs", emoji: "🤖", context: "Integrated across multiple projects" },
    { name: "Prompt Engineering", emoji: "💡", context: "Used in AI chatbot projects" },
    { name: "AI Chatbots", emoji: "💬", context: "Built custom LLM-powered bots" },
    { name: "LLM Text Processing", emoji: "📄", context: "Core of FakeNewsCTIAnalyzer" },
  ],
  Tools: [
    { name: "Git", iconClass: "devicon-git-plain", context: "Version control for every project" },
    { name: "GitHub", iconClass: "devicon-github-original", context: "All projects hosted here" },
    { name: "Vercel", iconClass: "devicon-vercel-original", context: "Deployment platform" },
  ],
};

function SkillBadge({ skill }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="px-3 py-1.5 rounded-full text-sm bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-emerald-500/50 hover:text-white transition-all cursor-default flex items-center gap-2 select-none">
        <span className="text-lg">{skill.iconClass ? <i className={skill.iconClass}></i> : skill.emoji}</span>
        <span>{skill.name}</span>
      </span>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 whitespace-nowrap z-10 shadow-xl"
        >
          {skill.context}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-emerald-500/30 rotate-45 -mt-1" />
        </motion.div>
      )}
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Skills &amp; Technologies</h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-zinc-500 text-sm">Hover over a skill to see where I've used it</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(skills).map(([category, items], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 transition-colors group"
            >
              <h3 className="text-xl font-semibold mb-6 text-emerald-400">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
