"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const inputClass =
  "w-full px-6 py-4 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition font-medium";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const { error: edgeError } = await supabase.functions.invoke(
        "contact-email",
        { body: data }
      );

      if (edgeError) throw edgeError;

      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative max-w-[1400px] mx-auto px-6 py-20 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background to-muted/30 dark:from-background dark:via-card/20 dark:to-background -z-10" />

      <div className="relative mb-16">
        <h1 className="text-5xl font-black text-foreground mb-4 tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span> Contact Us
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="space-y-4">
          <ContactCard
            icon={<Phone size={20} />}
            title="To Know More"
            lines={["+91 98765 43210", "+91 12345 67890"]}
          />
          <ContactCard
            icon={<Mail size={20} />}
            title="Email Now"
            lines={["support@auctionary.com", "info@auctionary.com"]}
          />
          <ContactCard
            icon={<MapPin size={20} />}
            title="Location"
            lines={["Sector 15, DOHS Complex", "Moradabad, UP, India"]}
          />
        </div>

        <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-12 shadow-2xl shadow-primary/5 border border-border relative overflow-hidden">
          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-2">
                Message Sent!
              </h2>
              <p className="text-muted-foreground max-w-sm mb-8">
                We&apos;ve sent a confirmation to your email. Our team will
                reach out to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:text-primary/80 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-2xl text-sm font-bold border border-destructive/20">
                  Something went wrong. Please try again later.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Full Name*
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Daniel Scoot"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Email Address*
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="daniel@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Write Your Message*
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="How can we help you today?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full md:w-auto bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="border border-border rounded-[2rem] p-8 flex items-start gap-6 bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition duration-300">
      <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-black text-foreground mb-2 uppercase tracking-tight text-sm">
          {title}
        </p>
        {lines.map((line, i) => (
          <p key={i} className="text-sm font-medium text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
