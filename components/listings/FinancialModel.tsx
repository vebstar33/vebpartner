import type { Listing } from '../../types/listing';

type FinancialModelProps = Pick<
  Listing,
  'startupCost' | 'revenueModel' | 'typicalMargin' | 'timeToLaunch'
>;

const rows = [
  ['Startkostnad', 'startupCost'],
  ['Intäktsmodell', 'revenueModel'],
  ['Typisk marginal', 'typicalMargin'],
  ['Tid till lansering', 'timeToLaunch'],
] as const;

export function FinancialModel(props: FinancialModelProps) {
  return (
    <section className="detail-section" aria-labelledby="financial-model-title">
      <div className="detail-section-heading">
        <p className="detail-kicker">Ekonomi</p>
        <h2 id="financial-model-title">Financial Model &amp; Unit Economics</h2>
      </div>

      <dl className="financial-grid">
        {rows.map(([label, key]) => (
          <div className="financial-cell" key={key}>
            <dt>{label}</dt>
            <dd>{props[key] || 'Ej angivet'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
