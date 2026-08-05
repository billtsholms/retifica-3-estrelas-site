import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

async function fixAll() {
  console.log("Searching for all files with old address across Mac...");
  
  let grepOutput = "";
  try {
    grepOutput = execSync(
      'grep -rn "Aniloel" /Users/victortaveira/Documents /Users/victortaveira/Downloads /Users/victortaveira/Desktop 2>/dev/null | grep -v "node_modules" | grep -v ".Trash"',
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    );
  } catch (e) {
    grepOutput = e.stdout || "";
  }

  const lines = grepOutput.split("\n").filter(Boolean);
  const updatedFiles = new Set();

  for (const line of lines) {
    const filePath = line.split(":")[0];
    if (!filePath || updatedFiles.has(filePath)) continue;

    try {
      let content = await readFile(filePath, "utf-8");
      if (content.includes("Aniloel")) {
        content = content.replaceAll(
          "Av. Dr. Aniloel Nazareth, 2375, em São José do Rio Preto, São Paulo.",
          "R. Dionizio Zacaron, 2375 - Vila Toninho, em São José do Rio Preto - SP, CEP 15062-047."
        );
        content = content.replaceAll(
          "Av. Dr. Aniloel Nazareth, 2375",
          "R. Dionizio Zacaron, 2375 - Vila Toninho"
        );
        content = content.replaceAll(
          "Av.%20Dr.%20Aniloel%20Nazareth%2C%202375",
          "R.%20Dionizio%20Zacaron%2C%202375%20-%20Vila%20Toninho"
        );
        await writeFile(filePath, content, "utf-8");
        updatedFiles.add(filePath);
        console.log("Replaced old address in:", filePath);
      }
    } catch (err) {
      console.error("Could not update:", filePath, err.message);
    }
  }

  console.log(`Finished updating ${updatedFiles.size} files across your computer!`);
}

fixAll().catch((err) => {
  console.error("Error fixing all files:", err);
  process.exit(1);
});
