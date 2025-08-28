"use client";
import { useEffect, useRef } from "react";
import Metronome from "../lib/Metronome";

export default function useMetronome({
    tempo,
    beats,
    accent,
    volume,
    sound,
    active,
    onBeat,
}: {
    tempo: number;
    beats: number;
    accent: boolean;
    volume: number;
    sound: string;
    active: boolean;
    onBeat: (beat: number) => void;
}) {
    const metronomeRef = useRef<Metronome | null>(null);

    useEffect(() => {
        const metronome = new Metronome(tempo, beats, accent, sound, volume, onBeat);
        metronomeRef.current = metronome;
        return () => {
            metronomeRef.current?.toggle();
        };
    }, []);

    useEffect(() => { metronomeRef.current?.setTempo(tempo); }, [tempo]);
    useEffect(() => { metronomeRef.current?.setBeatsPerMeasure(beats); }, [beats]);
    useEffect(() => { metronomeRef.current?.setAccentEnabled(accent); }, [accent]);
    useEffect(() => { metronomeRef.current?.setVolume(volume); }, [volume]);
    useEffect(() => { metronomeRef.current?.loadSoundSet(sound); }, [sound]);
    useEffect(() => {
        if (!metronomeRef.current) return;
        if (active !== metronomeRef.current["isPlaying"]) metronomeRef.current.toggle();
    }, [active]);
}
