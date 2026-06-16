import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight, ShieldCheck, HelpCircle, Info, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[rgb(43,56,36)] text-white/90 relative overflow-hidden border-t border-white/5">
      {/* Background soft glow shapes */}
      <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full bg-orange-400/5 blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {/* Column 1: Categories */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-6 flex items-center gap-2">
              <span>✦</span> Categories
            </h4>
            <ul className="space-y-3.5 text-sm font-semibold text-white/70">
              {["Porcelain", "Old Clocks", "Jewelry", "Manuscripts", "Ceramics", "Furniture", "Instruments"].map((cat) => (
                <li key={cat}>
                  <Link 
                    href={`/auction-products?category=${cat.toLowerCase()}`}
                    className="inline-block hover:translate-x-1.5 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-6 flex items-center gap-2">
              <span>✦</span> Company
            </h4>
            <ul className="space-y-3.5 text-sm font-semibold text-white/70">
              {[
                { name: "How to bid with us", href: "/howtobid" },
                { name: "How to sell with us", href: "/howtosell" },
                { name: "About Us", href: "/about" },
                { name: "F.A.Q", href: "/#faq" },
                { name: "Blogs & News", href: "/blogs" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="inline-block hover:translate-x-1.5 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Brand & Socials */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link href="/" className="leading-tight mb-4 inline-block">
              <span className="text-3xl font-black tracking-tight text-white">
                Auction<span className="text-orange-400">ary</span>
              </span>
              <p className="text-[10px] tracking-widest font-black uppercase text-white/50 mt-1">
                Bid Smart. Win Big.
              </p>
            </Link>
            <p className="text-sm italic text-white/70 mb-6 max-w-xs">
              “Bid High, Win Big, Smile Bigger”
            </p>

            <p className="text-xs font-black uppercase tracking-wider text-orange-400 mb-2">
              Connect With Us
            </p>
            <p className="text-xs text-white/50 mb-4">
              Stay updated on new live listings!
            </p>

            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" },
              ].map(({ Icon, href }, idx) => (
                <a 
                  key={idx}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/25 cursor-pointer"
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter & Payments */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-4">
              Join Our Newsletter
            </h4>
            <p className="text-xs text-white/60 mb-5 leading-relaxed">
              Get notified immediately when rare collections match your interest.
            </p>

            <div className="flex items-center border border-white/10 hover:border-white/20 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 rounded-xl bg-white/5 backdrop-blur-md overflow-hidden mb-6 p-1 transition-all">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent px-4 py-2.5 text-sm w-full placeholder:text-white/40 text-white focus:outline-none"
              />
              <button className="w-9 h-9 shrink-0 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center text-white cursor-pointer active:scale-95">
                <ArrowRight size={16} />
              </button>
            </div>

            <p className="text-xs font-black uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Secured Payment Gateways
            </p>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 inline-flex gap-2.5 border border-white/5">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9yuQz-NLmiaNVbUTA_-2jf8HIhyd-iO-OLw&s"
                alt="Visa logo"
                className="h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                alt="Mastercard logo"
                className="h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                alt="Amex logo"
                className="h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWHebRtvOTxy4VPYjaabCPS6ANzDGowQvuQ&s"
                alt="Discover card logo"
                className="h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/5 bg-black/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4">
          <p>© Copyright 2026 Auctionary | All Rights Reserved</p>

          <div className="flex gap-6 font-semibold">
            <Link href="/help" className="hover:text-white transition-colors flex items-center gap-1">
              <HelpCircle size={13} /> Support Center
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1">
              <FileText size={13} /> Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
              <Info size={13} /> Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
