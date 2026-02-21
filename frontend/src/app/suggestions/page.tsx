"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000";

interface ApiRecommendation {
  card_id: string;
  account_type: string;
  title?: string;
  description?: string;
  explanation?: string;
  annual_return_pct: number;
  amount?: number;
  suggested_amount?: number;
  pros?: string[];
  reasons?: string[];
}

interface DisplayCard {
  id: string;
  title: string;
  description: string;
  pros: string[];
  annualReturn: number;
  accountType: string;
  amount: number;
  chartData: { month: string; value: number }[];
}

function generateProjection(
  amount: number,
  annualReturnPct: number
): { month: string; value: number }[] {
  const points = ["Now", "3mo", "6mo", "9mo", "1yr"];
  const monthlyRate = annualReturnPct / 100 / 12;
  return points.map((label, i) => ({
    month: label,
    value: Math.round(amount * Math.pow(1 + monthlyRate, i * 3)),
  }));
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  tfsa: "TFSA",
  rrsp: "RRSP",
  savings: "Savings Account",
  etf: "ETF Portfolio",
  cash: "Cash Reserve",
  gic: "GIC",
  hisa: "High-Interest Savings",
};

function formatAccountType(type: string): string {
  return (
    ACCOUNT_TYPE_LABELS[type.toLowerCase()] ||
    type.charAt(0).toUpperCase() + type.slice(1)
  );
}

function mapRecommendation(
  rec: ApiRecommendation,
  fallbackAmount: number
): DisplayCard {
  const amount = rec.amount ?? rec.suggested_amount ?? fallbackAmount;
  return {
    id: rec.card_id,
    title: rec.title || formatAccountType(rec.account_type),
    description: rec.description || rec.explanation || "",
    pros: rec.pros || rec.reasons || [],
    annualReturn: rec.annual_return_pct,
    accountType: rec.account_type,
    amount,
    chartData: generateProjection(amount, rec.annual_return_pct),
  };
}

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

function SuggestionChart({
  data,
}: {
  data: { month: string; value: number }[];
}) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
        >
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
  const router = useRouter();
  const [cards, setCards] = useState<DisplayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inflowAmount, setInflowAmount] = useState(0);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const userId = localStorage.getItem("user_id");
    const inflowId = localStorage.getItem("inflow_id");
    const amount = parseFloat(localStorage.getItem("inflow_amount") || "0");
    setInflowAmount(amount);

    if (!userId || !inflowId) {
      setError("Missing user data. Please complete your profile first.");
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/users/${userId}/inflows/${inflowId}/recommend`,
          { method: "POST" }
        );
        if (!res.ok) throw new Error("Failed to get recommendations");
        const data = await res.json();

        const recommendations: ApiRecommendation[] = Array.isArray(data)
          ? data
          : (data.recommendations || data.cards || []);

        setCards(recommendations.map((rec) => mapRecommendation(rec, amount)));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[var(--color-background)]"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-neutral-200)] border-t-[var(--color-primary-500)]" />
          <p className="text-sm font-medium text-[var(--color-neutral-700)]">
            Generating your personalized recommendations...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="rounded-lg bg-[#FEE2E2] px-6 py-4 text-sm font-medium text-[var(--color-error-500)]">
            {error}
          </div>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="rounded-lg bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)]"
          >
            Back to Profile
          </button>
        </div>
      </main>
    );
  }

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
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3 shadow-sm">
                <span className="text-lg font-semibold text-[var(--color-neutral-900)]">
                  ${inflowAmount.toLocaleString()}
                </span>
              </div>
              <span className="text-sm font-medium text-[var(--color-neutral-500)]">
                income recorded
              </span>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-neutral-900)] sm:text-2xl">
              Suggested paths for your money
            </h1>
          </motion.section>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
              <motion.article
                key={card.id}
                variants={itemVariants}
                className="flex flex-col overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-[var(--shadow-md)] transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                      {card.title}
                    </h2>
                    <span className="shrink-0 rounded-full bg-[var(--color-primary-500)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary-500)]">
                      {card.annualReturn}% / yr
                    </span>
                  </div>
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
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-500)]" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.amount > 0 && (
                    <p className="mt-4 text-sm font-semibold text-[var(--color-neutral-900)]">
                      Suggested: ${card.amount.toLocaleString()}
                    </p>
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
