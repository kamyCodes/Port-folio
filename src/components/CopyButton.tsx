"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@once-ui-system/core";

interface CopyButtonProps {
  /** Text placed on the clipboard when clicked. */
  value: string;
  /** Tooltip before copying. Defaults to "Copy". */
  tooltip?: string;
  /** IconButton size. */
  size?: "xs" | "s" | "m" | "l" | "xl";
}

/**
 * Small icon button that copies `value` to the clipboard and flips to a check
 * mark for two seconds. Falls back to a hidden-textarea execCommand copy when
 * the async clipboard API is unavailable.
 */
export function CopyButton({ value, tooltip = "Copy", size = "s" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const legacyCopy = useCallback((text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch {
      // Nothing else to try — ignore.
    }
    document.body.removeChild(textarea);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        legacyCopy(value);
      }
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Permission denied or clipboard blocked — do nothing.
    }
  }, [legacyCopy, value]);

  return (
    <IconButton
      icon={copied ? "check" : "copy"}
      variant="ghost"
      size={size}
      tooltip={copied ? "Copied" : tooltip}
      tooltipPosition="top"
      aria-label={copied ? "Copied to clipboard" : `Copy: ${tooltip}`}
      onClick={handleCopy}
    />
  );
}
