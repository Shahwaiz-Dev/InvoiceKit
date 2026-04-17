import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-[60px]">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-8 tracking-tighter">
          Terms of Service
        </h1>
        
        <div className="prose prose-stone max-w-none">
          <p className="lead text-xl text-muted-foreground mb-12">
            By using InvoiceKit, you agree to the following terms. Please read them carefully.
          </p>
          
          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">
            By accessing or using InvoiceKit, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">2. Permitted Use</h2>
          <p className="text-muted-foreground mb-6">
            You agree to use InvoiceKit only for lawful purposes related to invoice creation and management. You are responsible for all content you create.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">3. Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Using the service for fraudulent or illegal purposes.</li>
            <li>Attempting to disrupt or compromise the platform's security.</li>
            <li>Automated scraping or extraction of data without authorization.</li>
          </ul>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">4. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-6">
            InvoiceKit is provided "as is" without warranties. We are not liable for any damages resulting from your use of the service.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">5. Modifications</h2>
          <p className="text-muted-foreground mb-6">
            We reserve the right to modify these terms at any time. Your continued use of the service signifies acceptance of any changes.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
