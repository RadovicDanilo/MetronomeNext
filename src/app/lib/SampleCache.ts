import { openDB } from 'idb';

const DB_NAME = 'audio-cache';
const STORE_NAME = 'samples';
const MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

async function getDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

async function getCachedSample(url: string): Promise<ArrayBuffer | null> {
    const db = await getDB();
    const entry = await db.get(STORE_NAME, url);
    if (!entry) return null;

    const { data, timestamp } = entry;
    if (Date.now() - timestamp > MAX_AGE) {
        await db.delete(STORE_NAME, url);
        return null;
    }
    return data;
}

async function setCachedSample(url: string, data: ArrayBuffer) {
    const db = await getDB();
    await db.put(STORE_NAME, { data, timestamp: Date.now() }, url);
}

export default class SampleCache {
    private memoryCache = new Map<string, AudioBuffer>();

    constructor(private audioContext: AudioContext) { }

    async loadSample(url: string): Promise<AudioBuffer> {
        if (this.memoryCache.has(url)) {
            return this.memoryCache.get(url)!;
        }

        // Try IndexedDB
        let arrayBuffer = await getCachedSample(url);

        if (!arrayBuffer) {
            const response = await fetch(url);
            arrayBuffer = await response.arrayBuffer();
            await setCachedSample(url, arrayBuffer);
        }

        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.memoryCache.set(url, audioBuffer);
        return audioBuffer;
    }
}
