export function formatDate(value: string | null): string {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("sr-Cyrl-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
