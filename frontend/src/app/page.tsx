"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OccupationOption = "student" | "unemployed" | "employed" | null;

const OPTIONS = [
  { id: "student" as const, label: "A Student", emphasized: true },
  { id: "unemployed" as const, label: "Unemployed", emphasized: false },
  { id: "employed" as const, label: "Employed", emphasized: false },
] as const;

export default function HomePage() {
  const [selected, setSelected] = useState<OccupationOption>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selected) {
      localStorage.setItem("persona", selected);
      router.push("/profile");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] font-sans px-8 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        {/* Headline */}
        <header className="flex w-full max-w-md flex-col gap-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-neutral-900)] sm:text-5xl">
            Who are you?
          </h1>
          <p className="text-base font-normal text-[#64748b] sm:text-lg">
            I am...
          </p>
        </header>

        {/* Spacer - increased gap between header and cards */}
        <div className="h-10 sm:h-12" aria-hidden />

        {/* Selection cards */}
        <div className="flex w-full max-w-md flex-col gap-3">
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelected(option.id)}
                className={`group relative flex w-full items-center justify-between rounded-xl border-2 bg-[var(--color-surface)] p-5 text-left transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 sm:p-6 ${
                  isSelected
                    ? "border-[var(--color-primary-500)] shadow-[0_10px_30px_rgba(30,27,75,0.08)]"
                    : "border-[var(--color-neutral-200)] shadow-[0_4px_20px_rgba(30,27,75,0.04)] hover:border-[var(--color-neutral-500)] hover:shadow-[0_6px_24px_rgba(30,27,75,0.06)]"
                }`}
              >
                {option.emphasized && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-white shadow-md"
                    title="Recommended"
                    aria-hidden
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="translate-x-0.5"
                      aria-hidden
                    >
                      <path
                        d="M2 6h8M6 2l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <span
                  className={`text-lg font-semibold transition-colors duration-300 ${
                    isSelected
                      ? "text-[var(--color-primary-500)]"
                      : "text-[var(--color-neutral-900)]"
                  }`}
                >
                  {option.label}
                </span>
                {isSelected && (
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-white"
                    aria-hidden
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M2 6l3 3 5-6" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="mt-10 w-full max-w-md">
          <button
            type="button"
            disabled={selected === null}
            onClick={handleContinue}
            className={`w-full rounded-lg px-6 py-4 text-base font-semibold text-white transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none ${
              selected !== null
                ? "bg-[var(--color-primary-500)] shadow-[0_4px_14px_rgba(59,50,255,0.35)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-600)] hover:shadow-[0_8px_24px_rgba(59,50,255,0.4)] active:translate-y-0"
                : "bg-[var(--color-neutral-500)]"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
