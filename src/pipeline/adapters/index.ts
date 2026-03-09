export { AdapterRegistry } from "./registry.js";
export type { SourceAdapter } from "./types.js";
export { claudeCodeAdapter } from "./claude-code.js";
export { codexAdapter } from "./codex.js";
export { twitterAdapter } from "./twitter.js";
export { youtubeAdapter } from "./youtube.js";
export { openclawAdapter } from "./openclaw.js";

import { AdapterRegistry } from "./registry.js";
import { claudeCodeAdapter } from "./claude-code.js";
import { codexAdapter } from "./codex.js";
import { twitterAdapter } from "./twitter.js";
import { youtubeAdapter } from "./youtube.js";
import { openclawAdapter } from "./openclaw.js";

/** Pre-configured registry with all built-in source adapters. */
export const defaultRegistry = new AdapterRegistry();
defaultRegistry.register(claudeCodeAdapter);
defaultRegistry.register(codexAdapter);
defaultRegistry.register(twitterAdapter);
defaultRegistry.register(youtubeAdapter);
defaultRegistry.register(openclawAdapter);
