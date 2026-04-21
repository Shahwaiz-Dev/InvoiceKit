export interface TemplateSEO {
  slug: string;
  name: string;
  title: string;
  description: string;
  features: string[];
  keywords: string[];
}

export const TEMPLATES_SEO: TemplateSEO[] = [
  {
    slug: "clean",
    name: "Clean Template",
    title: "Clean & Professional Invoice Template | Free Download",
    description: "The Clean template is designed for maximum readability and professionalism. Perfect for any business looking for a simple, elegant invoice without a sign-up required.",
    features: ["Distraction-free layout", "Optimized for PDF printing", "Professional typography", "Instant generation"],
    keywords: ["clean invoice template", "professional invoice maker", "simple billing template", "free pdf invoice"],
  },
  {
    slug: "contractor",
    name: "Contractor Template",
    title: "Professional Contractor Invoice Template | Free PDF Generator",
    description: "Streamline your billing with our high-design Contractor Invoice Template. Ideal for construction, renovation, and maintenance professionals who need to list detailed service descriptions.",
    features: ["Service-focused rows", "Clear tax breakdown", "Mobile-ready design", "No watermarks"],
    keywords: ["contractor invoice template", "construction billing form", "maintenance service invoice", "free contractor bill"],
  },
  {
    slug: "corporate",
    name: "Corporate Template",
    title: "Corporate Business Invoice Template | Official & Formal",
    description: "The Corporate template provides a formal structure for larger businesses and agencies. Includes dedicated sections for business IDs, tax information, and detailed terms.",
    features: ["Formal layout", "Multi-page support", "Detailed tax ID sections", "Agency-grade design"],
    keywords: ["corporate invoice template", "business billing form", "enterprise invoice maker", "official invoice pdf"],
  },
  {
    slug: "creative",
    name: "Creative Template",
    title: "Creative Agency Invoice Template | Bold & Modern Design",
    description: "Stand out from the crowd with our Creative Template. Designed specifically for designers, photographers, and creative agencies who want their brand to reflect in their billing.",
    features: ["Vibrant color accents", "Modern serif fonts", "Brand-first layout", "Portfolio integration ready"],
    keywords: ["creative invoice template", "designer billing form", "freelance agency invoice", "modern creative bill"],
  },
  {
    slug: "minimal",
    name: "Minimalist Invoice Template | Sleek & Efficient",
    title: "Minimalist Invoice Template for Freelancers | Free Download",
    description: "Less is more. Our Minimal template focuses on the essentials, providing a sleek interface that looks great on any screen. Ideal for minimalists and digital nomads.",
    features: ["Ultra-minimal design", "Fastest loading", "Optimized space usage", "Sleek sans-serif typography"],
    keywords: ["minimal invoice template", "sleek billing form", "simple freelance invoice", "modern minimal bill"],
  },
  {
    slug: "modern",
    name: "Modern Invoice Template | Digital-First Professional",
    title: "Modern Professional Invoice Template | Customizable & Free",
    description: "The Modern template uses soft shadows and contemporary spacing to create a digital-first experience. Perfect for software developers, consultants, and tech startups.",
    features: ["Contemporary UI elements", "Soft shadow borders", "Digital-first readability", "Highly customizable"],
    keywords: ["modern invoice template", "tech startup billing", "developer invoice form", "digital business bill"],
  },
  {
    slug: "salaries",
    name: "Salary & Payroll Template | Earnings Statement & Invoice",
    title: "Salary Slip & Earnings Template | Professional Payroll Invoice",
    description: "A specialized template designed for recurring salary payments and earnings statements. Includes clear breakdowns for basic pay, bonuses, and deductions.",
    features: ["Payroll-specific rows", "Earnings vs Deductions layout", "Official record style", "Bulk payment ready"],
    keywords: ["salary slip template", "payroll invoice form", "earnings statement pdf", "monthly pay slip maker"],
  },
];
