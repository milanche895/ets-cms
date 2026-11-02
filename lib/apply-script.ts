import type { SiteScript } from "@/lib/site-script";
import { hasCyrillic, toLatin } from "@/lib/transliterate";

export const TRANSLATED_ATTRIBUTES = ["alt", "title", "placeholder", "aria-label", "aria-description", "aria-placeholder"] as const;

const SKIP_TEXT = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE", "NOSCRIPT", "TEMPLATE"]);

const textOriginals = new WeakMap<Text, string>();
const attributeOriginals = new WeakMap<Element, Map<string, string>>();

let latinApplied = false;

function skipText(element: Element) {
  return Boolean(element.closest("[data-script-ignore]")) || SKIP_TEXT.has(element.tagName) || element.isContentEditable;
}

function syncText(node: Text, script: SiteScript) {
  const parent = node.parentElement;
  if (!parent || skipText(parent)) return;

  const current = node.nodeValue ?? "";
  if (hasCyrillic(current)) textOriginals.set(node, current);

  const original = textOriginals.get(node);
  if (original == null) return;

  const next = script === "lat" ? toLatin(original) : original;
  if (current !== next) node.nodeValue = next;
}

function syncAttributes(element: Element, script: SiteScript) {
  if (element.closest("[data-script-ignore]")) return;

  for (const name of TRANSLATED_ATTRIBUTES) {
    const current = element.getAttribute(name);
    if (current == null) continue;

    let originals = attributeOriginals.get(element);
    if (!originals) {
      originals = new Map();
      attributeOriginals.set(element, originals);
    }

    if (hasCyrillic(current)) originals.set(name, current);

    const original = originals.get(name);
    if (original == null) continue;

    const next = script === "lat" ? toLatin(original) : original;
    if (current !== next) element.setAttribute(name, next);
  }
}

export function applySiteScript(root: ParentNode, script: SiteScript) {
  if (script === "cyr" && !latinApplied) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    syncText(current as Text, script);
    current = walker.nextNode();
  }

  const scope = root instanceof Document ? root.documentElement : root instanceof Element ? root : null;
  if (scope) {
    syncAttributes(scope, script);
    scope.querySelectorAll("*").forEach((element) => syncAttributes(element, script));
  }

  latinApplied = script === "lat";
}
