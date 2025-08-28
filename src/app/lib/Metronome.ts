export default class Metronome {
    private audioContext: AudioContext;

    private tempo: number;
    private beatsPerMeasure: number;
    private accentEnabled: boolean;
    private volume: number;

    private isPlaying: boolean = false;
    private currentBeat: number = -1;
    private nextNoteTime: number = 0;
    private readonly lookAheadSec: number = 0.1; // 100ms
    private readonly scheduleIntervalMs: number = 25;

    private normalBuffer: AudioBuffer | null = null;
    private accentBuffer: AudioBuffer | null = null;

    private onBeat?: (beatIndex: number) => void;

    constructor(
        tempo: number,
        beatsPerMeasure: number,
        accentEnabled: boolean,
        sound: string,
        volume: number,
        onBeat: (beatIndex: number) => void,
    ) {
        this.audioContext = new window.AudioContext();
        this.tempo = tempo;
        this.beatsPerMeasure = beatsPerMeasure;
        this.accentEnabled = accentEnabled;
        this.volume = volume;
        this.onBeat = onBeat;

        this.loadSoundSet(sound);
    }

    private async loadSample(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(arrayBuffer);
    }

    async loadSoundSet(name: string) {
        const [normal, accent] = await Promise.all([
            await this.loadSample(`/beats/${name}/A.wav`),
            await this.loadSample(`/beats/${name}/B.wav`),

        ]);
        this.normalBuffer = normal;
        this.accentBuffer = accent;
    }

    toggle() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.currentBeat = -1;
            this.nextNoteTime = this.audioContext.currentTime;
            this.scheduler();
        }
    }

    private scheduler() {
        while (this.nextNoteTime < this.audioContext.currentTime + this.lookAheadSec) {
            this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
            this.onBeat?.(this.currentBeat);

            this.scheduleBeat(this.nextNoteTime);
            this.nextNoteTime += 60 / this.tempo;
        }
        if (this.isPlaying) {
            setTimeout(() => this.scheduler(), this.scheduleIntervalMs);
        }
    }

    private scheduleBeat(time: number) {
        const isAccent = this.accentEnabled && this.currentBeat === 0;
        const buffer = isAccent ? this.accentBuffer : this.normalBuffer;
        if (!buffer) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.volume / 100;

        source.connect(gainNode).connect(this.audioContext.destination);
        source.start(time);
    }

    setTempo(bpm: number) { this.tempo = bpm; }
    setBeatsPerMeasure(beats: number) { this.beatsPerMeasure = beats; }
    setAccentEnabled(enabled: boolean) { this.accentEnabled = enabled; }
    setVolume(vol: number) { this.volume = vol; }
}
