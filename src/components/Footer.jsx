export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black py-12 border-t border-zinc-900 text-center text-zinc-500">
      <div className="container mx-auto px-4">
        <p className="mb-4 text-lg font-bold text-white tracking-tighter">
          Kamy<span className="text-emerald-500">.</span>
        </p>
        <p className="text-sm">
          &copy; {currentYear} Kamy. Building products, not just code.
        </p>
      </div>
    </footer>
  );
}
