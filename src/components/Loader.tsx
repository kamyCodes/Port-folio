"use client";

import { useEffect, useState } from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ label = "Kamy Ewang" }) => {
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");

  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MIN_TIME = reduced ? 150 : 900;
    const MAX_TIME = 3500;
    const start = performance.now();

    const finish = () => {
      if (cancelled) return;
      const remaining = Math.max(0, MIN_TIME - (performance.now() - start));
      window.setTimeout(
        () => {
          if (cancelled) return;
          setPhase("fading");
          document.body.style.overflow = "";
          window.setTimeout(() => {
            if (!cancelled) setPhase("done");
          }, reduced ? 0 : 520);
        },
        remaining,
      );
    };

    const waitForReady = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        // noop
      }
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
      }
      // Let eager images finish decoding so the layout is settled before reveal.
      await Promise.allSettled(
        Array.from(document.images).map((img) => img.decode().catch(() => undefined)),
      );
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      finish();
    };

    document.body.style.overflow = "hidden";
    waitForReady();
    const cap = window.setTimeout(finish, MAX_TIME);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`${styles.overlay} ${phase === "fading" ? styles.fading : ""}`}
      role="status"
      aria-label="Loading"
    >
      <div className={styles.tile}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#171a1f" />
          <g fill="none" stroke="#06b6d4" strokeWidth="8.5" strokeLinecap="round">
            <path d="M21 13v38" />
            <path d="M25.5 32 45 15.5" />
            <path d="M25.5 32 45 48.5" />
          </g>
        </svg>
      </div>
      <div className={styles.name}>{label}</div>
      <div className={styles.bar} />
    </div>
  );
};