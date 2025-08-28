import fs from "fs";
import path from "path";

export async function GET() {
    const beatsDir = path.join(process.cwd(), "public/beats");
    let folders: string[] = [];

    try {
        folders = fs.readdirSync(beatsDir).filter((f) =>
            fs.statSync(path.join(beatsDir, f)).isDirectory()
        );
    } catch (err) {
        console.error(err);
    }

    return new Response(JSON.stringify(folders), {
        headers: { "Content-Type": "application/json" },
    });
}
