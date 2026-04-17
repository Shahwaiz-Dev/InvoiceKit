import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-[60px]">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-8 tracking-tighter">
          Privacy Policy
        </h1>
        
        <div className="prose prose-stone max-w-none">
          <p className="lead text-xl text-muted-foreground mb-12">
            At InvoiceKit, we value your privacy and transparency. This policy outlines how we handle your data.
          </p>
          
          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">1. Data Collection</h2>
          <p className="text-muted-foreground mb-6">
            We collect minimal information to provide our services. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Account Information: Name and email when you register.</li>
            <li>Usage Data: To ensure service reliability and performance.</li>
            <li>Invoice Data: Content of the invoices you create to store and manage them for you.</li>
          </ul>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">2. Cookies</h2>
          <p className="text-muted-foreground mb-6">
            We use essential cookies to maintain your session. We do not use third-party tracking or advertising cookies.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">3. Data Sharing</h2>
          <p className="text-muted-foreground mb-6">
            We never sell your data. We only share data with service providers necessary for the application's function (e.g., MongoDB for storage and Better Auth for authentication).
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">4. Your Rights</h2>
          <p className="text-muted-foreground mb-6">
            You can request to delete your account and all associated data at any time by contacting us.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">5. Contact</h2>
          <p className="text-muted-foreground mb-6">
            For questions about this policy, please reach out to hello@invoicekit.dev.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
