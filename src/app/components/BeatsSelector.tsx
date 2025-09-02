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
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 outline-2 hover:scale-105"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light-hover)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                }}
            >
                {beats}
            </button>

            {open && (
                <div
                    className="absolute mt-2 left-1/2 -translate-x-1/2 w-max flex flex-wrap max-w-[90vw] justify-center items-center gap-2 rounded-full shadow-lg px-4 py-3 z-10 transition-colors duration-300"
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
                            className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 hover:scale-110"
                            style={
                                num === beats
                                    ? {
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-primary-content)'
                                    } as React.CSSProperties
                                    : {
                                        backgroundColor: 'var(--color-bg-lighter)',
                                        color: 'var(--color-text)'
                                    } as React.CSSProperties
                            }
                            onMouseEnter={(e) => {
                                if (num !== beats) {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                                    e.currentTarget.style.color = 'var(--color-primary-content)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (num !== beats) {
                                    e.currentTarget.style.backgroundColor = 'var(--color-bg-lighter)';
                                    e.currentTarget.style.color = 'var(--color-text)';
                                }
                            }}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}