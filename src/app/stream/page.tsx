"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Monitor, Radar, Home } from "lucide-react";


export default function StreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState(new Date());

  // Handle name modal
  useEffect(() => {
    const storedName = localStorage.getItem("viewerName");
    if (storedName) {
      setName(storedName);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!inputName) return;

    const ip = await fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => "unknown");

    try {
      await fetch("https://py.cyberart-space.com/log-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inputName, ip }),
      });
    } catch (err) {
      console.error("Error sending visitor data:", err);
    }

    localStorage.setItem("viewerName", inputName);
    setName(inputName);
    setShowModal(false);
  };

  // Stream setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadHLS = async () => {
      if ((window as any).Hls?.isSupported()) {
        const hls = new (window as any).Hls();
        hls.loadSource("https://rasp.cyberart-space.com/api/stream?path=index.m3u8");
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "http://192.168.178.132:3000/api/stream?path=index.m3u8";
      }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    script.onload = loadHLS;
    document.body.appendChild(script);
  }, []);

  // Motion check
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://py.cyberart-space.com/motion");
        const data = await res.json();
        setMotion(data.motion);
      } catch (err) {
        console.error("Failed to fetch motion status:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Clock
  useEffect(() => {
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-6 py-10 sm:px-24 flex flex-col items-center">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-700 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-rose-400">Welcome! 👋</h2>
            <input
              type="text"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Enter your name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Navigation Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-12 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold text-rose-500 tracking-tight flex items-center gap-2">
          <Monitor className="w-6 h-6" />
          Stream
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

      {/* Video */}
      <div className="w-full flex flex-col items-center gap-6 max-w-5xl">
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          playsInline
          className="w-full rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-neutral-800"
        />

        <div className="text-lg font-medium flex items-center gap-2">
        <Radar className="w-5 h-5 text-rose-400" />
          Motion:{" "}
          <span className={`font-bold ${motion ? "text-red-500" : "text-green-400"}`}>
            {motion ? "Detected 🔴" : "No motion 🟢"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-neutral-500 text-center border-t border-neutral-800 pt-6 w-full max-w-5xl">
        &copy; {new Date().getFullYear()} CyberArt Space · GoPro Stream via Raspberry Pi 5
      </footer>
    </div>
  );
}
