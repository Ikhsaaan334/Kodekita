"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Entrance teroreografi: fade + naik 12px, sekali saat masuk viewport (DESIGN.md motion system). */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Angka XP menghitung naik (momen pencapaian). */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>+{to}</span>;
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      +{to}
    </motion.span>
  );
}

/** Burst emas sekali di momen sukses; satu-satunya glow yang diizinkan (R-13). */
export function XpBurst({ xp }: { xp: number }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className="text-center font-code text-emas-400">+{xp} XP</div>;
  }
  return (
    <motion.div
      className="pointer-events-none relative mx-auto w-fit text-center font-code text-lg font-semibold text-emas-400"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 14 }}
    >
      <span className="absolute -inset-4 -z-10 rounded-full bg-emas-500/20 blur-xl" aria-hidden />
      +{xp} XP
    </motion.div>
  );
}
