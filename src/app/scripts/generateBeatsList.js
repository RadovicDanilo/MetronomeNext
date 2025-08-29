/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const beatsDir = path.join(process.cwd(), "public", "beats");

const folders = fs
  .readdirSync(beatsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

fs.writeFileSync(
  path.join(process.cwd(), "src/app/beatsList.json"),
  JSON.stringify(folders, null, 2)
);

console.log("Generated beatsList.json:", folders);
