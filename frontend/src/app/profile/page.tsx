"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  CreditCard,
  ChevronRight,
  Banknote,
} from "lucide-react";

const PAYMENT_METHODS = [
  { id: "city-bank", label: "City Bank", icon: Building2 },
  { id: "debit-card", label: "Debit Card", icon: CreditCard },
  { id: "visa-card", label: "Visa Card", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Banknote },
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

export default function ProfilePage() {
  return (
    <main
      className="min-h-screen bg-[var(--color-background)] px-6 py-8 md:px-8 md:py-10"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
        >
          {/* User info section */}
          <motion.section
            variants={itemVariants}
            className="border-b border-[var(--color-neutral-200)] p-6"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex justify-center sm:justify-start">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--color-neutral-200)]">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop"
                    alt="Profile"
                    width={64}
                    height={64}
                    className="object-cover grayscale"
                  />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl font-bold text-[var(--color-neutral-900)]">
                  Henry John Paulin
                </h1>
                <p className="mt-1 text-sm text-[var(--color-neutral-700)]">
                  henry@gmail.com
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-6 border-t border-[var(--color-neutral-200)] pt-4 sm:justify-start">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-neutral-900)]">
                      25 June 2026
                    </p>
                    <p className="text-xs text-[var(--color-neutral-500)]">
                      Registered
                    </p>
                  </div>
                  <div className="h-10 w-px bg-[var(--color-neutral-200)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-neutral-900)]">
                      05
                    </p>
                    <p className="text-xs text-[var(--color-neutral-500)]">
                      Referral
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Name fields & financial value (from wireframe) */}
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4 p-6"
          >
            <div className="flex gap-3">
              <input
                type="text"
                defaultValue="Henry"
                className="flex-1 rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/40"
                placeholder="First name"
              />
              <input
                type="text"
                defaultValue="Paulin"
                className="flex-1 rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/40"
                placeholder="Last name"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3">
                <span className="text-[var(--color-neutral-500)]">$</span>
                <span className="ml-2 text-lg font-semibold text-[var(--color-neutral-900)]">
                  60,000
                </span>
              </div>
              <div className="rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--color-neutral-700)]">
                  /sec
                </span>
              </div>
            </div>
          </motion.section>

          {/* My financial goals */}
          <motion.section
            variants={itemVariants}
            className="border-t border-[var(--color-neutral-200)] p-6"
          >
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              My financial goals
            </h2>
            <p className="mt-2 text-sm text-[var(--color-neutral-500)]">
              Add your financial objectives here. Your AI agent will use these to
              tailor recommendations.
            </p>
          </motion.section>

          {/* Payment methods */}
          <motion.section variants={itemVariants} className="p-6 pt-0">
            <div className="space-y-1">
              {PAYMENT_METHODS.map((method, index) => (
                <motion.button
                  key={method.id}
                  variants={itemVariants}
                  className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[rgba(59,50,255,0.08)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-white">
                    {method.id === "visa-card" ? (
                      <span className="text-xs font-bold">VISA</span>
                    ) : (
                      <method.icon className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium text-[var(--color-neutral-900)]">
                    {method.label}
                  </span>
                  <ChevronRight
                    className={`h-5 w-5 shrink-0 ${
                      index === 0
                        ? "text-[var(--color-neutral-500)]"
                        : "text-[var(--color-neutral-200)]"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
