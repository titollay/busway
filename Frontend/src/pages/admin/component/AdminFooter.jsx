import { motion } from "framer-motion";

export default function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 py-6 mt-auto border-t border-gray-200 dark:border-white/5 dark:bg-gray-900/50 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <p className="text-[0.7rem] text-gray-400 dark:text-white/20 tracking-wider uppercase">
            &copy; {year} <span className="text-blue-500 font-semibold">BusWay</span> Admin v3.2.0
          </p>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[0.65rem] text-gray-400 dark:text-white/20 tracking-widest uppercase">Network Secure</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <a 
            href="#" 
            className="text-[0.65rem] text-gray-400 dark:text-white/20 tracking-widest uppercase hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Documentation
          </a>
          <a 
            href="#" 
            className="text-[0.65rem] text-gray-400 dark:text-white/20 tracking-widest uppercase hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Support
          </a>
          <div className="px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
            <p className="text-[0.6rem] text-gray-400 dark:text-white/30 font-mono">
              PHP 8.2 | React 18
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
