import { motion } from "framer-motion";
import { MousePointer2, PenLine, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <MousePointer2 className="w-6 h-6 text-primary" />,
      title: "Pick",
      description: "Browse 4 professionally designed invoice templates and choose the one that fits your business.",
      number: "1"
    },
    {
      icon: <PenLine className="w-6 h-6 text-primary" />,
      title: "Fill",
      description: "Enter your details — client name, line items, due date, tax rate. A live preview updates as you type.",
      number: "2"
    },
    {
      icon: <Download className="w-6 h-6 text-primary" />,
      title: "Download",
      description: "Click download. Get a pixel-perfect PDF, ready to email or print. No watermarks. No account.",
      number: "3"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent text-[12px] font-bold uppercase tracking-widest mb-3 block">Simple by design</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Three steps to a sent invoice</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="group relative bg-white border border-border rounded-xl p-7 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:border-2"
            >
              <div className="absolute -top-4 -right-2 text-[80px] font-bold text-primary/[0.06] select-none pointer-events-none font-serif leading-none">
                {step.number}
              </div>
              
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">Step {step.number} &mdash; {step.title}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
