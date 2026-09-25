import { InvoiceData } from "@/lib/schema";

interface SignatureBlockProps {
  signature?: {
    text?: string;
    font?: string;
  };
  className?: string;
}

const getSignatureFontFamily = (font?: string) => {
  if (!font) return "var(--font-signature-1), 'Great Vibes', cursive";
  if (font.includes("signature-1") || font.toLowerCase().includes("great vibes")) {
    return "var(--font-signature-1), 'Great Vibes', cursive";
  }
  if (font.includes("signature-2") || font.toLowerCase().includes("pacifico")) {
    return "var(--font-signature-2), 'Pacifico', cursive";
  }
  if (font.includes("signature-3") || font.toLowerCase().includes("dancing script")) {
    return "var(--font-signature-3), 'Dancing Script', cursive";
  }
  return `${font}, cursive`;
};

export function SignatureBlock({ signature, className = "" }: SignatureBlockProps) {
  if (!signature?.text) return null;

  const fontStyle = getSignatureFontFamily(signature.font);

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <div className="relative">
        <div 
          className="signature-font text-3xl sm:text-4xl px-4 py-2 border-b border-slate-300"
          data-sigfont={signature.font || "var(--font-signature-1)"}
          style={{ 
            fontFamily: fontStyle,
            color: "#1e293b",
          }}
        >
          {signature.text}
        </div>
        <div className="mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
          Authorized Signature
        </div>
      </div>
    </div>
  );
}
