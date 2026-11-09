"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { applySiteScript, TRANSLATED_ATTRIBUTES } from "@/lib/apply-script";
import { writeScriptCookie, type SiteScript } from "@/lib/site-script";

type ScriptContextValue = {
  script: SiteScript;
  setScript: (script: SiteScript) => void;
};

const ScriptContext = createContext<ScriptContextValue | null>(null);
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useSiteScript() {
  const value = useContext(ScriptContext);
  if (!value) {
    throw new Error("Прекидач писма мора бити унутар ScriptProvider.");
  }
  return value;
}

function markReady(script: SiteScript) {
  const root = document.documentElement;
  root.lang = script === "lat" ? "sr-Latn" : "sr";
  root.classList.toggle("pismo-lat", script === "lat");
  root.classList.add("pismo-spremno");
}

export function ScriptProvider({ initialScript, children }: { initialScript: SiteScript; children: ReactNode }) {
  const pathname = usePathname();
  const [script, setScriptState] = useState<SiteScript>(initialScript);
  const enabled = !pathname.startsWith("/admin");

  useIsoLayoutEffect(() => {
    const activeScript: SiteScript = enabled ? script : "cyr";

    try {
      applySiteScript(document, activeScript);
    } finally {
      markReady(activeScript);
    }

    if (activeScript !== "lat") return;

    const options: MutationObserverInit = {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATED_ATTRIBUTES],
    };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      try {
        applySiteScript(document, "lat");
      } finally {
        observer.observe(document.documentElement, options);
      }
    });

    observer.observe(document.documentElement, options);

    return () => observer.disconnect();
  }, [enabled, script, pathname]);

  function setScript(next: SiteScript) {
    writeScriptCookie(next);
    setScriptState(next);
  }

  return <ScriptContext.Provider value={{ script, setScript }}>{children}</ScriptContext.Provider>;
}
