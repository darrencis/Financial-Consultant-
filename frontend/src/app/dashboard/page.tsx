"use client";

// Inline icons (no lucide-react dependency)
function IconDollarSign({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconPlus({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
function IconTrendingUp({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

// Wavy area chart as SVG path (no recharts)
function WavyAreaChart() {
  const width = 600;
  const height = 220;
  const padding = { top: 24, right: 24, bottom: 24, left: 24 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const points = 24;
  const step = chartWidth / (points - 1);

  const linePoints = Array.from({ length: points }, (_, i) => {
    const x = padding.left + i * step;
    const t = i / (points - 1);
    const y =
      padding.top +
      chartHeight * 0.6 -
      Math.sin(t * Math.PI * 2.5) * 35 -
      Math.sin(t * Math.PI * 1.2) * 25 -
      (1 - t) * 20;
    return [x, y];
  });

  const areaPath =
    `M ${linePoints[0]![0]} ${chartHeight + padding.top} L ` +
    linePoints.map(([x, y]) => `${x} ${y}`).join(" L ") +
    ` L ${linePoints[points - 1]![0]} ${chartHeight + padding.top} Z`;

  const linePath =
    "M " + linePoints.map(([x, y]) => `${x} ${y}`).join(" L ");

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="min-h-[220px] w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id="chartGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill="url(#chartGradient)"
        className="transition-opacity duration-200"
      />
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-primary-500)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Circular health score gauge
function HealthGauge({ score = 85, max = 100 }: { score?: number; max?: number }) {
  const radius = 36;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const pct = score / max;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--color-neutral-200)"
          strokeWidth={stroke}
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--color-success-500)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-semibold leading-none text-[var(--color-neutral-900)]">
          {score}
        </span>
        <span className="text-[10px] font-medium text-[var(--color-neutral-500)]">
          /{max}
        </span>
      </div>
    </div>
  );
}

const TOP_SPENDING = [
  { label: "Tuition", amount: 4200, max: 5000, color: "var(--color-primary-500)" },
  { label: "Textbooks", amount: 380, max: 500, color: "var(--color-neutral-700)" },
  { label: "Coffee", amount: 95, max: 120, color: "var(--color-success-500)" },
];

export default function DashboardPage() {
  return (
    <main
      className="min-h-screen bg-[var(--color-background)] p-6 md:p-8"
      style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_280px]">
        {/* Left: Balance + Graph + Button */}
        <div className="flex flex-col gap-6">
          {/* Top row: Balance (left) + Health Gauge (right) */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]">
              <p className="mb-1 text-sm font-medium text-[var(--color-neutral-700)]">
                Total Current Balance
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="flex items-baseline gap-1 text-2xl font-bold tracking-tight text-[var(--color-neutral-900)] md:text-3xl">
                  <IconDollarSign className="h-7 w-7 text-[var(--color-neutral-700)] md:h-8 md:w-8" aria-hidden />
                  12,450.00
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#D1FAE5] px-2 py-0.5 text-xs font-medium text-[var(--color-success-500)]">
                  <IconTrendingUp className="h-3.5 w-3.5" aria-hidden />
                  +2.5% this month
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)]">
              <span className="text-xs font-medium text-[var(--color-neutral-500)]">
                Health Score
              </span>
              <HealthGauge score={85} max={100} />
            </div>
          </div>

          {/* Graph card */}
          <div className="flex-1 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]">
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
              Balance overview
            </h2>
            <div className="overflow-hidden rounded-[var(--radius-md)]">
              <WavyAreaChart />
            </div>
          </div>

          {/* Bottom right: New Charts button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-[var(--color-surface)] shadow-[var(--shadow-md)] transition-[transform,box-shadow] duration-200 ease-in-out hover:bg-[var(--color-primary-600)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(30,27,75,0.08)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 active:scale-[0.98]"
            >
              New Charts
              <IconPlus className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Right: Top Spending sidebar (Student Insights) */}
        <aside className="lg:order-none">
          <div className="sticky top-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]">
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
              Top Spending
            </h2>
            <p className="mb-4 text-xs text-[var(--color-neutral-500)]">
              Student insights
            </p>
            <ul className="space-y-5">
              {TOP_SPENDING.map((item) => (
                <li key={item.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-[var(--color-neutral-900)]">
                      {item.label}
                    </span>
                    <span className="text-[var(--color-neutral-700)]">
                      ${item.amount.toLocaleString()} / ${item.max.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-[var(--color-neutral-200)]"
                    role="progressbar"
                    aria-valuenow={item.amount}
                    aria-valuemin={0}
                    aria-valuemax={item.max}
                    aria-label={`${item.label} spending`}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-300"
                      style={{
                        width: `${Math.min(100, (item.amount / item.max) * 100)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
