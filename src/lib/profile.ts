export const NAME_COLORS = {
  emas: "#E9B44C",
  mint: "#7ADFA8",
  langit: "#7FB6E9",
  rose: "#E98AA8",
  lavender: "#B9A6E9",
  koral: "#F08A6B",
  limau: "#C9E96B",
  perak: "#DCD8D0",
} as const;

export type NameColorKey = keyof typeof NAME_COLORS;

export const NAME_EFFECTS = ["normal", "pixel", "glitch"] as const;
export type NameEffect = (typeof NAME_EFFECTS)[number];

export function isNameColor(x: string): x is NameColorKey {
  return x in NAME_COLORS;
}

export function isNameEffect(x: string): x is NameEffect {
  return (NAME_EFFECTS as readonly string[]).includes(x);
}
