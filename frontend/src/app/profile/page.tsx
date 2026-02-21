"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const PERSONA_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
] as const;

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
  const [formData, setFormData] = useState({
    name: "",
    persona: "",
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
                htmlFor="persona"
                className="mb-2 block text-sm font-medium text-[var(--color-neutral-700)]"
              >
                Persona
              </label>
              <select
                id="persona"
                value={formData.persona}
                onChange={(e) =>
                  updateField("persona", e.target.value as (typeof formData)["persona"])
                }
                className={inputClass}
              >
                <option value="">Select persona</option>
                {PERSONA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
          </motion.section>
        </motion.form>
      </div>
    </main>
  );
}
