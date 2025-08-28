"use client";
import { useEffect, useState } from "react";
import useMetronome from "./hooks/useMetronome";
import TempoSlider from "@/app/components/TempoSlider";
import BeatsSelector from "./components/BeatsSelector";
import useLocalStorageState from "use-local-storage-state";
import VolumeSlider from "./components/VolumeSlider";
import SoundSelector from "./components/SoundSelector";

export default function Home() {
  const [tempo, setTempo] = useLocalStorageState("tempo", { defaultValue: 160 });
  const [beats, setBeats] = useLocalStorageState("beats", { defaultValue: 4 });
  const [accent, setAccent] = useLocalStorageState("accent", { defaultValue: true });
  const [volume, setVolume] = useLocalStorageState("volume", { defaultValue: 50 });
  const [sound, setSound] = useLocalStorageState("sound", { defaultValue: "default" });

  const [currentBeat, setCurrentBeat] = useState(0);
  const [active, setActive] = useState(false);

  const MIN_TEMPO = 20;
  const MAX_TEMPO = 300;

  const increaseTempo = () => setTempo((prev) => Math.min(prev + 1, MAX_TEMPO));
  const decreaseTempo = () => setTempo((prev) => Math.max(prev - 1, MIN_TEMPO));

  useMetronome({
    tempo,
    beats,
    accent,
    volume,
    sound,
    active,
    onBeat: (beat: number) => setCurrentBeat(beat),
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setActive((prev) => !prev); // toggle safely
        e.preventDefault(); // optional: prevent page scrolling
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center max-h-fit min-h-screen p-8 pb-20 gap-16 sm:p-20 overflow-hidden">
      <main className="flex flex-col gap-10 row-start-2 items-center justify-center min-h-screen max-h-fit">
        <div className="font-sans min-h-screen max-h-fit p-4 sm:p-8 flex flex-col items-center bg-black">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:gap-8 gap-4 items-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-white">Beats</p>
              <BeatsSelector beats={beats} setBeats={setBeats} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-white">Accent</p>
              <button
                onClick={() => setAccent(!accent)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors outline-2
                ${accent ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-black text-white hover:bg-gray-800"}`}
              >
                {accent ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/*   Beat indicators */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 mt-2">
            {Array.from({ length: beats }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rotate-45 mx-2 my-1 outline-2 ${!active
                  ? "bg-gray-400"
                  : i === currentBeat
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

          {/* Tempo Slider */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md px-4 pb-4">
            <TempoSlider
              value={tempo}
              minValue={MIN_TEMPO}
              maxValue={MAX_TEMPO}
              lowerValue={decreaseTempo}
              increaseValue={increaseTempo}
              setValue={setTempo}
            />
            <p className="font-bold text-3xl text-center text-white">
              {tempo} BPM
            </p>
          </div>

          <VolumeSlider value={volume} minValue={0} maxValue={200} setValue={setVolume} />
          <SoundSelector value={sound} setValue={setSound} />
        </div>
      </main>
    </div>
  );
}
