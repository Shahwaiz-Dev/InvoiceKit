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
          
          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-6">
            We aim to collect only the minimum amount of data necessary to provide you with a high-quality invoice generation service. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground mb-6">
            <li><strong>Account Data:</strong> If you choose to register, we store your name, email address, and authentication tokens via Better Auth.</li>
            <li><strong>Invoice Content:</strong> For registered users, we store the data you input into invoices (client details, items, amounts) so you can access them later. For anonymous users, this data is stored only in your browser's local storage.</li>
            <li><strong>Technical Logs:</strong> We may collect IP addresses and browser information for security monitoring and performance optimization.</li>
          </ul>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">2. How We Use Your Data</h2>
          <p className="text-muted-foreground mb-6">
            Your data is used exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground mb-6">
            <li>Facilitate the creation, preview, and download of professional invoices.</li>
            <li>Manage your account and subscription status via Polar.sh if applicable.</li>
            <li>Send infrequent service updates or critical security alerts.</li>
          </ul>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">3. Data Storage & Security</h2>
          <p className="text-muted-foreground mb-6">
            We take security seriously. All data is transmitted over encrypted HTTPS connections. Registered user data is stored in secured MongoDB instances. We do not store sensitive payment information on our servers; all transactions are handled securely by our payment processor, Polar.sh.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">4. Third-Party Services</h2>
          <p className="text-muted-foreground mb-6">
            We utilize trusted third-party services to enhance our platform:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground mb-6">
            <li><strong>Better Auth:</strong> For secure user authentication.</li>
            <li><strong>MongoDB:</strong> For persistent data storage.</li>
            <li><strong>Polar.sh:</strong> For subscription and payment management.</li>
          </ul>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">5. Your Privacy Rights</h2>
          <p className="text-muted-foreground mb-6">
            Depending on your location, you may have rights under the GDPR, CCPA, or other privacy regulations. These include the right to access, correct, or delete your personal data. You can export your data or delete your account directly from your dashboard settings.
          </p>

          <h2 className="text-2xl font-serif text-foreground mt-12 mb-4">6. Contact Us</h2>
          <p className="text-muted-foreground mb-6">
            If you have questions about this Privacy Policy or our data practices, please contact our support team at <a href="mailto:hello@invoicekit.app" className="text-primary hover:underline">hello@invoicekit.app</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
