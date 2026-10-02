export function Avatar({
  url,
  name,
  size = 40,
  className = "",
}: {
  url?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const initial = (name[0] ?? "?").toUpperCase();
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`Avatar ${name}`}
        width={size}
        height={size}
        className={`shrink-0 rounded-full border border-ink-500 object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full border border-ink-500 bg-ink-700 font-code text-emas-400 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {initial}
    </div>
  );
}
