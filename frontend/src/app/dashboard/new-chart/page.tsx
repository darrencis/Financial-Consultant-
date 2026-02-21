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
function IconSparkles({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v2" />
      <path d="M17 19h4" />
    </svg>
  );
}

export default function NewChartPage() {
  return (
    <main
      className="min-h-screen bg-[var(--color-background)] p-6 md:p-8"
      style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-tight text-[var(--color-neutral-900)]">
            Financial Update
          </h1>
          <p className="mt-1 text-sm text-[var(--color-neutral-700)]">
            Add income or debt to generate new insights
          </p>
        </header>

        {/* Amount Input */}
        <div className="mb-6">
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]"
          >
            How much did you make/spend?
          </label>
          <div className="relative flex rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] focus-within:ring-2 focus-within:ring-[rgba(59,50,255,0.4)] focus-within:ring-offset-2">
            <span className="flex items-center pl-4 text-[var(--color-neutral-700)]">
              <IconDollarSign className="h-5 w-5" aria-hidden />
            </span>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="w-full border-0 bg-transparent py-3 pr-4 pl-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:ring-0"
              aria-describedby="amount-hint"
            />
          </div>
          <p id="amount-hint" className="mt-1.5 text-xs text-[var(--color-neutral-500)]">
            Enter a positive value for income, negative for expense
          </p>
        </div>

        {/* AI Context Box (Big Text Field) */}
        <div className="mb-8">
          <label
            htmlFor="ai-context"
            className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]"
          >
            Additional Details for AI Analysis
          </label>
          <textarea
            id="ai-context"
            rows={5}
            placeholder="e.g., I got a $500 bonus this month from my internship, but I also have a new $200 textbook expense."
            className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[rgba(59,50,255,0.4)] focus:ring-offset-2"
          />
        </div>

        {/* Submit Button - primary style from design.md */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-[transform,background-color,box-shadow] duration-200 ease-in-out hover:bg-[var(--color-primary-600)] hover:shadow-[var(--shadow-md)] focus:outline-none focus:ring-2 focus:ring-[rgba(59,50,255,0.4)] focus:ring-offset-2 active:scale-[0.98]"
          >
            <IconSparkles className="h-5 w-5" aria-hidden />
            Generate New Insights
          </button>
        </div>
      </div>
    </main>
  );
}
