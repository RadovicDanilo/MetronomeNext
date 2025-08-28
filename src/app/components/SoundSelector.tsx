"use client";
import { useState, useEffect } from "react";

type Props = {
    value: string;
    setValue: (v: string) => void;
};

export default function SoundSelector({ value, setValue }: Props) {
    const [options, setOptions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch("/api/beats")
            .then((res) => res.json())
            .then((data) => setOptions(data))
            .catch(console.error);
    }, []);

    return (
        <div className="relative inline-block my-2">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-row px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
            >
                Sound type: <p className="font-bold px-2">{value || "Select Sound"}</p>
            </button>

            {open && (
                <div className="absolute mt-2 left-0 w-40 bg-black text-white rounded shadow-lg z-10 flex flex-col">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                setValue(opt);
                                setOpen(false);
                            }}
                            className={`px-2 py-1 text-left hover:bg-gray-700 ${value === opt ? "bg-blue-500" : ""
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
