const categories = [
  'Franchise',
  'Reseller',
  'Distributor',
  'White Label',
  'Agency Partner',
  'Referral Partner',
  'API-powered Business',
  'Dropshipping Supplier',
];

export default function HomePage() {
  return (
    <main>
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="shell" style={{ minHeight: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <strong style={{ fontSize: 20, letterSpacing: '-0.03em' }}>Vebpartner</strong>
          <nav style={{ display: 'flex', gap: 24, fontSize: 14 }}>
            <a href="#opportunities">Opportunities</a>
            <a href="#categories">Categories</a>
            <a href="/submit">Submit</a>
          </nav>
        </div>
      </header>

      <section className="shell" style={{ paddingBlock: 72 }}>
        <div style={{ maxWidth: 760 }}>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>BUSINESS OPPORTUNITY DIRECTORY</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(42px, 7vw, 76px)', lineHeight: 0.98, letterSpacing: '-0.055em', fontWeight: 650 }}>
            Find a business opportunity worth building.
          </h1>
          <p style={{ margin: '24px 0 0', maxWidth: 620, color: 'var(--muted)', fontSize: 18, lineHeight: 1.6 }}>
            Vebpartner discovers, verifies and structures real opportunities people can use to start or expand a business.
          </p>
        </div>

        <form action="/search" style={{ marginTop: 36, maxWidth: 760, display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <input name="q" aria-label="Search opportunities" placeholder="Search opportunities, business models or companies" style={{ flex: 1, minWidth: 0, border: 0, outline: 0, padding: '16px 18px', background: 'transparent' }} />
          <button type="submit" style={{ border: 0, borderLeft: '1px solid var(--border)', background: 'var(--foreground)', color: 'white', paddingInline: 22, cursor: 'pointer' }}>Search</button>
        </form>
      </section>

      <section id="categories" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="shell" style={{ paddingBlock: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {categories.map((category) => (
            <a key={category} href={`/categories/${category.toLowerCase().replaceAll(' ', '-')}`} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', background: 'white', fontSize: 14 }}>
              {category}
            </a>
          ))}
        </div>
      </section>

      <section id="opportunities" className="shell" style={{ paddingBlock: 64 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.035em' }}>Featured opportunities</h2>
          <a href="/opportunities" style={{ color: 'var(--muted)', fontSize: 14 }}>View all</a>
        </div>
        <div data-ui="card" style={{ minHeight: 180, padding: 24, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
          Listings will render here from Supabase using one fixed reusable card component.
        </div>
      </section>
    </main>
  );
}
