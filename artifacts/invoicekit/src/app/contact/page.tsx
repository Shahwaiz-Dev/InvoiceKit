"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 px-6 bg-secondary/5 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions about using our <strong>invoice template</strong> library or need help with the <strong>free invoice generator</strong>? We're here to help.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/5 transition-colors group">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Email Us</p>
                      <a href="mailto:support@invoicekit.app" className="text-lg font-medium hover:text-primary transition-colors">
                        support@invoicekit.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/5 transition-colors group">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Live Chat</p>
                      <p className="text-lg font-medium">Available for account holders</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/5 transition-colors group">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Office</p>
                      <p className="text-lg font-medium">Remote-first team &middot; Global</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-secondary text-white rounded-3xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold mb-4 relative z-10">Common Questions?</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 relative z-10">
                  Check our FAQ page for instant answers to questions about watermark-free PDFs, account setup, and template customization.
                </p>
                <a href="/#faq" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all relative z-10">
                  View FAQ <span className="text-lg">→</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-secondary/10 shadow-2xl shadow-secondary/5 rounded-3xl p-8 md:p-12">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 rounded-xl border border-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-secondary/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full px-4 py-3 rounded-xl border border-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-secondary/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Subject</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-secondary/5 appearance-none">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Account Issues</option>
                      <option>Feature Request</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Message</label>
                    <textarea 
                      placeholder="How can we help you?" 
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-secondary/5 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
