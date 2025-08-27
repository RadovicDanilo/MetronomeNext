import { useState } from "react";

export default function BeatsSelector({
    beats,
    setBeats,
}: {
    beats: number;
    setBeats: (b: number) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            {/* Circular button showing current beats */}
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-black outline-2 flex items-center justify-center hover:bg-gray-800 text-sm font-semibold"
            >
                {beats}
            </button>

            {/* Horizontal flyout */}
            {open && (
                <div className="absolute mt-2 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-black border outline rounded shadow-lg px-2 py-1 z-10">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => {
                                setBeats(num);
                                setOpen(false);
                            }}
                            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 text-sm font-medium ${num === beats ? "bg-blue-500 text-white" : "bg-black text-white"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
