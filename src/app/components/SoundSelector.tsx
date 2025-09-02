"use client";
import { useEffect, useRef, useState } from "react";
import options from "../soundList.json";

type Props = {
    value: string;
    setValue: (v: string) => void;
};

export default function SoundSelector({ value, setValue }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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
        <div ref={ref} className="relative flex justify-center my-2 w-full">
            <button
                ref={buttonRef}
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-row items-center px-4 py-2 rounded-lg transition-colors duration-300 border"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-neutral)'
                } as React.CSSProperties}
            >
                <span className="mr-2">Sound:</span>
                <span className="font-semibold">{value || "Select Sound"}</span>
                <svg
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: 'var(--color-text)' } as React.CSSProperties}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div
                    className="absolute top-full mt-1 w-full max-w-xs rounded-lg shadow-lg z-10 flex flex-col transition-colors duration-300 border overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-bg-light)',
                        color: 'var(--color-text)',
                        borderColor: 'var(--color-neutral)'
                    } as React.CSSProperties}
                >
                    <div className="overflow-y-auto max-h-60"> {/* Scrollable container with max height */}
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    setValue(opt);
                                    setOpen(false);
                                }}
                                className="px-4 py-2 text-left transition-colors duration-300 hover:bg-opacity-80 w-full"
                                style={
                                    value === opt
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
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}