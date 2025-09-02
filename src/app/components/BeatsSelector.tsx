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

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)'
                } as React.CSSProperties}
            >
                {beats}
            </button>

            {open && (
                <div
                    className="absolute mt-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 rounded shadow-lg px-2 py-1 z-10 max-w-[90vw] transition-colors duration-300"
                    style={{
                        backgroundColor: 'var(--color-bg-light)',
                        border: '1px solid var(--color-neutral)'
                    } as React.CSSProperties}
                >
                    {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => {
                                setBeats(num);
                                setOpen(false);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors duration-300"
                            style={
                                num === beats
                                    ? {
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-primary-content)'
                                    } as React.CSSProperties
                                    : {
                                        backgroundColor: 'var(--color-bg-light)',
                                        color: 'var(--color-text)'
                                    } as React.CSSProperties
                            }
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}