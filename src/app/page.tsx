"use client";
import MetronomeSlider from "@/app/slider";
import { useCallback, useRef, useState } from "react";
import BeatsSelector from "./BeatsSelector";

export default function Home() {
  const [tempo, setTempo] = useState(160);
  const [beats, setBeats] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [accent, setAccent] = useState(true);
  const [active, setActive] = useState(false);

  const MIN_TEMPO = 20;
  const MAX_TEMPO = 300;

  const increaseTempo = () =>
    setTempo((prev) => Math.min(prev + 1, MAX_TEMPO));
  const decreaseTempo = () =>
    setTempo((prev) => Math.max(prev - 1, MIN_TEMPO));

  const intervalRef = useRef<number | null>(null);

  const startCount = useCallback((fn: () => void) => {
    fn();
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(fn, 120);
  }, []);

  const stopCount = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 overflow-hidden">
      <main className="flex flex-col gap-10 row-start-2 items-center justify-center">
        <div className="font-sans min-h-screen p-4 sm:p-8 flex flex-col items-center bg-black">
          {/* Top controls */}
          <div className="flex flex-col sm:flex-row sm:gap-8 gap-4 items-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-white">Beats</p>
              <BeatsSelector beats={beats} setBeats={setBeats} />
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-white">Accent</p>
              <button
                onClick={() => setAccent(!accent)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${accent ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-black text-white hover:bg-gray-800"}`}
              >
                {accent ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Beat squares */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 mt-2">
            {Array.from({ length: beats }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rotate-45 mx-2 my-1 outline-2 ${!active
                  ? "bg-gray-400"
                  : i === currentBeat - 1
                    ? "bg-red-700"
                    : "bg-blue-500"
                  }`}
              />
            ))}
          </div>

          {/* Start / Pause button */}
          <button
            onClick={() => setActive(!active)}
            className={`px-6 py-2 mt-10 mb-6 rounded-full font-semibold transition-colors
          ${active ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            {active ? "PAUSE" : "START"}
          </button>

          {/* Slider + BPM */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
            <MetronomeSlider
              value={tempo}
              minValue={MIN_TEMPO}
              maxValue={MAX_TEMPO}
              lowerValue={decreaseTempo}
              increaseValue={increaseTempo}
              setValue={setTempo}
            />
            <p className="font-bold text-3xl text-center text-white">{tempo} BPM</p>
          </div>
        </div>
      </main >
    </div >
  );
}
