import { InvoiceData } from "@/lib/schema";

interface SignatureBlockProps {
  signature?: {
    text?: string;
    font?: string;
  };
  className?: string;
}

export function SignatureBlock({ signature, className = "" }: SignatureBlockProps) {
  if (!signature?.text) return null;

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <div className="relative">
        <div 
          className="signature-font text-4xl text-secondary px-4 py-2 border-b border-secondary/20"
          style={{ 
            fontFamily: signature.font,
            color: "#1e293b", // Slate-800 for a consistent ink look
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
