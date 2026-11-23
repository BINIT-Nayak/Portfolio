"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import style from "./Footer.module.css";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setStatus("copied");
    } catch {
      if (!mounted.current) return;
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className={style.copyGroup}>
      <button
        type="button"
        className={style.copy}
        onClick={copy}
        aria-label={`Copy email address: ${email}`}
      >
        <span>{email}</span>
        {status === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
      </button>
      <p className={style.feedback} role="status" aria-live="polite" aria-atomic="true">
        {status === "copied"
          ? "Copied"
          : status === "error"
            ? "Unable to copy. Select the address, or use Email me."
            : "Click the address to copy"}
      </p>
    </div>
  );
}
