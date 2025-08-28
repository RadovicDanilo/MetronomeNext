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

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (trackRef.current && !trackRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
            {/* Volume icon */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 bg-black rounded hover:bg-gray-800 text-white"
            >
                <FiVolume2 size={20} />
            </button>

            {/* Horizontal slider pop-out */}
            {open && (
                <div
                    className="left-full ml-2 w-40 p-2 bg-black rounded shadow-lg flex items-center justify-between"
                >
                    {/* Track container */}
                    <div
                        ref={trackRef}
                        className="relative flex-1 h-2 bg-gray-300 rounded cursor-pointer"
                        onMouseDown={handleMouseDown}
                    >
                        {/* Filled part */}
                        <div
                            className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
                            style={{ width: `${percent}%` }}
                        />
                        {/* Knob */}
                        <div
                            className="absolute top-1/2 w-3 h-3 bg-red-400 rounded-full"
                            style={{ left: `${percent}%`, transform: "translate(-50%, -50%)" }}
                        />
                    </div>

                    {/* Value */}
                    <span className="text-white text-sm w-10 text-right ml-2">{value}</span>
                </div>
            )}
        </div>
    );
}
