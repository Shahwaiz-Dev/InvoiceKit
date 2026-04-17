import { TemplateType, InvoiceData } from "@/lib/schema";
import { CleanTemplate } from "./components/CleanTemplate";
import { CorporateTemplate } from "./components/CorporateTemplate";
import { SalariesTemplate } from "./components/SalariesTemplate";
import { ModernTemplate } from "./components/ModernTemplate";
import { CreativeTemplate } from "./components/CreativeTemplate";
import { ContractorTemplate } from "./components/ContractorTemplate";
import { MinimalTemplate } from "./components/MinimalTemplate";

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
