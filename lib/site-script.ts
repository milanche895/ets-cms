export const SCRIPT_COOKIE = "ets-pismo";

export type SiteScript = "cyr" | "lat";

export function parseScript(value: string | undefined | null): SiteScript {
  return value === "lat" ? "lat" : "cyr";
}

export function writeScriptCookie(script: SiteScript) {
  document.cookie = `${SCRIPT_COOKIE}=${script}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
