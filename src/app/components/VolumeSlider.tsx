"use client";
import { useState, useRef, useEffect } from "react";
import { FiVolume2 } from "react-icons/fi";

type Props = {
    value: number;
    minValue: number;
    maxValue: number;
    setValue: (v: number) => void;
};

export default function VolumeSlider({ value, minValue, maxValue, setValue }: Props) {
    const [open, setOpen] = useState(false);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const lastChangeRef = useRef<number>(0);
    const THROTTLE_MS = 50;

    const percent = ((value - minValue) / (maxValue - minValue)) * 100;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (trackRef.current && !trackRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const calcValueFromX = (clientX: number) => {
        const now = Date.now();
        if (now - lastChangeRef.current < THROTTLE_MS) return;
        lastChangeRef.current = now;

        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const newValue = Math.round(minValue + ratio * (maxValue - minValue));
        setValue(newValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        calcValueFromX(e.clientX);

        const handleMove = (ev: MouseEvent) => calcValueFromX(ev.clientX);
        const handleUp = () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleUp);
        };
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleUp);
    };

    return (
        <div className="relative flex items-center my-2">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 rounded transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light-hover)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                }}
            >
                <FiVolume2 size={20} />
            </button>

            {open && (
                <div
                    className="left-full ml-2 w-40 p-2 rounded shadow-lg flex items-center justify-between transition-colors duration-300"
                    style={{
                        backgroundColor: 'var(--color-bg-light)',
                        color: 'var(--color-text)'
                    } as React.CSSProperties}
                >
                    <div
                        ref={trackRef}
                        className="relative flex-1 h-2 rounded cursor-pointer transition-colors duration-300"
                        onMouseDown={handleMouseDown}
                        style={{ backgroundColor: 'var(--color-neutral)' } as React.CSSProperties}
                    >
                        <div
                            className="absolute top-0 left-0 h-2 rounded transition-colors duration-300"
                            style={{
                                width: `${percent}%`,
                                backgroundColor: 'var(--color-primary)'
                            } as React.CSSProperties}
                        />
                        <div
                            className="absolute top-1/2 w-3 h-3 rounded-full transition-colors duration-300"
                            style={{
                                left: `${percent}%`,
                                transform: "translate(-50%, -50%)",
                                backgroundColor: 'var(--color-error)'
                            } as React.CSSProperties}
                        />
                    </div>
                    <span
                        className="text-sm w-10 text-right ml-2 transition-colors duration-300"
                        style={{ color: 'var(--color-text)' } as React.CSSProperties}
                    >
                        {value}
                    </span>
                </div>
            )}
        </div>
    );
}