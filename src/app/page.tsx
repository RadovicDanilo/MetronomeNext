"use client";
import { useEffect, useState } from "react";
import useMetronome from "./hooks/useMetronome";
import TempoSlider from "@/app/components/TempoSlider";
import BeatsSelector from "./components/BeatsSelector";
import useLocalStorageState from "use-local-storage-state";
import VolumeSlider from "./components/VolumeSlider";
import SoundSelector from "./components/SoundSelector";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./style/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [tempo, setTempo] = useLocalStorageState("tempo", { defaultValue: 160 });
  const [beats, setBeats] = useLocalStorageState("beats", { defaultValue: 4 });
  const [accent, setAccent] = useLocalStorageState("accent", { defaultValue: true });
  const [volume, setVolume] = useLocalStorageState("volume", { defaultValue: 50 });
  const [sound, setSound] = useLocalStorageState("sound", { defaultValue: "Ableton" });

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
        setActive((prev) => !prev);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main
      className="flex flex-col items-center justify-center w-full min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' } as React.CSSProperties}
    >
      <div
        className="font-sans p-4 sm:p-8 flex flex-col items-center w-full max-w-3xl transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-bg)' } as React.CSSProperties}
      >
        {/* Controls */}
        <div className="flex flex-row sm:flex-row sm:gap-8 gap-4 items-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <p
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: 'var(--color-text)' } as React.CSSProperties}
            >
              Beats
            </p>
            <BeatsSelector beats={beats} setBeats={setBeats} />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: 'var(--color-text)' } as React.CSSProperties}
            >
              Accent
            </p>
            <button
              onClick={() => setAccent(!accent)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold outline-2 transition-all duration-300 hover:scale-105"
              style={
                accent
                  ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-content)'
                  } as React.CSSProperties
                  : {
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)'
                  } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                if (accent) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                } else {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (accent) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                } else {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                }
              }}
            >
              {accent ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Beat indicators */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 mt-2">
          {Array.from({ length: beats }, (_, i) => (
            <div
              key={i}
              className="w-6 h-6 rotate-45 mx-2 my-1 transition-colors duration-300"
              style={
                !active
                  ? {
                    backgroundColor: 'var(--color-neutral)',
                    outline: '2px solid var(--color-bg-content)'
                  } as React.CSSProperties
                  : i === currentBeat
                    ? {
                      backgroundColor: 'var(--color-error)',
                      outline: '2px solid var(--color-error-hover)'
                    } as React.CSSProperties
                    : {
                      backgroundColor: 'var(--color-primary)',
                      outline: '2px solid var(--color-primary-hover)'
                    } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Start / Pause button */}
        <button
          onClick={() => setActive(!active)}
          className="px-6 py-2 mt-10 mb-6 rounded-full font-semibold transition-colors duration-300"
          style={
            active
              ? {
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-error-content)'
              } as React.CSSProperties
              : {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-content)'
              } as React.CSSProperties
          }
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
          <p
            className="font-bold text-3xl text-center transition-colors duration-300"
            style={{ color: 'var(--color-text)' } as React.CSSProperties}
          >
            {tempo} BPM
          </p>
        </div>

        <VolumeSlider value={volume} minValue={0} maxValue={150} setValue={setVolume} />
        <SoundSelector value={sound} setValue={setSound} />
      </div>

      {/* Theme toggle */}
      <button
        className="fixed w-10 h-10 top-5 left-5 rounded-full flex items-center justify-center shadow-md transition-colors duration-300"
        style={{
          backgroundColor: 'var(--color-neutral)',
          color: 'var(--color-neutral-content)',
        } as React.CSSProperties}
        onClick={toggleTheme}
      >
        {theme === "dark-blue" ? <FiSun size={22} /> : <FiMoon size={22} />}
      </button>
    </main >
  );
}