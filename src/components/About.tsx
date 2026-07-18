import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 md:p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold mb-6 text-emerald-500">Problem Solver</h2>
          
          <div className="space-y-6 text-lg text-zinc-300">
            <p>
              I build software that solves real-world problems, from AI-powered applications to full-stack web platforms. I enjoy turning ideas into scalable, user-focused products that make a meaningful impact.
            </p>
            <p>
              I write clean, maintainable code and approach every project with a product-first mindset, focusing on performance, usability, and long-term quality.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
