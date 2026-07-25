import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export function Contact() {
  return (
    <section id="contact" className="py-32 bg-black text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Let's build something <span className="text-emerald-500">together</span>.
            </h2>
            <p className="text-xl text-zinc-400 mb-12">
              Whether you need a full-stack application, an AI integration, or just want to chat about tech, my inbox is open.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-16 text-left">
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold mb-4 text-white text-center md:text-left">Connect with me</h3>
                <a href="https://github.com/kamyCodes" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all group">
                  <FaGithub size={24} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  <span className="font-medium">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/kamyomobong-ewang-4a29822b7" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all group">
                  <FaLinkedin size={24} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a href="https://wa.me/2348076730654" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all group">
                  <FaWhatsapp size={24} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  <span className="font-medium">WhatsApp</span>
                </a>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold mb-4 text-white text-center md:text-left">Send a message</h3>
                <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-400">Your Email</label>
                    <input type="email" id="email" name="email" placeholder="hello@example.com" required className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                    <textarea id="message" name="message" rows={4} placeholder="Let's build something together..." required className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
                  </div>
                  <button type="submit" className="bg-emerald-500 text-black font-semibold rounded-lg px-6 py-3 mt-2 hover:bg-emerald-400 transition-colors hover:scale-105 transform">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
