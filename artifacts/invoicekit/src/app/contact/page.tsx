"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageSquare, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-16">
        {/* Header Section on White Canvas */}
        <section className="py-20 px-6 bg-white border-b border-[#e1e9f0] text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[13px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
              Direct Communication
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-[#091135] tracking-[0.512px] mb-4">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg text-[#36394a] leading-relaxed max-w-xl mx-auto tracking-[0.128px]">
              Have questions regarding PDF rendering, commercial layout support, or account workflows? We respond promptly.
            </p>
          </div>
        </section>

        {/* Content on Lavender Wash */}
        <section className="py-24 px-6 bg-[#f5f3ff]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#e1e9f0] p-6">
                <h2 className="text-lg font-semibold text-[#091135] mb-6">Channels</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#0f77ff] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#36394a] font-medium">Email Dispatch</p>
                      <a href="mailto:support@invoicekit.app" className="text-sm font-semibold text-[#091135] hover:text-[#0f77ff] transition-colors">
                        support@invoicekit.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#0f77ff] shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#36394a] font-medium">Live Inquiries</p>
                      <p className="text-sm font-semibold text-[#091135]">Available for account holders</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#0f77ff] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#36394a] font-medium">Operating Base</p>
                      <p className="text-sm font-semibold text-[#091135]">Distributed worldwide</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-[#e1e9f0]">
                <h3 className="text-base font-semibold text-[#091135] mb-2">Common Questions?</h3>
                <p className="text-[#36394a] text-xs leading-relaxed mb-4">
                  Check our documentation index for instant explanations regarding watermark-free exports and privacy boundaries.
                </p>
                <Link href="/#faq" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f77ff] hover:text-[#127ee3] transition-colors">
                  Read FAQ <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#e1e9f0] rounded-xl p-8 shadow-none">
                <h2 className="text-xl font-semibold text-[#091135] mb-6 tracking-tight">Send a Dispatch</h2>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[#091135]">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e1e9f0] bg-white text-sm text-[#091135] placeholder:text-[#36394a]/50 focus:outline-none focus:border-[#0f77ff] focus:ring-1 focus:ring-[#0f77ff] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[#091135]">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e1e9f0] bg-white text-sm text-[#091135] placeholder:text-[#36394a]/50 focus:outline-none focus:border-[#0f77ff] focus:ring-1 focus:ring-[#0f77ff] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#091135]">Subject Category</label>
                    <select className="w-full px-3.5 py-2.5 rounded-lg border border-[#e1e9f0] bg-white text-sm text-[#091135] focus:outline-none focus:border-[#0f77ff] focus:ring-1 focus:ring-[#0f77ff] transition-all">
                      <option>General System Inquiry</option>
                      <option>PDF Export Question</option>
                      <option>Account & Synchronization</option>
                      <option>Custom Template Request</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#091135]">Message Body</label>
                    <textarea 
                      placeholder="Describe your inquiry or technical requirement..." 
                      rows={5}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e1e9f0] bg-white text-sm text-[#091135] placeholder:text-[#36394a]/50 focus:outline-none focus:border-[#0f77ff] focus:ring-1 focus:ring-[#0f77ff] transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-11 bg-[#127ee3] text-white font-medium text-sm rounded-lg hover:bg-[#0f77ff] transition-all"
                  >
                    Submit Inquiry
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

export default ContactPage;
