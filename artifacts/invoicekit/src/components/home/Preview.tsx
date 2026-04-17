import { TemplateType, InvoiceData } from "@/lib/schema";
import { TemplateRenderer } from "@/features/templates/TemplateRenderer";

interface PreviewProps {
  template: TemplateType;
  data: InvoiceData;
}

export function Preview({ template, data }: PreviewProps) {
  return <TemplateRenderer template={template} data={data} />;
}
