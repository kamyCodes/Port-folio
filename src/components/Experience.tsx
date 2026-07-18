import { motion } from "framer-motion";

const timeline = [
  {
    year: "2026",
    title: "Built Local Job Connect",
    description: "A dual-portal job platform connecting local businesses with nearby talent. Includes features like resume parsing and real-time messaging."
  },
  {
    year: "2025",
    title: "Developed AI-integrated web applications",
    description: "Integrated Large Language Models into various applications to enhance user workflows and automate data processing."
  },
  {
    year: "2024",
    title: "Built PDF processing software",
    description: "Created robust tools for parsing, extracting, and analyzing data from complex PDF documents."
  },
  {
    year: "2023",
    title: "Created business websites",
    description: "Developed and deployed multiple landing pages and e-commerce platforms for local businesses."
  },
  {
    year: "Current Focus",
    title: "Full-stack + AI Engineering",
    description: "Focusing on delivering production-ready, scalable applications with seamless AI integrations."
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-zinc-950 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="relative border-l border-zinc-800 ml-3 md:ml-0 md:pl-0 md:flex md:flex-col md:items-center">
          {timeline.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="mb-10 ml-8 md:ml-0 md:flex md:w-full md:even:flex-row-reverse group"
            >
              <div className="absolute w-4 h-4 bg-zinc-800 rounded-full mt-1.5 -left-2 border-2 border-zinc-950 group-hover:bg-emerald-500 transition-colors md:relative md:left-auto md:mx-auto"></div>
              
              <div className="md:w-1/2 md:px-8">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl group-hover:border-emerald-500/30 transition-colors">
                  <span className="text-emerald-500 font-mono text-sm block mb-2">{item.year}</span>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
