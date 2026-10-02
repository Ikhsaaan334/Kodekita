import { NAME_COLORS, isNameColor } from "@/lib/profile";

export function NameTag({
  name,
  color,
  effect,
  className = "",
}: {
  name: string;
  color: string;
  effect: string;
  className?: string;
}) {
  const hex = isNameColor(color) ? NAME_COLORS[color] : "#F2EFE9";
  const eff = ["normal", "pixel", "glitch"].includes(effect) ? effect : "normal";
  if (eff === "glitch") {
    return (
      <span className={`nama-glitch font-semibold ${className}`} data-nama={name} style={{ color: hex }}>
        {name}
      </span>
    );
  }
  return (
    <span className={`${eff === "pixel" ? "nama-pixel" : ""} font-semibold ${className}`} style={{ color: hex }}>
      {name}
    </span>
  );
}
