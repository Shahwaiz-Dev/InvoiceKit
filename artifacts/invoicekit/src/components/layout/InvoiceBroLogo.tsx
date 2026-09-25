import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function InvoiceSyncIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="/Logo.png"
      alt="InvoiceSync Logo"
      className={`object-contain shrink-0 ${className}`}
      width={48}
      height={48}
      loading="eager"
    />
  );
}

export const InvoiceBroIcon = InvoiceSyncIcon;

export function InvoiceSyncLogo({
  className = "",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-[18px]";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <InvoiceSyncIcon className={iconSize} />
      {showWordmark && (
        <span className={`font-semibold ${textSize} text-[#091135] tracking-[0.014em] leading-none`}>
          Invoice<span className="text-[#091135]">Sync</span>
        </span>
      )}
    </div>
  );
}

export const InvoiceBroLogo = InvoiceSyncLogo;
