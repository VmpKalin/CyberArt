import Image from "next/image";
import Link from "next/link";
import { Monitor, LineChart, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-6 py-10 sm:py-20 sm:px-24 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-rose-500 tracking-tight">
          🍓 Raspberry Pi 5 Dashboard
        </h1>
        <nav className="flex gap-6 text-sm sm:text-base text-neutral-300">
          <Link href="https://rasp.cyberart-space.com/stream" className="hover:text-rose-400 transition">
            <Monitor className="inline w-4 h-4 mr-1" /> Stream
          </Link>
          <Link href="https://rasp.cyberart-space.com/stats" className="hover:text-rose-400 transition">
            <LineChart className="inline w-4 h-4 mr-1" /> Stats
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="text-center max-w-3xl flex flex-col items-center gap-8">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Hello from my <span className="text-rose-400">Raspberry Pi 5</span> 👋
        </h2>
        <p className="text-neutral-400 text-lg sm:text-xl max-w-xl">
          This dashboard is running on a tiny but powerful machine. Explore the stream of my live coding work or view real-time system stats.
        </p>
        <div className="flex gap-6 flex-wrap justify-center">
          <Link
            href="https://rasp.cyberart-space.com/stream"
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-6 py-3 rounded-xl text-sm sm:text-base font-medium transition shadow-lg"
          >
            <Monitor className="w-5 h-5" />
            Live Stream
          </Link>
          <Link
            href="https://rasp.cyberart-space.com/stats"
            className="flex items-center gap-2 border border-rose-500 hover:bg-rose-600 hover:text-white px-6 py-3 rounded-xl text-sm sm:text-base font-medium transition shadow-lg"
          >
            <LineChart className="w-5 h-5" />
            System Stats
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-xs text-neutral-500 text-center border-t border-neutral-800 mt-20 pt-6">
        &copy; {new Date().getFullYear()} CyberArt Space · Hosted on a Raspberry Pi 5 · Built with 💻 & ❤️
      </footer>
    </div>
  );
}
