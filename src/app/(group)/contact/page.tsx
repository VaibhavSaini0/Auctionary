"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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
      const { error: edgeError } = await supabase.functions.invoke("contact-email", {
        body: data,
      });

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
    <section className="relative max-w-[1400px] mx-auto px-6 py-20 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3f7e9] via-[#f6faef] to-[#eef4df] -z-10" />

      <div className="relative mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Contact Us</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-orange-500 transition">Home</Link> 
          <span className="mx-2">/</span> Contact Us
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Info Cards */}
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

        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-orange-100/50 border border-gray-100 relative overflow-hidden">
          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-500 max-w-sm mb-8">
                We&apos;ve sent a confirmation to your email. Our team will reach out to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-orange-500 font-black uppercase tracking-widest text-xs border-b-2 border-orange-500 pb-1"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                  Something went wrong. Please try again later.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name*</label>
                <input required name="name" type="text" placeholder="Daniel Scoot" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 transition font-medium" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone</label>
                  <input name="phone" type="tel" placeholder="+91 00000 00000" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 transition font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address*</label>
                  <input required name="email" type="email" placeholder="daniel@example.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 transition font-medium" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Write Your Message*</label>
                <textarea required name="message" rows={5} placeholder="How can we help you today?" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-500 transition font-medium resize-none" />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full md:w-auto bg-gray-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Submit Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, title, lines }: { icon: React.ReactNode, title: string, lines: string[] }) {
  return (
    <div className="border border-gray-100 rounded-[2rem] p-8 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition duration-300">
      <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-black text-gray-900 mb-2 uppercase tracking-tight text-sm">{title}</p>
        {lines.map((line, i) => (
          <p key={i} className="text-sm font-medium text-gray-500">{line}</p>
        ))}
      </div>
    </div>
  );
}