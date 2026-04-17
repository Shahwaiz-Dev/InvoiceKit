import { TemplateType, InvoiceData } from "@/lib/schema";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoadingTemplate = () => (
  <div className="w-full h-full flex items-center justify-center bg-white">
    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
  </div>
);

const CleanTemplate = dynamic(() => import("./components/CleanTemplate").then(m => m.CleanTemplate), { loading: LoadingTemplate });
const CorporateTemplate = dynamic(() => import("./components/CorporateTemplate").then(m => m.CorporateTemplate), { loading: LoadingTemplate });
const SalariesTemplate = dynamic(() => import("./components/SalariesTemplate").then(m => m.SalariesTemplate), { loading: LoadingTemplate });
const ModernTemplate = dynamic(() => import("./components/ModernTemplate").then(m => m.ModernTemplate), { loading: LoadingTemplate });
const CreativeTemplate = dynamic(() => import("./components/CreativeTemplate").then(m => m.CreativeTemplate), { loading: LoadingTemplate });
const ContractorTemplate = dynamic(() => import("./components/ContractorTemplate").then(m => m.ContractorTemplate), { loading: LoadingTemplate });
const MinimalTemplate = dynamic(() => import("./components/MinimalTemplate").then(m => m.MinimalTemplate), { loading: LoadingTemplate });

interface TemplateRendererProps {
  template: TemplateType;
  data: InvoiceData;
}

export function TemplateRenderer({ template, data }: TemplateRendererProps) {
  switch (template) {
    case "clean":
      return <CleanTemplate data={data} />;
    case "corporate":
      return <CorporateTemplate data={data} />;
    case "salaries":
      return <SalariesTemplate data={data} />;
    case "modern":
      return <ModernTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "contractor":
      return <ContractorTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    default:
      return <CleanTemplate data={data} />;
  }
}
