import type { ListingChartMetric } from '../../types/listing';

type OpportunityChartProps = {
  metrics?: ListingChartMetric[];
};

const fallbackMetrics: ListingChartMetric[] = [
  { label: 'Efterfrågan', value: 0 },
  { label: 'Marginal', value: 0 },
  { label: 'Skalbarhet', value: 0 },
  { label: 'Startvänlighet', value: 0 },
  { label: 'Återkommande intäkt', value: 0 },
];

function point(index: number, value: number, total: number, radius = 74) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / total;
  const scaledRadius = radius * Math.max(0, Math.min(100, value)) / 100;
  return {
    x: 100 + Math.cos(angle) * scaledRadius,
    y: 100 + Math.sin(angle) * scaledRadius,
  };
}

export function OpportunityChart({ metrics }: OpportunityChartProps) {
  const normalized = (metrics?.length ? metrics : fallbackMetrics).slice(0, 6);
  const total = normalized.length;
  const polygon = normalized
    .map((metric, index) => point(index, metric.value, total))
    .map(({ x, y }) => `${x},${y}`)
    .join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <section className="opportunity-chart" aria-labelledby="opportunity-chart-title">
      <div className="detail-section-heading compact">
        <p className="detail-kicker">Översikt</p>
        <h2 id="opportunity-chart-title">Möjlighetsprofil</h2>
      </div>

      <div className="chart-frame">
        <svg viewBox="0 0 200 200" role="img" aria-label="Möjlighetsprofil">
          {gridLevels.map((level) => {
            const grid = normalized
              .map((_, index) => point(index, level, total))
              .map(({ x, y }) => `${x},${y}`)
              .join(' ');
            return <polygon key={level} points={grid} className="chart-grid-polygon" />;
          })}

          {normalized.map((_, index) => {
            const edge = point(index, 100, total);
            return (
              <line
                key={index}
                x1="100"
                y1="100"
                x2={edge.x}
                y2={edge.y}
                className="chart-axis"
              />
            );
          })}

          <polygon points={polygon} className="chart-data-polygon" />
          {normalized.map((metric, index) => {
            const dataPoint = point(index, metric.value, total);
            return (
              <circle
                key={metric.label}
                cx={dataPoint.x}
                cy={dataPoint.y}
                r="2.5"
                className="chart-data-point"
              />
            );
          })}
        </svg>
      </div>

      <div className="chart-legend">
        {normalized.map((metric) => (
          <div className="chart-legend-row" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}/100</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
