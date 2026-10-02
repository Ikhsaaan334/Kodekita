import type { ReactNode } from "react";

function inline(text: string, keyBase: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
      return (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-gading-50">
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
      return (
        <code
          key={`${keyBase}-${i}`}
          className="rounded bg-ink-800 px-1.5 py-0.5 font-code text-[0.9em] text-emas-300"
        >
          {p.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyBase}-${i}`}>{p}</span>;
  });
}

/** Renderer markdown mini untuk statement dan body pelajaran: blok kode, list, paragraf, bold, inline code. */
export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const segments = text.split(/```/g);
  segments.forEach((seg, si) => {
    if (si % 2 === 1) {
      const nl = seg.indexOf("\n");
      const content = nl >= 0 ? seg.slice(nl + 1) : seg;
      blocks.push(
        <pre
          key={`code-${si}`}
          className="overflow-x-auto rounded-xl border border-ink-600 bg-ink-950 p-4 font-code text-[0.85rem] leading-relaxed text-gading-50"
        >
          <code>{content.replace(/\n$/, "")}</code>
        </pre>
      );
      return;
    }
    const lines = seg.split("\n");
    let list: string[] = [];
    const flushList = (key: string) => {
      if (list.length === 0) return;
      blocks.push(
        <ul key={key} className="ml-5 list-disc space-y-1 text-gading-300">
          {list.map((item, li) => (
            <li key={li}>{inline(item, `${key}-${li}`)}</li>
          ))}
        </ul>
      );
      list = [];
    };
    let para: string[] = [];
    const flushPara = (key: string) => {
      if (para.length === 0) return;
      blocks.push(
        <p key={key} className="leading-relaxed text-gading-300">
          {para.map((l, pi) => (
            <span key={pi}>
              {pi > 0 && <br />}
              {inline(l, `${key}-${pi}`)}
            </span>
          ))}
        </p>
      );
      para = [];
    };
    lines.forEach((raw, li) => {
      const line = raw.trim();
      if (line === "") {
        flushList(`l-${si}-${li}`);
        flushPara(`p-${si}-${li}`);
      } else if (line.startsWith("- ")) {
        flushPara(`p-${si}-${li}`);
        list.push(line.slice(2));
      } else {
        flushList(`l-${si}-${li}`);
        para.push(line);
      }
    });
    flushList(`l-${si}-end`);
    flushPara(`p-${si}-end`);
  });
  return <div className="space-y-3 text-[0.95rem]">{blocks}</div>;
}
