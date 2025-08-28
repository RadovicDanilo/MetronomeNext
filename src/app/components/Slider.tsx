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

export default function MetronomeSlider({
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

    // Keyboard control
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") lowerValue();
            if (e.key === "ArrowRight" || e.key === "ArrowUp") increaseValue();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [increaseValue, lowerValue]);

    // Button hold-to-repeat
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

    // Calculate value from mouse position
    const calcValueFromX = (clientX: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const newValue = Math.round(minValue + ratio * (maxValue - minValue));
        setValue(newValue);
    };

    // Click + drag on slider track
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
            {/* Decrease button */}
            <button
                onMouseDown={() => startCount(lowerValue)}
                onMouseUp={stopCount}
                onMouseLeave={stopCount}
                className="px-3 py-1 bg-black hover:bg-gray-800 rounded"
            >
                {"<"}
            </button>

            {/* Track */}
            <div className="flex-1 cursor-pointer">
                <div
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                    className="relative h-2.5 bg-gray-300 rounded"
                >
                    <div
                        className="absolute top-0 h-2.5 bg-blue-500 rounded"
                        style={{ width: `${percent}%` }}
                    />
                    {/* Knob */}
                    <div
                        className="absolute top-1/2 w-3 h-3 bg-red-400 rounded-full"
                        style={{ left: `${percent}%`, transform: "translate(-50%, -50%)" }}
                    />
                </div>
            </div>

            {/* Increase button */}
            <button
                onMouseDown={() => startCount(increaseValue)}
                onMouseUp={stopCount}
                onMouseLeave={stopCount}
                className="px-3 py-1 bg-black hover:bg-gray-800 rounded"
            >
                {">"}
            </button>
        </div>
    );
}
