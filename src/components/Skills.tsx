import { motion } from "framer-motion";

const skills = {
  Frontend: ["React", "Next.js", "Vite", "Tailwind CSS"],
  Backend: ["Node.js", "Python"],
  Databases: ["MongoDB", "MySQL", "PostgreSQL"],
  AI: ["OpenAI APIs", "Prompt Engineering", "AI Chatbots", "Document Processing"],
  Tools: ["Git", "GitHub", "Vercel"]
};

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Skills & Technologies</h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(skills).map(([category, items], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors group"
            >
              <h3 className="text-xl font-semibold mb-6 text-emerald-400">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1 rounded-full text-sm bg-zinc-950 border border-zinc-800 text-zinc-300 group-hover:border-zinc-700 transition-colors"
                  >
                    {skill}
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
