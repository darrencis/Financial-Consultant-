"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

// Types for server-provided data (assume these will be passed in)
export interface SuggestionChartPoint {
  month: string;
  value: number;
}

export interface SuggestionCard {
  id: string;
  title: string;
  description: string;
  pros: string[];
  chartData: SuggestionChartPoint[];
}

// Placeholder data - will be replaced by server data
const MOCK_SUGGESTIONS: SuggestionCard[] = [
  {
    id: "etf",
    title: "ETF",
    description:
      "Diversified exposure with lower fees. Ideal for long-term growth based on your profile and goals.",
    pros: ["Low expense ratios", "Broad market exposure", "Tax efficiency"],
    chartData: [
      { month: "Jan", value: 5000 },
      { month: "Mar", value: 5200 },
      { month: "Jun", value: 5600 },
      { month: "Sep", value: 6100 },
      { month: "Dec", value: 6700 },
    ],
  },
  {
    id: "savings",
    title: "Savings",
    description:
      "Safe and accessible. Build your emergency fund or save for short-term goals with minimal risk.",
    pros: ["FDIC insured", "Immediate liquidity", "Predictable returns"],
    chartData: [
      { month: "Jan", value: 5000 },
      { month: "Mar", value: 5075 },
      { month: "Jun", value: 5225 },
      { month: "Sep", value: 5380 },
      { month: "Dec", value: 5540 },
    ],
  },
  {
    id: "cash",
    title: "Cash",
    description:
      "Keep liquidity for upcoming expenses or opportunities. Best when you need immediate access.",
    pros: ["No lock-in", "Full flexibility", "No market risk"],
    chartData: [
      { month: "Jan", value: 5000 },
      { month: "Mar", value: 5000 },
      { month: "Jun", value: 5000 },
      { month: "Sep", value: 5000 },
      { month: "Dec", value: 5000 },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function SuggestionChart({ data }: { data: SuggestionChartPoint[] }) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B32FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B32FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
          />
          <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B32FF"
            strokeWidth={2}
            fill="url(#chartGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function SuggestionsPage() {
  const [amount, setAmount] = useState("");
  const [suggestions] = useState<SuggestionCard[]>(MOCK_SUGGESTIONS);

  return (
    <main
      className="min-h-screen bg-[var(--color-background)] px-6 py-8 md:px-8 md:py-10"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Top section: money input + page title */}
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3 shadow-sm">
                <span className="text-lg font-medium text-[var(--color-neutral-500)]">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9,.]/g, ""))
                  }
                  className="ml-1 w-40 border-none bg-transparent text-lg font-semibold text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:ring-0 sm:w-48"
                  aria-label="Amount of money made"
                />
              </div>
              <button
                type="button"
                className="rounded-lg bg-[var(--color-primary-500)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)]"
              >
                Get suggestions
              </button>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-neutral-900)] sm:text-2xl">
              Suggested paths for your money
            </h1>
          </motion.section>

          {/* Three suggestion cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            {suggestions.map((card) => (
              <motion.article
                key={card.id}
                variants={itemVariants}
                className="flex flex-col overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-[var(--shadow-md)] transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                    {card.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-neutral-700)]">
                    {card.description}
                  </p>
                  {card.pros.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {card.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-[var(--color-neutral-600)]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-500)]" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border-t border-[var(--color-neutral-200)] px-4 pb-4 pt-3">
                  <p className="mb-2 text-xs font-medium text-[var(--color-neutral-500)]">
                    Projected growth
                  </p>
                  <SuggestionChart data={card.chartData} />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
