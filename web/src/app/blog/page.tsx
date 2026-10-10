export default async function BlogIndex() {
  const posts = [
    {
      slug: "how-to-read-donutsmp-prices",
      title: "How to read DonutSMP prices without lying to yourself",
      excerpt:
        "A listing is an ask. A sale is an acceptance. Most traders lose money treating the first as the second — here's how to tell the difference on a live market.",
      read: "6 min",
      date: "2026-09-28",
    },
    {
      slug: "auction-house-mechanics",
      title: "The auction house, explained properly",
      excerpt:
        "Listings, undercutting, stack size, and why a cheap full stack often beats an expensive single.",
      read: "8 min",
      date: "2026-09-22",
    },
    {
      slug: "what-inflation-does-to-a-server-economy",
      title: "What inflation does to a server economy",
      excerpt:
        "When money is earned faster than it is spent, prices drift. This is how that shows up in a Minecraft server's auction house.",
      read: "7 min",
      date: "2026-09-15",
    },
    {
      slug: "regions-and-why-ping-is-economics",
      title: "Regions, and why ping is an economic variable",
      excerpt:
        "Spawner profit per hour depends on tick rate. Where you log in decides what an hour of grinding is worth.",
      read: "5 min",
      date: "2026-09-08",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <div className="rule-gold pt-3">
        <div className="label mb-3">Blog</div>
        <h1 className="text-[34px] font-semibold tracking-tight">Guides &amp; notes</h1>
        <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Written from the data we collect. No affiliate links, no invented tips.
        </p>
      </div>

      <div className="mt-9 grid gap-px" style={{ background: "var(--line)" }}>
        {posts.map((p) => (
          <article key={p.slug} className="p-7 transition-colors hover:bg-[var(--surface2)]"
            style={{ background: "var(--bg)" }}>
            <div className="num mb-2 flex gap-4 text-[11px]" style={{ color: "var(--dim)" }}>
              <span>{p.date}</span>
              <span>{p.read} read</span>
            </div>
            <h2 className="text-[20px] font-semibold tracking-tight">{p.title}</h2>
            <p className="mt-2.5 max-w-[68ch] text-[13.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
              {p.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}