import { motion } from "framer-motion";

const roles = ["Software Engineer", "AI Integration Specialist", "Full-Stack Developer"];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-black text-white pt-20">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Emerald glow orb */}
      {/* <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" /> */}

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 " />
              Software Engineer
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              Hi, I'm{" "}
              <span className="text-emerald-500 relative">
                Kamy
                {/* <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-emerald-500/40 rounded-full" /> */}
              </span>
              .
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-xl mb-4 leading-relaxed"
            >
              Building <span className="text-white font-medium">AI-powered products</span> that solve real-world problems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base text-zinc-500 max-w-lg mb-10"
            >
              Specializing in AI Integration and Full-Stack Development.
            </motion.p>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 mb-10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Open to Software Engineering opportunities
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a href="#featured-project" className="px-8 py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:scale-105">
                View Projects
              </a>
              <a href="/Kamyomobong_Resume_Updated.pdf" target="_blank" className="px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all hover:scale-105">
                Resume
              </a>
              <a href="#contact" className="px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all hover:scale-105">
                Contact
              </a>
            </motion.div>
          </div>

          {/* Right — Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl scale-110 animate-pulse" />
              {/* Border ring */}
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border-2 border-emerald-500/40 p-1 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
                <img
                  src="/profile.png"
                  alt="Kamy — Software Engineer"
                  className="w-full h-full rounded-full object-cover object-top"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs font-mono text-emerald-400 whitespace-nowrap shadow-lg">
                &lt;/&gt; Available for hire
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
