import type { Listing } from '@/types/listing';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article data-ui="card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr) auto', gap: 16, alignItems: 'start' }}>
      <div aria-hidden="true" style={{ width: 56, height: 56, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', overflow: 'hidden' }}>
        {listing.logoUrl ? <img src={listing.logoUrl} alt="" width={56} height={56} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      </div>

      <div style={{ minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.25, letterSpacing: '-0.02em' }}>{listing.name}</h3>
        <p style={{ margin: '7px 0 0', color: 'var(--muted)', lineHeight: 1.5, fontSize: 14 }}>{listing.tagline}</p>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 12, color: 'var(--muted)', fontSize: 12 }}>
          <span>{listing.opportunityType}</span>
          <span>·</span>
          <span>{listing.category}</span>
          {listing.geography[0] ? <><span>·</span><span>{listing.geography[0]}</span></> : null}
        </div>
      </div>

      <a href={`/opportunities/${listing.slug}`} style={{ alignSelf: 'center', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 13, whiteSpace: 'nowrap' }}>
        View
      </a>
    </article>
  );
}
