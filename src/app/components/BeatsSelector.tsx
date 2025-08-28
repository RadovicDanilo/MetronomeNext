"use client";
import { useState, useRef, useEffect } from "react";

export default function BeatsSelector({
    beats,
    setBeats,
}: {
    beats: number;
    setBeats: (b: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Close on escape 
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <div ref={ref} className="">
            {/* Circular button showing current beats */}
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 text-sm font-semibold text-white"
            >
                {beats}
            </button>

            {/* Horizontal flyout */}
            {open && (
                <div className="absolute mt-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 bg-black border rounded shadow-lg px-2 py-1 z-10 max-w-[90vw]">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => {
                                setBeats(num);
                                setOpen(false);
                            }}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors
                ${num === beats ? "bg-blue-500 text-white" : "bg-black text-white hover:bg-gray-700"}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
