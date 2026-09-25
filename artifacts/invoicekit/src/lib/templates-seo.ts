export interface TemplateFAQ {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface TemplateSEO {
  slug: string;
  name: string;
  title: string;
  description: string;
  editorTheme: string;
  features: string[];
  keywords: string[];
  directAnswer: {
    heading: string;
    text: string;
  };
  howToSteps: HowToStep[];
  faqs: TemplateFAQ[];
}

export const TEMPLATES_SEO: TemplateSEO[] = [
  {
    slug: "blank-invoice-template",
    name: "Blank Invoice Template",
    title: "Free Blank Invoice Template | Fillable & Printable PDF Download",
    description: "Download or fill in a blank invoice template online for free. Clean, editable, printable PDF invoice format with automatic tax and total calculations. No sign-up needed.",
    editorTheme: "minimal",
    features: [
      "100% Fill-in-the-blank layout",
      "Instant printable PDF download",
      "Automatic tax, discount & total calculation",
      "No account or login required",
      "Add custom logo & payment instructions",
      "Mobile and desktop responsive",
    ],
    keywords: [
      "blank invoice template",
      "blank invoice template pdf",
      "free blank invoice template",
      "fillable blank invoice",
      "printable blank invoice template",
      "blank bill template pdf",
      "editable blank invoice template free",
    ],
    directAnswer: {
      heading: "What is a Blank Invoice Template?",
      text: "A blank invoice template is a clean, pre-formatted billing document that allows freelancers and businesses to fill in custom client details, line items, hourly or fixed rates, and payment terms before exporting a print-ready PDF—without requiring specialized accounting software.",
    },
    howToSteps: [
      {
        name: "Fill in Business & Client Info",
        text: "Add your business name, logo, and your client's billing address.",
      },
      {
        name: "Add Line Items & Pricing",
        text: "List services or products provided with quantities and rates. Taxes and discounts calculate automatically.",
      },
      {
        name: "Download Printable PDF",
        text: "Click Download PDF or Print to instantly generate a clean, unwatermarked invoice.",
      },
    ],
    faqs: [
      {
        question: "Can I download this blank invoice template as a PDF?",
        answer: "Yes. You can fill out the blank invoice directly in your browser and download a high-resolution, print-ready PDF in seconds with zero watermarks.",
      },
      {
        question: "Is this blank invoice template completely free to use?",
        answer: "Yes, InvoiceKit is 100% free with no sign-up required, no subscription fees, and no hidden trial periods.",
      },
      {
        question: "Can I print this blank invoice template directly?",
        answer: "Yes. You can either print it directly from your browser using Ctrl+P (Cmd+P) or save it as a PDF to print later.",
      },
    ],
  },
  {
    slug: "freelance-invoice-template",
    name: "Freelance Invoice Template",
    title: "Freelance Invoice Template | Free PDF Generator for Freelancers",
    description: "Free invoice template tailored for freelancers, designers, developers, and writers. Include hourly rates, project milestones, and instant PDF download without creating an account.",
    editorTheme: "creative",
    features: [
      "Tailored for hourly and project-based billing",
      "Custom payment terms (Net 15, Net 30, Due on Receipt)",
      "Multi-currency support (USD, EUR, GBP, CAD, AUD)",
      "Digital signature integration",
      "Zero fees and client-side privacy",
      "Works on mobile, tablet, and desktop",
    ],
    keywords: [
      "freelance invoice template",
      "freelance invoice template free",
      "invoice template for freelancers",
      "freelance graphic designer invoice template",
      "freelance developer invoice template",
      "freelancer billing template pdf",
    ],
    directAnswer: {
      heading: "How should freelancers format an invoice?",
      text: "A freelance invoice should include your contact information, client details, a unique invoice number, itemized project deliverables or hourly breakdown, accepted payment methods (bank transfer, PayPal, Stripe), payment due date, and applicable taxes.",
    },
    howToSteps: [
      {
        name: "Enter Freelancer & Client Details",
        text: "Provide your name or freelance business name along with client contact details.",
      },
      {
        name: "Specify Hourly or Milestone Rates",
        text: "Add itemized descriptions for project milestones or hourly logs.",
      },
      {
        name: "Export and Send",
        text: "Download your professional PDF invoice and email it directly to your client.",
      },
    ],
    faqs: [
      {
        question: "What information should I include on a freelance invoice?",
        answer: "Include your name/business name, client contact details, invoice number, issue/due dates, detailed list of deliverables/hours, total amount due, payment instructions, and your tax ID if required.",
      },
      {
        question: "Can I set up payment terms like Net 30 or Net 15?",
        answer: "Yes, you can specify custom payment terms, due dates, and bank or payment notes directly on the invoice.",
      },
      {
        question: "Do I need to sign up to create a freelance invoice?",
        answer: "No. You can create, preview, and download your freelance invoice immediately without registering an account.",
      },
    ],
  },
  {
    slug: "independent-contractor",
    name: "Independent Contractor Invoice",
    title: "Independent Contractor Invoice Template | Free 1099 Billing Generator",
    description: "Professional contractor invoice template for independent contractors, subcontractors, and tradespeople. Includes tax ID (EIN/W9), hourly/labor breakdown, and instant PDF download.",
    editorTheme: "contractor",
    features: [
      "Dedicated Tax ID (EIN / SSN) field",
      "Labor and materials itemization",
      "Clear payment milestones and terms",
      "Print and email ready PDF output",
      "No watermarks or sign-up needed",
      "Compliant with contractor tax standards",
    ],
    keywords: [
      "independent contractor invoice template",
      "contractor invoice template free",
      "1099 contractor invoice template",
      "subcontractor invoice template",
      "hourly contractor billing form",
      "contractor receipt and invoice generator",
    ],
    directAnswer: {
      heading: "What is required on an Independent Contractor Invoice?",
      text: "An independent contractor invoice requires your legal name or DBA, business address, client name, contractor Tax ID (EIN or SSN for 1099 purposes), invoice number, date, itemized labor and materials, hourly or flat fee rates, and payment instructions.",
    },
    howToSteps: [
      {
        name: "Add Contractor Business Info",
        text: "Enter your legal trading name, address, and Tax ID/EIN.",
      },
      {
        name: "List Labor & Material Costs",
        text: "Itemize work completed, hours logged, and equipment or material expenses.",
      },
      {
        name: "Generate PDF Invoice",
        text: "Download or print your contractor invoice in standard A4 or Letter format.",
      },
    ],
    faqs: [
      {
        question: "Is this contractor template suitable for 1099 workers?",
        answer: "Yes, this template is structured specifically for 1099 independent contractors, subcontractors, and trade professionals.",
      },
      {
        question: "Can I add material expenses and hourly labor on the same invoice?",
        answer: "Yes. You can add unlimited line items for both hourly service hours and fixed-cost materials.",
      },
    ],
  },
  {
    slug: "consultant-invoice-template",
    name: "Consultant Invoice Template",
    title: "Consulting Invoice Template | Professional Advisory & Retainer Billing",
    description: "Free consulting invoice template for management consultants, advisors, and strategists. Bill hourly rates, project retainers, or advisory milestones with zero sign-up.",
    editorTheme: "corporate",
    features: [
      "Advisory and retainer billing layout",
      "Corporate-grade typography and branding",
      "Tax, discount, and expense line items",
      "Professional payment instructions area",
      "Instant PDF export",
    ],
    keywords: [
      "consultant invoice template",
      "consulting invoice template free",
      "consulting retainer invoice template",
      "business advisor invoice pdf",
      "management consulting billing format",
    ],
    directAnswer: {
      heading: "How do consultants invoice clients?",
      text: "Consultants invoice clients either via monthly retainers, fixed project milestones, or hourly advisory rates. A consulting invoice should clearly document the scope of advisory services, dates, project deliverables, and payment deadlines.",
    },
    howToSteps: [
      {
        name: "Set Up Consulting Details",
        text: "Add your consulting firm details, client contact, and billing cycle.",
      },
      {
        name: "Detail Advisory Hours or Retainer",
        text: "Specify retainer amounts or itemize strategic advisory sessions.",
      },
      {
        name: "Download PDF",
        text: "Export a corporate PDF invoice ready to submit to enterprise finance departments.",
      },
    ],
    faqs: [
      {
        question: "Can I use this template for monthly retainer billing?",
        answer: "Yes. You can create monthly retainer invoices with customized service descriptions and terms.",
      },
      {
        question: "Does the invoice support international currencies?",
        answer: "Yes, you can select USD, EUR, GBP, CAD, AUD, and many other international currencies.",
      },
    ],
  },
  {
    slug: "free-receipt-maker",
    name: "Free Receipt Maker",
    title: "Free Receipt Maker & Template | Create Instant Receipts Online",
    description: "Create and download clean sales receipts, cash receipts, and payment proofs online for free. No watermark, no login, and instant PDF download in seconds.",
    editorTheme: "minimal",
    features: [
      "Instant proof-of-payment receipt format",
      "No watermarks or branding",
      "Itemized sales tax and totals",
      "Logo and business details support",
      "Printable receipt PDF export",
    ],
    keywords: [
      "receipt maker free",
      "receipt maker free online",
      "free receipt template",
      "receipt maker free no watermark",
      "sales receipt maker online",
      "free receipt generator pdf",
    ],
    directAnswer: {
      heading: "How to make a receipt online for free?",
      text: "To make a receipt online for free, choose a receipt maker tool, fill in your business name, customer details, purchased items or services, payment method (Cash, Card, Transfer), and total amount received, then download the PDF receipt.",
    },
    howToSteps: [
      {
        name: "Enter Seller & Customer Info",
        text: "Add your company name, receipt number, and payment receipt date.",
      },
      {
        name: "Itemize Goods or Services",
        text: "List items sold, unit costs, and any taxes collected.",
      },
      {
        name: "Download PDF Receipt",
        text: "Download or print your official payment receipt with zero watermarks.",
      },
    ],
    faqs: [
      {
        question: "Is there any watermark on the downloaded receipt?",
        answer: "No. All receipts and invoices generated on InvoiceKit are 100% free and have zero watermarks.",
      },
      {
        question: "Can I use this as proof of payment?",
        answer: "Yes, you can add notes specifying 'Paid in Full' along with the payment date and method.",
      },
    ],
  },
  {
    slug: "clean",
    name: "Clean Invoice Template",
    title: "Clean & Simple Invoice Template | Free PDF Download",
    description: "The Clean template is designed for maximum readability and professionalism. Perfect for any business looking for a simple, elegant invoice without signing up.",
    editorTheme: "clean",
    features: ["Distraction-free layout", "Optimized for PDF printing", "Professional typography", "Instant generation"],
    keywords: ["clean invoice template", "professional invoice maker", "simple billing template", "free pdf invoice"],
    directAnswer: {
      heading: "Why use a clean invoice template?",
      text: "A clean invoice template removes clutter and focuses on essential financial data, making it easy for client accounts payable departments to review and approve payments faster.",
    },
    howToSteps: [
      { name: "Add Your Details", text: "Enter your company name, logo, and client information." },
      { name: "Add Line Items", text: "Specify services, quantities, prices, and taxes." },
      { name: "Download PDF", text: "Export your clean PDF invoice instantly." },
    ],
    faqs: [
      { question: "Is this template free for commercial use?", answer: "Yes, you can use it for all your client billing free of charge." },
    ],
  },
  {
    slug: "contractor",
    name: "Contractor Service Invoice Template",
    title: "Contractor Service Invoice Template | Free PDF Generator",
    description: "Streamline your billing with our high-design Contractor Invoice Template. Ideal for construction, renovation, and maintenance professionals who need itemized rows.",
    editorTheme: "contractor",
    features: ["Service-focused rows", "Clear tax breakdown", "Mobile-ready design", "No watermarks"],
    keywords: ["contractor invoice template", "construction billing form", "maintenance service invoice", "free contractor bill"],
    directAnswer: {
      heading: "What makes a good contractor invoice?",
      text: "A contractor invoice must provide an unambiguous breakdown of labor hours, material costs, project milestones, and terms for milestone payments.",
    },
    howToSteps: [
      { name: "Fill In Contractor Details", text: "Add business name, license numbers, and client info." },
      { name: "Itemize Job Tasks", text: "List labor tasks and material costs." },
      { name: "Download PDF", text: "Generate your contractor invoice instantly." },
    ],
    faqs: [
      { question: "Can I add license numbers or tax IDs?", answer: "Yes, the template supports custom business IDs and tax numbers." },
    ],
  },
  {
    slug: "corporate",
    name: "Corporate Enterprise Template",
    title: "Corporate Business Invoice Template | Official & Formal",
    description: "The Corporate template provides a formal structure for larger businesses and agencies. Includes dedicated sections for business IDs, tax info, and terms.",
    editorTheme: "corporate",
    features: ["Formal layout", "Multi-page support", "Detailed tax ID sections", "Agency-grade design"],
    keywords: ["corporate invoice template", "business billing form", "enterprise invoice maker", "official invoice pdf"],
    directAnswer: {
      heading: "What elements are needed on a corporate invoice?",
      text: "Corporate invoices require formal company registration numbers, tax identification codes, detailed billing contacts, purchase order (PO) references, and full payment terms.",
    },
    howToSteps: [
      { name: "Enter Corporate Info", text: "Provide enterprise details and client department info." },
      { name: "Add Line Items", text: "List services, project codes, and tax rates." },
      { name: "Export PDF", text: "Download official corporate invoice PDF." },
    ],
    faqs: [
      { question: "Can I include purchase order (PO) numbers?", answer: "Yes, you can add PO numbers in the notes and invoice header fields." },
    ],
  },
  {
    slug: "creative",
    name: "Creative Agency Template",
    title: "Creative Agency Invoice Template | Bold & Modern Design",
    description: "Stand out from the crowd with our Creative Template. Designed specifically for designers, photographers, and creative agencies who value strong brand presentation.",
    editorTheme: "creative",
    features: ["Vibrant color accents", "Modern serif fonts", "Brand-first layout", "Portfolio ready"],
    keywords: ["creative invoice template", "designer billing form", "freelance agency invoice", "modern creative bill"],
    directAnswer: {
      heading: "Why should creative professionals use a custom invoice?",
      text: "Creative professionals benefit from distinctive invoices that reflect their design aesthetic and maintain brand consistency across all client touchpoints.",
    },
    howToSteps: [
      { name: "Upload Brand Logo", text: "Add your high-resolution studio logo." },
      { name: "Enter Creative Deliverables", text: "Itemize design phases, revisions, and usage rights." },
      { name: "Download PDF", text: "Get an aesthetic PDF invoice ready to send." },
    ],
    faqs: [
      { question: "Can I add licensing fees to this template?", answer: "Yes, you can add distinct line items for licensing, usage rights, and design assets." },
    ],
  },
  {
    slug: "minimal",
    name: "Minimalist Invoice Template",
    title: "Minimalist Invoice Template for Freelancers | Free Download",
    description: "Less is more. Our Minimal template focuses on the essentials, providing a sleek interface that looks great on any screen. Ideal for digital nomads.",
    editorTheme: "minimal",
    features: ["Ultra-minimal design", "Fastest loading", "Optimized space usage", "Sleek sans-serif typography"],
    keywords: ["minimal invoice template", "sleek billing form", "simple freelance invoice", "modern minimal bill"],
    directAnswer: {
      heading: "What is the advantage of a minimalist invoice?",
      text: "Minimalist invoices avoid visual distraction, load fast, print cleanly on standard paper without wasting ink, and present totals clearly to clients.",
    },
    howToSteps: [
      { name: "Input Details", text: "Fill in bare essentials: Who, What, and Amount." },
      { name: "Check Totals", text: "Verify automatic subtotal and total calculations." },
      { name: "Print or Download", text: "Download crisp PDF with zero ink waste." },
    ],
    faqs: [
      { question: "Does this template look good when printed in black and white?", answer: "Yes, the high-contrast minimal layout is specifically optimized for black-and-white printing." },
    ],
  },
  {
    slug: "modern",
    name: "Modern Tech Invoice Template",
    title: "Modern Professional Invoice Template | Tech & Startup Billing",
    description: "The Modern template uses soft shadows and contemporary spacing to create a digital-first experience. Perfect for software developers, consultants, and tech startups.",
    editorTheme: "modern",
    features: ["Contemporary UI elements", "Soft shadow borders", "Digital-first readability", "Highly customizable"],
    keywords: ["modern invoice template", "tech startup billing", "developer invoice form", "digital business bill"],
    directAnswer: {
      heading: "What is a modern invoice template?",
      text: "A modern invoice template features contemporary typography, subtle styling, and responsive layout designed for digital viewing and PDF distribution.",
    },
    howToSteps: [
      { name: "Add Startup Info", text: "Enter your tech startup or consultant information." },
      { name: "Add Sprints or Milestones", text: "List sprint deliverables or development hours." },
      { name: "Download PDF", text: "Save the PDF invoice." },
    ],
    faqs: [
      { question: "Can I bill in international currencies like EUR or GBP?", answer: "Yes, full currency symbol and code customization is built in." },
    ],
  },
  {
    slug: "salaries",
    name: "Salary & Payroll Template",
    title: "Salary Slip & Earnings Template | Professional Payroll Invoice",
    description: "A specialized template designed for recurring salary payments and earnings statements. Includes clear breakdowns for basic pay, bonuses, and deductions.",
    editorTheme: "salaries",
    features: ["Payroll-specific rows", "Earnings vs Deductions layout", "Official record style", "Bulk payment ready"],
    keywords: ["salary slip template", "payroll invoice form", "earnings statement pdf", "monthly pay slip maker"],
    directAnswer: {
      heading: "How to format a salary slip or payroll invoice?",
      text: "A salary slip invoice documents employee or contractor earnings, pay period dates, gross wages, authorized deductions (taxes, benefits), and final net payable amounts.",
    },
    howToSteps: [
      { name: "Add Employee / Contractor Info", text: "Input worker details, employee ID, and pay period." },
      { name: "List Earnings and Deductions", text: "Itemize base pay, allowances, and withholdings." },
      { name: "Export Slip", text: "Download official payslip PDF." },
    ],
    faqs: [
      { question: "Can I use this as an official salary slip?", answer: "Yes, it provides the standard earnings and deductions structure required for payroll documentation." },
    ],
  },
];
