import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const terminalCommands: Record<string, string | React.JSX.Element> = {
  help: (
    <div className="text-zinc-300">
      <p>Available commands:</p>
      <ul className="pl-4 mt-2 space-y-1">
        <li><span className="text-emerald-400">about</span>    - Learn more about me</li>
        <li><span className="text-emerald-400">projects</span> - View my recent work</li>
        <li><span className="text-emerald-400">skills</span>   - List my technical stack</li>
        <li><span className="text-emerald-400">contact</span>  - Get my contact details</li>
        <li><span className="text-emerald-400">clear</span>    - Clear the terminal</li>
      </ul>
    </div>
  ),
  about: "I build software that solves real-world problems. I approach every project with a product-first mindset.",
  projects: "Check out Local Job Connect, Energy2Green, and Sentinel NLP! Type 'projects' to view them.",
  skills: "React, Next.js, Node.js, Python, MongoDB, PostgreSQL, OpenAI API, and more.",
  contact: "Email me using the contact form below or find me on GitHub/LinkedIn/WhatsApp.",
  sudo: "Nice try! This incident will be reported.",
};

export function InteractiveTerminal() {
  const [history, setHistory] = useState<{ cmd: string; output: string | React.JSX.Element }[]>([
    { cmd: "", output: "Welcome to KamyOS v1.0.0. Type 'help' to see available commands." }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;
    
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const output = terminalCommands[cmd] || `Command not found: ${cmd}. Type 'help' for a list of commands.`;
    
    setHistory((prev) => [...prev, { cmd, output }]);
    setInput("");
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section id="terminal" className="py-24 bg-black text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Interactive Terminal</h2>
          <p className="text-zinc-400">A fun way to explore my portfolio.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto text-xs font-mono text-zinc-500">guest@kamy-portfolio:~</div>
          </div>
          
          <div 
            ref={containerRef}
            className="p-6 h-80 overflow-y-auto font-mono text-sm sm:text-base flex flex-col gap-3"
          >
            {history.map((entry, idx) => (
              <div key={idx}>
                {entry.cmd && (
                  <div className="flex gap-2 text-emerald-400 mb-1">
                    <span>➜</span>
                    <span className="text-cyan-400">~</span>
                    <span className="text-white">{entry.cmd}</span>
                  </div>
                )}
                <div className="text-zinc-300">{entry.output}</div>
              </div>
            ))}
            
            <form onSubmit={handleCommand} className="flex gap-2 text-emerald-400 mt-2">
              <span>➜</span>
              <span className="text-cyan-400">~</span>
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none text-white flex-1 caret-emerald-500"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
