import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timeline = [
  {
    year: "2026",
    title: "FakeNewsCTIAnalyzer",
    description: "Developed a final year group project focused on building an AI-powered system to detect and analyze fake news using Cyber Threat Intelligence."
  },
  {
    year: "2025",
    title: "Built Local Job Connect",
    description: "A dual-portal job platform connecting local businesses with nearby talent. Includes features like resume parsing and real-time messaging."
  },
  {
    year: "2024",
    title: "Built Advice Generator App",
    description: "Developed a dynamic web application that fetches and displays random pieces of advice using an external API."
  },
  {
    year: "Current Focus",
    title: "Full-stack + AI Engineering",
    description: "Focusing on delivering production-ready, scalable applications with seamless AI integrations."
  }
];

export function Experience() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-32 bg-zinc-950 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div ref={containerRef} className="relative ml-3 md:ml-0">
          {/* Animated timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2 overflow-hidden">
            <motion.div
              style={{ scaleY: lineScaleY, originY: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-500/20"
            />
          </div>

          <div className="flex flex-col">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`mb-12 flex items-start gap-8 md:gap-0 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Card */}
                <div className={`md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? "md:pr-12 ml-8 md:ml-0" : "md:pl-12 ml-8 md:ml-0"}`}>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors group cursor-default">
                    <span className="text-emerald-500 font-mono text-sm block mb-2">{item.year}</span>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 mt-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 + 0.2 }}
                    className="w-4 h-4 rounded-full bg-zinc-950 border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
