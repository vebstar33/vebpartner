import type { Listing } from '../../types/listing';
import { FinancialModel } from './FinancialModel';
import { OpportunityChart } from './OpportunityChart';

type ListingDetailTemplateProps = {
  listing: Listing;
};

export function ListingDetailTemplate({ listing }: ListingDetailTemplateProps) {
  const primaryUrl = listing.partnerUrl || listing.websiteUrl;

  return (
    <main className="shell listing-detail-page">
      <div className="listing-detail-grid">
        <header className="listing-detail-hero" data-area="hero">
          <div className="listing-detail-logo" aria-hidden={!listing.logoUrl}>
            {listing.logoUrl ? (
              <img src={listing.logoUrl} alt="" />
            ) : (
              <span>{listing.name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          <div className="listing-detail-heading-copy">
            <p className="listing-detail-eyebrow">{listing.category}</p>
            <h1>{listing.name}</h1>
            <p className="listing-detail-tagline">{listing.tagline}</p>
          </div>
        </header>

        <aside className="listing-detail-actions" data-area="actions">
          <a className="primary-cta" href={primaryUrl} target="_blank" rel="noreferrer sponsored">
            Besök möjligheten
          </a>
          <a className="secondary-cta" href={listing.websiteUrl} target="_blank" rel="noreferrer">
            Officiell webbplats
          </a>
        </aside>

        <section className="listing-detail-meta" data-area="meta" aria-label="Grundinformation">
          <dl>
            <div>
              <dt>Typ</dt>
              <dd>{listing.opportunityType}</dd>
            </div>
            <div>
              <dt>Geografi</dt>
              <dd>{listing.geography.length ? listing.geography.join(', ') : 'Ej angivet'}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>{listing.category}</dd>
            </div>
          </dl>
        </section>

        <div data-area="chart">
          <OpportunityChart metrics={listing.chartMetrics} />
        </div>

        <article className="listing-detail-description detail-section" data-area="description">
          <div className="detail-section-heading">
            <p className="detail-kicker">Om möjligheten</p>
            <h2>Översikt</h2>
          </div>
          <p>{listing.description}</p>
        </article>

        <div data-area="financial">
          <FinancialModel
            startupCost={listing.startupCost}
            revenueModel={listing.revenueModel}
            typicalMargin={listing.typicalMargin}
            timeToLaunch={listing.timeToLaunch}
          />
        </div>

        <section className="detail-section" data-area="highlights">
          <div className="detail-section-heading">
            <p className="detail-kicker">Styrkor</p>
            <h2>Viktiga punkter</h2>
          </div>
          {listing.highlights?.length ? (
            <ul className="clean-list">
              {listing.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          ) : (
            <p className="empty-copy">Inga särskilda höjdpunkter angivna.</p>
          )}
        </section>

        <section className="detail-section" data-area="requirements">
          <div className="detail-section-heading">
            <p className="detail-kicker">Krav</p>
            <h2>Vad som behövs</h2>
          </div>
          {listing.requirements?.length ? (
            <ul className="clean-list">
              {listing.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
            </ul>
          ) : (
            <p className="empty-copy">Inga särskilda krav angivna.</p>
          )}
        </section>
      </div>
    </main>
  );
}
