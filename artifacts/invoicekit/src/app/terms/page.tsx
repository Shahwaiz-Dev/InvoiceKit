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
          
          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">1. Use of Service</h2>
          <p className="text-muted-foreground mb-6">
            InvoiceKit grants you a non-exclusive, non-transferable right to use our platform for creating and managing invoices. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">2. Accuracy of Information</h2>
          <p className="text-muted-foreground mb-6">
            You are solely responsible for the accuracy of the data you input into your invoices. InvoiceKit does not verify the information provided and is not liable for any errors, omissions, or legal disputes arising from inaccurate invoice content.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">3. Prohibited Conduct</h2>
          <p className="text-muted-foreground mb-6">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground mb-6">
            <li>Use the service for any illegal purpose or to facilitate fraudulent transactions.</li>
            <li>Attempt to reverse engineer, decompile, or disrupt the platform's infrastructure.</li>
            <li>Use automated scripts to scrape data or generate excessive load on our servers.</li>
          </ul>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">4. Subscriptions & Payments</h2>
          <p className="text-muted-foreground mb-6">
            Premium features are available via subscription. All payments are processed by Polar.sh. Subscriptions are billed in advance and are non-refundable unless required by law. You may cancel your subscription at any time via your account settings.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-6">
            The InvoiceKit brand, logo, and platform code are the intellectual property of its creators. You retain all rights to the data you input, but by using the service, you grant us a license to process that data to provide the service.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">6. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-6">
            INVOICEKIT IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES AND ARE NOT LIABLE FOR ANY DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">7. Changes to Terms</h2>
          <p className="text-muted-foreground mb-6">
            We may update these terms from time to time. We will notify registered users of any material changes via email. Your continued use of the platform after such changes constitutes acceptance of the new terms.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
