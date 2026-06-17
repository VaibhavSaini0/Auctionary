# ✦ Auctionary

Auctionary is a modern, real-time premium auction marketplace web application designed for seamless buying and selling of items via secure bidding and instant checkouts. Built with Next.js, Clerk, Supabase, Cloudinary, and Stripe.

---

## 🚀 Key Features

- **Dynamic Real-Time Bidding**: Participate in live-action bidding with automatic real-time high-bid updates.
- **Secure Buy Now (Instant Checkout)**: Buy auction items instantly using wallet balances secured via server-side database transactions.
- **Unified Auth & Role-Gating**: Integrated with Clerk for authentication and gated profiles. Seller verification checks protect listing creation.
- **Hardened Server Actions**: All data writes (auctions, transactions, uploads) are fully secured on the server-side with strict Zod validation schemas.
- **Secure File Uploads**: Integrated with Cloudinary, featuring server-side file type restrictions (image-only) and strict size constraints (max 5MB).
- **Interactive Wallet & Payment Redirection**: Add mock/test funds to user wallets using Stripe payment link checkouts with custom-styled landing status pages.
- **Rich Aesthetic Insights Blog**: Clean markdown-supported publishing tools, dynamic category navigation, search queries, and pagination.
- **Premium Adaptive UI/UX**: Designed using Vanilla CSS and Tailwind, supporting fluid responsive views and custom theme states.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database & Real-time API**: [Supabase](https://supabase.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Cloud Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Payments Processing**: [Stripe](https://stripe.com/)
- **Animations & Transitions**: [Framer Motion](https://www.framer.com/motion/) & [Lucide Icons](https://lucide.dev/)
- **Schema Validation**: [Zod](https://zod.dev/)

---

## 📂 Directory Structure

```text
├── public/                  # Static assets & public fallbacks
├── src/
│   ├── app/                 # Next.js App Router Pages and Actions
│   │   ├── (group)/         # Route-grouped public and authenticated views
│   │   │   ├── blogs/       # Blog feed and detail routes
│   │   │   ├── wallet/      # Payment landing callbacks (success/cancel)
│   │   │   └── profile/     # User details, bidding history, listings
│   │   ├── actions/         # Server Actions (Hardened API logic)
│   │   │   ├── auctions.ts   # Auction creation & Buy Now checkout
│   │   │   └── cloudinary.ts # Secure cloud image uploads
│   │   └── layout.tsx       # Root layout wrapping global providers
│   ├── FunComponents/       # Modular UI components (modals, forms, bid panel)
│   ├── lib/                 # Shared logic, helpers, and Supabase client configs
│   └── middleware.ts        # Clerk global protection middleware
├── .env.example             # Template for required environment variables
├── next.config.ts           # Next.js domain whitelist configuration
└── package.json             # NPM dependencies & scripts
```

---

## ⚙️ Local Onboarding & Setup

### 1. Clone & Install Dependencies
```bash
# Clone the repository
cd auctionary

# Install package dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`, populating the values with your credentials:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Verification & Checks

To ensure code stability and type correctness before building:

- **TypeScript compilation check**:
  ```bash
  npx tsc --noEmit
  ```
- **Production compile compilation**:
  ```bash
  npm run build
  ```
