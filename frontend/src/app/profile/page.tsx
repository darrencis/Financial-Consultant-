"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000";

const PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "w-full rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/40";

export default function ProfilePage() {
  const router = useRouter();
  const [persona, setPersona] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    source: "",
    notes: "",
    annual_income: 0,
    province: "",
    age: 0,
    financial_goals: "",
    existing_savings: 0,
    monthly_rent: 0,
    monthly_expenses: 0,
    tfsa_room: 0,
    rrsp_room: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("persona");
    if (saved) setPersona(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userRes = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          persona: persona || "employed",
          annual_income: formData.annual_income,
          province: formData.province,
          age: formData.age,
          financial_goals: formData.financial_goals,
          existing_savings: formData.existing_savings,
          monthly_rent: formData.monthly_rent,
          monthly_expenses: formData.monthly_expenses,
          tfsa_room: formData.tfsa_room,
          rrsp_room: formData.rrsp_room,
        }),
      });
      if (!userRes.ok) throw new Error("Failed to create profile");
      const userData = await userRes.json();
      const userId = userData.id;
      localStorage.setItem("user_id", userId);

      const inflowRes = await fetch(
        `${API_BASE}/api/users/${userId}/inflows`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: formData.amount,
            source: formData.source,
            notes: formData.notes,
          }),
        }
      );
      if (!inflowRes.ok) throw new Error("Failed to record income");
      const inflowData = await inflowRes.json();
      localStorage.setItem("inflow_id", inflowData.id);
      localStorage.setItem("inflow_amount", String(formData.amount));

      router.push("/suggestions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main
      className="min-h-screen bg-[var(--color-background)] px-6 py-8 md:px-8 md:py-10"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl">
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
        >
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-6 p-6"
          >
            <h1 className="text-xl font-bold text-[var(--color-neutral-900)]">
              Profile
            </h1>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Income Generated ($)
              </label>
              <input
                id="amount"
                type="number"
                min={0}
                step={0.01}
                value={formData.amount || ""}
                onChange={(e) =>
                  updateField("amount", parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="source"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Income Source
              </label>
              <input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => updateField("source", e.target.value)}
                className={inputClass}
                placeholder="e.g. Employment, investments, side income"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className={inputClass}
                placeholder="Additional notes"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="age"
                  className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min={1}
                  max={120}
                  value={formData.age || ""}
                  onChange={(e) =>
                    updateField("age", parseInt(e.target.value, 10) || 0)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="province"
                  className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
                >
                  Province
                </label>
                <select
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    updateField("province", e.target.value as (typeof formData)["province"])
                  }
                  className={inputClass}
                >
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="annual_income"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Annual income ($)
              </label>
              <input
                id="annual_income"
                type="number"
                min={0}
                step={1000}
                value={formData.annual_income || ""}
                onChange={(e) =>
                  updateField("annual_income", parseInt(e.target.value, 10) || 0)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="financial_goals"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Financial goals
              </label>
              <textarea
                id="financial_goals"
                rows={3}
                value={formData.financial_goals}
                onChange={(e) => updateField("financial_goals", e.target.value)}
                className={inputClass}
                placeholder="e.g. Save for a house, retirement, emergency fund"
              />
            </div>

            <div>
              <label
                htmlFor="existing_savings"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Existing savings ($)
              </label>
              <input
                id="existing_savings"
                type="number"
                min={0}
                step={100}
                value={formData.existing_savings || ""}
                onChange={(e) =>
                  updateField("existing_savings", parseInt(e.target.value, 10) || 0)
                }
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="monthly_rent"
                  className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
                >
                  Monthly rent ($)
                </label>
                <input
                  id="monthly_rent"
                  type="number"
                  min={0}
                  step={100}
                  value={formData.monthly_rent || ""}
                  onChange={(e) =>
                    updateField("monthly_rent", parseInt(e.target.value, 10) || 0)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="monthly_expenses"
                  className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
                >
                  Monthly expenses ($)
                </label>
                <input
                  id="monthly_expenses"
                  type="number"
                  min={0}
                  step={50}
                  value={formData.monthly_expenses || ""}
                  onChange={(e) =>
                    updateField("monthly_expenses", parseInt(e.target.value, 10) || 0)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="tfsa_room"
                  className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
                >
                  TFSA room ($)
                </label>
                <input
                  id="tfsa_room"
                  type="number"
                  min={0}
                  step={100}
                  value={formData.tfsa_room || ""}
                  onChange={(e) =>
                    updateField("tfsa_room", parseInt(e.target.value, 10) || 0)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="rrsp_room"
                  className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
                >
                  RRSP room ($)
                </label>
                <input
                  id="rrsp_room"
                  type="number"
                  min={0}
                  step={100}
                  value={formData.rrsp_room || ""}
                  onChange={(e) =>
                    updateField("rrsp_room", parseInt(e.target.value, 10) || 0)
                  }
                  className={inputClass}
                />
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[var(--color-error-500)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg px-6 py-4 text-base font-semibold text-white transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${
                loading
                  ? "bg-[var(--color-neutral-500)]"
                  : "bg-[var(--color-primary-500)] shadow-[0_4px_14px_rgba(59,50,255,0.35)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-600)] hover:shadow-[0_8px_24px_rgba(59,50,255,0.4)] active:translate-y-0"
              }`}
            >
              {loading ? "Submitting..." : "Get Suggestions"}
            </button>
          </motion.section>
        </motion.form>
      </div>
    </main>
  );
}
