import { writeFileSync } from "node:fs";

const adsTxtPath = "public/ads.txt";

const content = [
  "# Coupang Partners does not require an ads.txt entry for this integration.",
  "# Keep this file intentionally empty unless another ad partner requires it.",
  "",
].join("\n");

writeFileSync(adsTxtPath, content, "utf8");
