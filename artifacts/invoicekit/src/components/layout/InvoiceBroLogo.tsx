import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function InvoiceBroIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="InvoiceBro Logo Icon"
    >
      {/* Blue Squircle */}
      <rect width="100" height="100" rx="24" fill="#127ee3" />
      
      {/* 'i' dot */}
      <circle cx="28" cy="31" r="5.5" fill="white" />
      
      {/* 'i' stem */}
      <rect x="23" y="42" width="10" height="34" rx="3.5" fill="white" />
      
      {/* 'B' letter with folded corner */}
      {/* Spine & Body */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 26C40 24.3431 41.3431 23 43 23H62.5L74 34.5V47.5C74 50.8 72 53.5 69.2 54.8C73 56.4 75.5 60.2 75.5 64.5C75.5 71.5 69.8 76 62.5 76H43C41.3431 76 40 74.6569 40 73V26ZM49.5 32V45H61.5C64.5 45 66.5 43.2 66.5 40.5C66.5 37.8 64.5 36 61.5 36H57.5L49.5 32ZM49.5 53.5V67H62.5C66 67 68 64.8 68 61.8C68 58.8 66 56.5 62.5 56.5H57.5L49.5 53.5Z"
        fill="white"
      />
      
      {/* Folded dog-ear triangle on 'B' */}
      <path
        d="M62.5 23V34.5H74L62.5 23Z"
        fill="#e8f1ff"
        opacity="0.95"
      />
    </svg>
  );
}

export function InvoiceBroLogo({
  className = "",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-[18px]";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <InvoiceBroIcon className={iconSize} />
      {showWordmark && (
        <span className={`font-semibold ${textSize} text-[#091135] tracking-[0.014em] leading-none`}>
          Invoice<span className="text-[#091135]">Bro</span>
        </span>
      )}
    </div>
  );
}
