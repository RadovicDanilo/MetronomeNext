"use client";
import { useEffect, useRef, useCallback } from "react";

type Props = {
    value: number;
    minValue: number;
    maxValue: number;
    lowerValue: () => void;
    increaseValue: () => void;
    setValue: (v: number) => void;
};

export default function TempoSlider({
    value,
    minValue,
    maxValue,
    lowerValue,
    increaseValue,
    setValue,
}: Props) {
    const percent = ((value - minValue) / (maxValue - minValue)) * 100;
    const intervalRef = useRef<number | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    const lastChangeRef = useRef<number>(0);
    const THROTTLE_MS = 50;

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") lowerValue();
            if (e.key === "ArrowRight" || e.key === "ArrowUp") increaseValue();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [increaseValue, lowerValue]);

    const startCount = useCallback((fn: () => void) => {
        const now = Date.now();
        if (now - lastChangeRef.current < THROTTLE_MS) return;
        lastChangeRef.current = now;

        fn();
        if (intervalRef.current !== null) return;
        intervalRef.current = window.setInterval(() => {
            const now = Date.now();
            if (now - lastChangeRef.current >= THROTTLE_MS) {
                fn();
                lastChangeRef.current = now;
            }
        }, 100);
    }, []);

    const stopCount = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
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
        <div className="flex items-center gap-2 w-72 select-none">
            <button
                onMouseDown={() => startCount(lowerValue)}
                onMouseUp={stopCount}
                onMouseLeave={(e) => {
                    stopCount();
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                }}
                className="px-3 py-1 rounded transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)',
                    outline: "1px solid var(--color-bg-content)"
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light-hover)';
                }}
            >
                {"<"}
            </button>

            <div className="flex-1 cursor-pointer">
                <div
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                    className="relative h-2.5 rounded transition-colors duration-300"
                    style={{ backgroundColor: 'var(--color-neutral)' } as React.CSSProperties}
                >
                    <div
                        className="absolute top-0 h-2.5 rounded transition-colors duration-300"
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
            </div>

            <button
                onMouseDown={() => startCount(increaseValue)}
                onMouseUp={stopCount}
                onMouseLeave={(e) => {
                    stopCount();
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                }}
                className="px-3 py-1 rounded transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    color: 'var(--color-text)',
                    outline: "1px solid var(--color-bg-content)"
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-light-hover)';
                }}
            >
                {">"}
            </button>
        </div>
    );
}