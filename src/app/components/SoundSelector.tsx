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
        <div ref={ref} className="relative inline-block my-2">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-row px-3 py-1 rounded transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)'
                } as React.CSSProperties}
            >
                Sound type: <p className="font-bold px-2">{value || "Select Sound"}</p>
            </button>

            {open && (
                <div
                    className="absolute mt-2 left-0 w-40 rounded shadow-lg z-10 flex flex-col transition-colors duration-300"
                    style={{
                        backgroundColor: 'var(--color-bg-light)',
                        color: 'var(--color-text)'
                    } as React.CSSProperties}
                >
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                setValue(opt);
                                setOpen(false);
                            }}
                            className="px-2 py-1 text-left transition-colors duration-300"
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
            )}
        </div>
    );
}