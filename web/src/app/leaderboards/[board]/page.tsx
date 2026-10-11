import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav, Ticker, Footer } from "@/components/layout";
import { Breadcrumb, PageHead, formatMoney, formatNum } from "@/components/ui";
import { playerHead } from "@/lib/items";
import { BOARDS, boardRows, marketItems, live } from "@/lib/read";

export const instant = false;

export function generateStaticParams() {
  return BOARDS.map((b) => ({ board: b.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const b = BOARDS.find((x) => x.key === board);
  if (!b) return { title: "Board not found" };
  return { title: `DonutSMP ${b.label} — Top Players`, description: b.desc };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  await live();
  const { board } = await params;
  const b = BOARDS.find((x) => x.key === board);
  if (!b) notFound();

  const { rows, pending } = boardRows(b.key);

  const fmt = (v: number) =>
    b.key === "playtime"
      ? `${v.toLocaleString()}d`
      : b.key === "money" || b.key === "shopspend" || b.key === "sellearned"
        ? formatMoney(v)
        : formatNum(v);

  return (
    <>
      <TopNav />
      <Ticker items={marketItems().slice(0, 9).map((i) => ({ name: i.name, price: i.price, ch: i.ch24h }))} />

      <div className="mx-auto max-w-[1560px] px-4 pt-8">
        <Breadcrumb
          trail={[["Leaderboards", "/leaderboards"], [b.label, `/leaderboards/${b.key}`]]}
        />

        <PageHead eyebrow={pending ? "Awaiting collector data" : `${rows.length} ranked`}
          title={b.label} lede={b.desc} />

        {pending ? (
          <div className="mt-10 border p-8" style={{ borderColor: "var(--line)" }}>
            <div className="badge" style={{ color: "var(--gold)", border: "1px solid var(--line)" }}>
              No data yet
            </div>
            <p className="num mt-4 max-w-[54ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
              This board has no observed values yet. We are not going to fill it with made-up
              numbers — it fills in the moment the collector reports real stats.
            </p>
          </div>
        ) : (
          <div className="mt-7 border" style={{ borderColor: "var(--line)" }}>
            {rows.map(({ p, rank, value }) => (
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
                  src={playerHead(p.name, 40)} alt="" width={28} height={28}
                  className="px shrink-0"
                />
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{p.name}</span>
                {b.key === "views" ? (
                  <span className="num shrink-0 text-[11px]" style={{ color: "var(--dim)" }}>
                    30d
                  </span>
                ) : null}
                <span className="num shrink-0 text-[14px] font-medium">{fmt(value)}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12">
          <div className="label mb-3">Other boards</div>
          <div className="flex flex-wrap gap-1.5">
            {BOARDS.filter((x) => x.key !== b.key).map((x) => (
              <Link
                key={x.key}
                href={`/leaderboards/${x.key}`}
                className={x.pending ? "pill num text-[11px] opacity-50" : "pill num text-[11px]"}
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