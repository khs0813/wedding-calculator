import { writeFileSync } from "node:fs";

const publisherId = process.env.ADSENSE_PUBLISHER_ID?.trim();
const adsTxtPath = "public/ads.txt";

const content = publisherId
  ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
  : [
      "# Add ADSENSE_PUBLISHER_ID=pub-0000000000000000 before building for AdSense review.",
      "# Google recommends ads.txt, but the publisher ID must match your AdSense account.",
      "",
    ].join("\n");

writeFileSync(adsTxtPath, content, "utf8");
