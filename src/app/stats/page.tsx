import Link from "next/link";
import { Cpu, Home } from "lucide-react";
import { getSystemDetails } from "./system";

// Custom Progress component
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-rose-500 transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default async function StatsPage() {
  const systemInfo = await getSystemDetails();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-6 py-10 sm:px-24 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-12 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-rose-500 tracking-tight flex items-center gap-2">
          <Cpu className="w-6 h-6" />
          System Stats
        </h1>
        <nav>
          <Link
            href="/"
            className="text-sm sm:text-base flex items-center gap-1 text-neutral-300 hover:text-rose-400 transition"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Main Stats Content */}
      <main className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-6 space-y-8">
        {/* System Info */}
        <section>
          <h2 className="text-xl font-semibold text-rose-400 mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            {[
              ["Hostname", systemInfo.os.hostname()],
              ["Platform", systemInfo.os.platform()],
              ["Architecture", systemInfo.os.arch()],
              ["CPU Temperature", `${systemInfo.cpuTemp?.toFixed(1) ?? "N/A"}°C`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-neutral-400">{label}:</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CPU Usage */}
        <section>
          <h2 className="text-lg font-semibold text-rose-300 mb-2">CPU Usage</h2>
          {systemInfo.cpuUsage.map((usage, index) => (
            <div key={index} className="space-y-1 mb-3">
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Core {index}</span>
                <span>{usage}%</span>
              </div>
              <ProgressBar value={parseFloat(usage)} />
            </div>
          ))}
        </section>

        {/* Memory Usage */}
        <section>
          <h2 className="text-lg font-semibold text-rose-300 mb-2">Memory Usage</h2>
          <div className="flex justify-between text-sm text-neutral-400 mb-1">
            <span>Used</span>
            <span>
              {systemInfo.memoryUsage.used.toFixed(2)} /{" "}
              {systemInfo.memoryUsage.total.toFixed(2)} GB
            </span>
          </div>
          <ProgressBar
            value={
              (systemInfo.memoryUsage.used / systemInfo.memoryUsage.total) * 100
            }
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-sm text-neutral-500 text-center border-t border-neutral-800 pt-6 w-full max-w-5xl">
        &copy; {new Date().getFullYear()} CyberArt Space · Powered by Raspberry Pi 5
      </footer>
    </div>
  );
}
