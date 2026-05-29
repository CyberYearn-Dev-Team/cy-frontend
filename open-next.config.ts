import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/dist/api/incremental-cache/r2.js";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache({
    // Disable remote pre-population during deploy
    populateCache: false,
  }),
});
