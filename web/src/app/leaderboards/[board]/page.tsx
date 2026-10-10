import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { Breadcrumb, PageHead, formatMoney, formatNum } from "@/components/ui";
import { BOARDS, PLAYERS, boardValue, type BoardKey } from "@/lib/data";
import { playerHead } from "@/lib/items";

import { live } from "@/lib/read";
export const instant = false;

export function generateStaticParams() {
  return BOARDS.map((b) => ({ board: b.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const b = BOARDS.find((x) => x.key === board);
  if (!b) return { title: "Board not found" };
  return {
    title: `DonutSMP ${b.label} Leaderboard — Top 100`,
    description: b.desc,
  };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  await live();
  const { board } = await params;
  const b = BOARDS.find((x) => x.key === board);
  if (!b) notFound();

  const ranked = PLAYERS.slice()
    .sort((x, y) => boardValue(y, b.key as BoardKey) - boardValue(x, b.key as BoardKey))
    .map((p, i) => ({ p, rank: i + 1, value: boardValue(p, b.key as BoardKey) }));

  const fmt = (v: number) => (b.key === "playtime" ? `${v.toLocaleString()} days` : b.unit === "$" ? formatMoney(v) : formatNum(v));

  return (
    <>
      <TopNav />
      <Ticker items={PLAYERS.slice(0, 8).map((p) => ({ name: p.name, price: p.money, ch: 0 }))} />

      <div className="mx-auto max-w-[1400px] px-5 pt-8">
        <Breadcrumb trail={[["Leaderboards", "/leaderboards"], [b.label, `/leaderboards/${b.key}`]]} />

        <PageHead eyebrow={`${PLAYERS.length} tracked · top 100 live`} title={`${b.label} leaderboard`} lede={b.desc} />

        {/* Ranked list */}
        <div className="mt-7 space-y-0" style={{ border: "1px solid var(--line)" }}>
          {ranked.map(({ p, rank, value }) => (
            <Link
              key={p.name}
              href={`/players/${p.name}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[var(--surface2)]"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <span
                className="num w-8 shrink-0 text-right text-[13px]"
                style={{ color: rank <= 3 ? "var(--gold)" : "var(--dim)" }}
              >
                {rank}
              </span>
              <img
                src={playerHead(p.name, 40)} alt="" width={30} height={30}
                className="shrink-0 rounded-[2px]" style={{ imageRendering: "pixelated" }}
              />
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{p.name}</span>
              <span className="num shrink-0 text-[14px] font-medium">{fmt(value)}</span>
            </Link>
          ))}
        </div>

        {/* Other boards */}
        <div className="mt-12">
          <div className="label mb-3">Other boards</div>
          <div className="flex flex-wrap gap-1.5">
            {BOARDS.filter((x) => x.key !== b.key).map((x) => (
              <Link
                key={x.key}
                href={`/leaderboards/${x.key}`}
                className="num px-2.5 py-1 text-[12px] transition-colors hover:text-[var(--ink)]"
                style={{ color: "var(--muted)", border: "1px solid var(--line)" }}
              >
                {x.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}