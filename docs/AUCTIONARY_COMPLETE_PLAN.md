# Auctionary — Complete Project Analysis & Implementation Plan

**Document version:** 1.0  
**Date:** June 18, 2026  
**Project:** Auctionary — Live Auction Marketplace  
**Repository:** `auctionary`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Current Architecture](#3-current-architecture)
4. [Implemented Features](#4-implemented-features)
5. [Flaws & Issues](#5-flaws--issues)
6. [Missing Features](#6-missing-features)
7. [Remediation Plan — Remove Flaws](#7-remediation-plan--remove-flaws)
8. [New Feature Implementation Plan](#8-new-feature-implementation-plan)
9. [Testing Strategy](#9-testing-strategy)
10. [DevOps & Documentation Plan](#10-devops--documentation-plan)
11. [Dependency Hygiene](#11-dependency-hygiene)
12. [Execution Timeline](#12-execution-timeline)
13. [Priority Matrix](#13-priority-matrix)
14. [Success Criteria](#14-success-criteria)
15. [Appendix](#15-appendix)

---

## 1. Executive Summary

**Auctionary** is a live auction marketplace web application branded as *"Bid Smart. Win Big."* It allows users to browse auctions, place bids in real time, top up a wallet via Stripe, manage a seller store, read/write blogs, and use product chat/comments. Currency is **INR (₹)**.

The project has a **polished, feature-rich frontend** built on modern technologies (Next.js 16, React 19, Clerk, Supabase, Stripe, Cloudinary). However, it is currently closer to a **production prototype** than a production-ready application.

### Key findings

| Category | Assessment |
|----------|------------|
| UI/UX | Strong — modern design, realtime bidding, responsive layouts |
| Security | Weak — missing authorization, service role overuse, unvalidated uploads |
| Backend | Opaque — critical logic in Supabase Edge Functions not in repo |
| Testing | None — zero unit, integration, or E2E tests |
| Documentation | Minimal — default create-next-app README, no env docs |
| Feature completeness | Partial — several marketed features are not implemented |

### Recommended approach

1. **Fix security flaws and bugs** (Phase 1)
2. **Version backend, add CI, document setup** (Phase 2)
3. **Add automated tests** (Phase 3)
4. **Ship core missing auction features** (Tier A)
5. **Add engagement features** (Tier B)
6. **Add trust & scale features** (Tier C)

---

## 2. Project Overview

### 2.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js **16.0.10** (App Router, React Compiler enabled) |
| UI Library | React **19.2.1** |
| Styling | Tailwind CSS **4**, shadcn/ui (Radix), Framer Motion, Lucide icons |
| Authentication | **Clerk** (`@clerk/nextjs`) with Supabase JWT template |
| Database & Realtime | **Supabase** (`@supabase/supabase-js`) — Postgres + Realtime subscriptions |
| Backend Logic | **Supabase Edge Functions** (external to this repo) |
| Payments | **Stripe** via `create-stripe-session` edge function |
| Media | **Cloudinary** (server action upload) |
| Notifications (UI) | Sonner toasts + Supabase realtime notifications table |

### 2.2 Folder Structure

```
auctionary/
├── public/                         # Static assets
├── docs/                           # Project documentation (this file)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root: ClerkProvider, Header, Footer, UserProvider
│   │   ├── page.tsx                # Marketing homepage
│   │   ├── actions/                # Server actions (auctions, profile, cloudinary, notifications)
│   │   ├── (group)/                # Routed pages: auctions, product, profile, blogs, about, contact
│   │   ├── howtobid/, howtosell/   # Instructional pages
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── FunComponents/              # Feature UI components
│   │   ├── Modals/                 # AddAuction, BecomeSeller, EditBlog, HotBids
│   │   ├── product/                # Bid panel, chat, comments, gallery
│   │   ├── profile/                # Orders, selling, participating, seller settings
│   │   ├── Context/                # UserContext
│   │   └── ...                     # Header, Footer, homepage sections
│   ├── components/ui/              # shadcn primitives (button, input, tabs, carousel, etc.)
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   ├── Cloudinary/client.ts    # ⚠️ Dead file with secrets — remove
│   │   ├── hooks/debounce.tsx
│   │   └── utils.ts
│   └── middleware.ts               # Clerk route protection
├── package.json
├── next.config.ts
├── tsconfig.json
├── components.json
└── README.md                       # ⚠️ Default boilerplate — needs rewrite
```

### 2.3 Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin access (use sparingly) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| Clerk standard env vars | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc. |

> **Action required:** Create `.env.example` with all required variables and descriptions.

---

## 3. Current Architecture

### 3.1 Data Flow Patterns

The application uses three distinct patterns for data access:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                          │
├─────────────────────────────────────────────────────────────────┤
│  Pattern 1: Client → Supabase (anon key + RLS)                  │
│    • Product reads, realtime subscriptions, profile reads        │
│                                                                  │
│  Pattern 2: Client → Supabase Edge Functions (JWT auth)         │
│    • place-bid, get-auctions, create-stripe-session, blogs, etc. │
│                                                                  │
│  Pattern 3: Server Actions → Supabase (service role key)        │
│    • createAuctionAction, updateSellerProfile, cloudinary upload  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Supabase (External)                          │
│  • Postgres tables: profiles, auction_items, bids, orders,      │
│    notifications, blogs, categories, comments, chats              │
│  • Realtime channels for bids, chat, notifications               │
│  • Edge Functions (not versioned in this repo)                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Authentication Flow

1. **Clerk** handles sign-in/sign-up and session management.
2. **Middleware** (`src/middleware.ts`) protects non-public routes.
3. On login, `Header.tsx` upserts user into Supabase `profiles` table using Clerk-issued Supabase JWT.
4. Seller role is stored in **Clerk `publicMetadata.role`** and mirrored in Supabase `profiles.role`.
5. Bidding uses `getToken({ template: "supabase" })` → Bearer token sent to `place-bid` edge function.

### 3.3 Database Tables (Inferred from Code)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (role, wallet balance, etc.) |
| `seller_profiles` | Seller store name, bio, settings |
| `auction_items` | Auction listings (title, bids, dates, status, images) |
| `bids` | Bid history per auction |
| `orders` | Completed purchases |
| `notifications` | In-app notifications |
| `blogs` | Blog posts (CMS-lite) |
| `categories` | Auction categories |
| `comments` | Product comments with ratings |
| `chats` | Live product chat messages |

### 3.4 External Edge Functions (Not in Repo)

| Function | Purpose |
|----------|---------|
| `place-bid` | Place a bid with validation |
| `get-auctions` | Paginated auction listing with filters |
| `create-stripe-session` | Stripe checkout for wallet top-up |
| `send-chat-message` | Send live chat message |
| `add-comment` | Add product comment |
| `create-blog` | Create blog post |
| `update-blog` | Update blog post |
| `delete-blog` | Delete blog post |
| `contact-email` | Contact form email delivery |

> **Risk:** Business logic is not version-controlled, auditable, or reproducible from this repository alone.

---

## 4. Implemented Features

### 4.1 User-Facing Features

| Feature | Location | Status |
|---------|----------|--------|
| Marketing homepage | `src/app/page.tsx` | ✅ Implemented (CTAs broken) |
| Auction listing with filters | `src/app/(group)/auction-products/` | ✅ Implemented |
| Product detail page | `src/app/(group)/product/[id]/` | ✅ Implemented |
| Real-time bid panel | `src/FunComponents/product/ProductBidPanel.tsx` | ✅ Implemented |
| Live chat on products | `src/FunComponents/product/ChatRoom.tsx` | ✅ Implemented |
| Product comments & ratings | `src/FunComponents/product/ProductComments.tsx` | ✅ Implemented |
| User profile dashboard | `src/app/(group)/profile/` | ✅ Implemented |
| Wallet balance display | `src/FunComponents/Context/UserContext.tsx` | ✅ Implemented |
| Add funds (Stripe) | `src/FunComponents/AddFundsModal.tsx` | ✅ Implemented |
| Seller onboarding | `src/FunComponents/Modals/BecomeSellerModal.tsx` | ✅ Implemented |
| Create auction listing | `src/FunComponents/Modals/AddAuctionModal.tsx` | ✅ Implemented (no seller gate) |
| Blog listing & detail | `src/app/(group)/blogs/` | ✅ Implemented |
| Blog create/edit/manage | `src/app/(group)/blogs/create/`, `manage/` | ✅ Implemented |
| Contact form | `src/app/(group)/contact/` | ✅ Implemented |
| In-app notifications | `src/FunComponents/Notification.tsx` | ✅ Implemented (sound file missing) |
| How to bid / sell guides | `src/app/howtobid/`, `howtosell/` | ✅ Implemented |
| About page | `src/app/(group)/about/` | ✅ Implemented |

### 4.2 Profile Dashboard Tabs

| Tab | Component | Status |
|-----|-----------|--------|
| Wallet & Add Funds | Profile page + `AddFundsModal` | ✅ Working |
| Selling (my listings) | `SellingProductTab.tsx` | ✅ Read-only list |
| Participating (my bids) | `ParticipatingTab.tsx` | ✅ Working |
| Orders | `OrderTab.tsx` | ⚠️ Bug on error |
| Seller Settings | `SellerSettingTab.tsx` | ✅ Working |

---

## 5. Flaws & Issues

### 5.1 Critical — Security & Data Integrity

#### C1. No seller authorization on auction creation

**File:** `src/app/actions/auctions.ts`

**Problem:** `createAuctionAction` only verifies the user is logged in. It does not check if the user has the `seller` role. Additionally, the client controls sensitive fields like `status`, `current_bid`, `starts_at`, and `ends_at`.

**Impact:** Any authenticated user can create auction listings and manipulate auction state by calling the server action directly.

**Fix:**
- Verify `profiles.role === 'seller'` before insert.
- Set `status`, `current_bid`, `starts_at` server-side only.
- Validate `ends_at > starts_at` and `ends_at > now`.

---

#### C2. Service role key overuse

**Files:** `src/app/actions/auctions.ts`, `src/app/actions/profile.ts`, `src/app/(group)/profile/page.tsx`, `src/app/(group)/blogs/[id]/page.tsx`

**Problem:** `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security policies. Used broadly in server actions and server components.

**Impact:** Any bug or missing ownership check grants admin-level database access.

**Fix:**
- Use Clerk JWT + anon key for user-scoped operations.
- Reserve service role only for admin/cron operations.
- Add explicit ownership checks on every mutation.

---

#### C3. Client-trusted identity in sensitive flows

**Files:** `src/FunComponents/AddFundsModal.tsx`, `src/FunComponents/product/ChatRoom.tsx`

**Problem:**
- Wallet top-up sends `{ amount, userId }` in request body.
- Chat sends `user_id: userId` in request body.

**Impact:** If edge functions trust the body instead of the JWT, attackers can credit another user's wallet or spoof chat identity.

**Fix:**
- Edge functions must derive `userId` exclusively from JWT.
- Remove `userId` from client request bodies.

---

#### C4. Unauthenticated Cloudinary uploads

**File:** `src/app/actions/cloudinary.ts`

**Problem:** No authentication check, no file type validation, no file size limits.

**Impact:** Anyone can upload arbitrary files to your Cloudinary account.

**Fix:**
- Require Clerk `auth()` in the server action.
- Validate MIME type (image/jpeg, image/png, image/webp only).
- Enforce max file size (e.g., 5 MB).
- Optionally restrict to seller role for auction images.

---

#### C5. Overly permissive image configuration

**File:** `next.config.ts`

**Problem:** `hostname: "**"` allowed for both HTTP and HTTPS in `next/image` remote patterns.

**Impact:** Potential SSRF or abuse vector.

**Fix:** Restrict to known hostnames: `res.cloudinary.com`, Supabase storage domain, etc.

---

#### C6. Dead file with Cloudinary secrets

**File:** `src/lib/Cloudinary/client.ts`

**Problem:** Contains `api_key` and `api_secret` in a client-accessible path. File is unused but dangerous if ever imported client-side.

**Fix:** Delete the file. Secrets should only exist in server actions using env vars.

---

### 5.2 High — Bugs & Broken Behavior

#### H1. Middleware blog route pattern bug

**File:** `src/middleware.ts` (line 3)

**Problem:**
```typescript
// Current (broken):
'/blogs/[id]'

// Should be:
'/blogs/:id'
```

Clerk's `createRouteMatcher` uses `:param` syntax, not Next.js `[param]` syntax.

**Impact:** Blog detail pages (`/blogs/some-uuid`) may incorrectly require login.

**Fix:** Change `/blogs/[id]` to `/blogs/:id`.

---

#### H2. Orders tab infinite loading on error

**File:** `src/FunComponents/profile/OrderTab.tsx` (lines 30–37)

**Problem:** `setLoading(false)` is only called in the success branch. On Supabase error, the UI shows "Loading your orders…" forever.

**Fix:**
```typescript
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}
```

---

#### H3. Homepage CTAs are non-functional

**File:** `src/app/page.tsx` (lines 115–130)

**Problem:** "Start A Bid" and "View All Auction" buttons have no `Link` or `onClick` handler.

**Fix:**
- "Start A Bid" → `/sign-up` or `/auction-products`
- "View All Auction" → `/auction-products`

---

#### H4. Missing static assets

| Asset | Referenced In | Status |
|-------|---------------|--------|
| `notification.mp3` | `src/FunComponents/Notification.tsx:60` | ❌ Missing from `public/` |
| `placeholder.jpg` | `src/FunComponents/profile/OrderTab.tsx:64` | ❌ Missing from `public/` |

**Fix:** Add placeholder assets to `public/` or use a CDN fallback URL.

---

#### H5. Seller UI not gated

**File:** `src/FunComponents/profile/SellingProductTab.tsx`

**Problem:** "Add New Auction" button and `AddAuctionModal` are shown to all profile users, not only users with seller role.

**Fix:** Conditionally render based on `user.role === 'seller'` or `user.publicMetadata.role === 'seller'`.

---

#### H6. Duplicate UserProvider nesting

**Files:** `src/app/layout.tsx`, `src/app/(group)/layout.tsx`

**Problem:** `UserProvider` is wrapped in both root layout and group layout.

**Impact:** Redundant context, double profile fetches on every page load in the group.

**Fix:** Keep `UserProvider` only in root `layout.tsx`.

---

### 5.3 Medium — Code Quality & Maintainability

#### M1. No input validation / widespread `any` types

**Files:** `createAuctionAction`, `ProductBidPanel`, `OrderTab`, `NotificationBell`, `BidsAccordionList`, and others.

**Problem:** No Zod or schema validation on server actions. TypeScript `any` used extensively.

**Fix:**
- Add `zod` dependency.
- Define schemas for all server action inputs.
- Replace `any` with proper interfaces.

---

#### M2. No automated tests

**Status:** Zero `*.test.*` or `*.spec.*` files. No Jest, Vitest, or Playwright configured. No CI test step.

**Fix:** See [Section 9 — Testing Strategy](#9-testing-strategy).

---

#### M3. Backend not versioned in repository

**Problem:** Supabase Edge Functions, SQL migrations, and RLS policies are not in this repo.

**Impact:** Cannot audit security, reproduce deployments, or collaborate on backend logic.

**Fix:** Add `supabase/` directory with functions, migrations, and seed data.

---

#### M4. Debug logging in production paths

**Files:**
- `src/FunComponents/Context/UserContext.tsx:45` — `console.log(data)`
- `src/FunComponents/profile/OrderTab.tsx:15-34` — debug logs for orders

**Fix:** Remove or gate behind `process.env.NODE_ENV === 'development'`.

---

#### M5. Inconsistent UX error handling

| Pattern | Used In |
|---------|---------|
| Sonner toasts | Most of the app |
| `alert()` | `AddFundsModal.tsx` |
| `window.location.reload()` | `BecomeSellerModal.tsx` |

**Fix:** Standardize on Sonner toasts + `router.refresh()` for state updates.

---

#### M6. Blogs page double-fetch race condition

**File:** `src/app/(group)/blogs/page.tsx` (lines 26–104)

**Problem:** Two `useEffect` hooks both fetch blogs. First resets `currentPage` on filter change while second listens to `currentPage` only — causes redundant API calls and potential race conditions.

**Fix:** Consolidate into a single `useEffect` with proper dependency array.

---

#### M7. ThemeProvider missing

**File:** `src/components/ui/sonner.tsx` imports `useTheme` from `next-themes`, but no `ThemeProvider` exists in the app layout.

**Fix:** Either add `ThemeProvider` to root layout or remove `useTheme` usage from sonner.

---

#### M8. Typo in schema type

**File:** `src/FunComponents/Context/UserContext.tsx:15`

**Problem:** Field named `bidded_ammount` (double 'm') — likely a DB column typo propagated to frontend.

**Fix:** Align naming with database schema (fix DB column if possible, or document the typo).

---

### 5.4 Low — UX Polish Gaps

| ID | Issue | File |
|----|-------|------|
| L1 | Social icons on homepage have no links | `src/app/page.tsx` |
| L2 | Blog share button has no handler | `src/app/(group)/blogs/[id]/page.tsx` |
| L3 | Blog search button is cosmetic (search runs on input) | `src/app/(group)/blogs/page.tsx` |
| L4 | "Verified Account" badge shown unconditionally | Profile page |
| L5 | `buy_now_price` fetched but no Buy Now UI | Product page |
| L6 | Mixed design tokens (hardcoded grays vs design system) | Product page vs profile/blogs |
| L7 | Icon-only buttons lack `aria-label` | Multiple components |
| L8 | Star ratings are clickable divs, not proper inputs | `ProductComments.tsx` |
| L9 | Mobile homepage social dock hidden below `xl` with no alternative | `src/app/page.tsx` |
| L10 | Duplicate `AUTO_DELAY` constant shadowed | `src/FunComponents/ItemsRow.tsx:11,16` |
| L11 | Multiple Supabase client instances created | `AuctionsList.tsx` vs shared client |

---

## 6. Missing Features

Features referenced in marketing copy, FAQ, database schema, or user expectations but **not implemented**:

### 6.1 Core Auction Features

| Feature | Evidence | Priority |
|---------|----------|----------|
| **Buy Now** | `buy_now_price` column fetched on product page | 🔴 High |
| **Wallet balance check before bid** | Only validates bid amount vs current price | 🔴 High |
| **Auction end → winner checkout** | No settlement UI; orders tab is passive | 🔴 High |
| **Configurable bid increments** | Hardcoded +₹10 in `ProductBidPanel.tsx` | 🟡 Medium |
| **Seller edit/delete/end auction early** | Selling tab is read-only list | 🟡 Medium |
| **Reserve / no-reserve auctions** | FAQ text only | 🟡 Medium |
| **Proxy / auto-bidding** | Mentioned on about page only | 🟢 Low |
| **Admin listing moderation** | FAQ mentions "approval" but no admin UI | 🟢 Low |

### 6.2 User Engagement Features

| Feature | Evidence | Priority |
|---------|----------|----------|
| **Watchlist / favorites** | Not present anywhere | 🟡 Medium |
| **Email/SMS outbid alerts** | Notifications table exists; no email integration | 🟡 Medium |
| **Multi-image galleries** | Single `image_url` per auction item | 🟡 Medium |
| **Category-filtered auction browse** | `AuctionByCategory` appears static/marketing | 🟢 Low |

### 6.3 Commerce & Trust Features

| Feature | Evidence | Priority |
|---------|----------|----------|
| **Stripe payment success/cancel pages** | Redirect handling not in repo | 🔴 High |
| **Shipping & tracking** | Orders show status only | 🟡 Medium |
| **Dispute resolution** | Not present | 🟢 Low |
| **Seller analytics dashboard** | Not present | 🟢 Low |

---

## 7. Remediation Plan — Remove Flaws

### Phase 1: Critical Fixes & Quick Wins (Week 1–2)

**Goal:** Close security holes, fix broken UX, establish project hygiene.

| # | Task | Files | Effort | Priority |
|---|------|-------|--------|----------|
| 1.1 | Fix middleware blog route: `/blogs/[id]` → `/blogs/:id` | `src/middleware.ts` | 5 min | P0 |
| 1.2 | Fix OrderTab infinite loading bug (add `finally` block) | `OrderTab.tsx` | 10 min | P0 |
| 1.3 | Wire homepage CTAs with `Link` components | `src/app/page.tsx` | 15 min | P0 |
| 1.4 | Add missing `public/notification.mp3` and `placeholder.jpg` | `public/` | 15 min | P0 |
| 1.5 | Add seller role check in `createAuctionAction` | `auctions.ts` | 30 min | P0 |
| 1.6 | Server-side only fields in auction create (`status`, `current_bid`) | `auctions.ts`, `AddAuctionModal.tsx` | 1 hr | P0 |
| 1.7 | Add Zod validation to `createAuctionAction` | `auctions.ts` | 1 hr | P0 |
| 1.8 | Auth-guard + validate Cloudinary uploads | `cloudinary.ts` | 1 hr | P0 |
| 1.9 | Restrict `next.config.ts` image hostnames | `next.config.ts` | 15 min | P0 |
| 1.10 | Delete `src/lib/Cloudinary/client.ts` | — | 5 min | P0 |
| 1.11 | Gate "Add Auction" UI to sellers only | `SellingProductTab.tsx` | 30 min | P1 |
| 1.12 | Remove duplicate `UserProvider` from group layout | `(group)/layout.tsx` | 15 min | P1 |
| 1.13 | Create `.env.example` with all required variables | root | 30 min | P1 |
| 1.14 | Rewrite `README.md` with setup instructions | `README.md` | 1 hr | P1 |
| 1.15 | Remove unused npm packages | `package.json` | 15 min | P2 |
| 1.16 | Replace `alert()` with Sonner in AddFundsModal | `AddFundsModal.tsx` | 15 min | P2 |
| 1.17 | Replace `window.location.reload()` with `router.refresh()` | `BecomeSellerModal.tsx` | 15 min | P2 |
| 1.18 | Remove debug `console.log` statements | Multiple files | 30 min | P2 |
| 1.19 | Fix blogs page double-fetch race | `blogs/page.tsx` | 1 hr | P2 |
| 1.20 | Add/fix ThemeProvider or remove useTheme | `layout.tsx`, `sonner.tsx` | 30 min | P2 |

**Phase 1 deliverables:**
- [ ] All P0 security fixes merged
- [ ] All broken UI elements fixed
- [ ] `.env.example` and README complete
- [ ] No dead secret files in codebase

---

### Phase 2: Backend Hardening & DevOps (Week 3–4)

**Goal:** Make backend auditable, deployments reproducible, payment flow complete.

| # | Task | Effort | Priority |
|---|------|--------|----------|
| 2.1 | Initialize `supabase/` directory in repo | 2 hr | P0 |
| 2.2 | Export and version all edge function source code | 1 day | P0 |
| 2.3 | Export SQL migrations for all tables | 4 hr | P0 |
| 2.4 | Document and version RLS policies | 4 hr | P0 |
| 2.5 | Audit edge functions: JWT-only identity (remove body `userId`) | 1 day | P0 |
| 2.6 | Replace service role with JWT-scoped client in server actions | 1 day | P1 |
| 2.7 | Add ownership checks on all server action mutations | 4 hr | P1 |
| 2.8 | Add GitHub Actions workflow: lint + build on PR | 2 hr | P1 |
| 2.9 | Create Stripe success page (`/wallet/success`) | 2 hr | P1 |
| 2.10 | Create Stripe cancel page (`/wallet/cancel`) | 1 hr | P1 |
| 2.11 | Add global error boundary component | 2 hr | P2 |
| 2.12 | Standardize error toast messages across app | 2 hr | P2 |
| 2.13 | Add `npm audit` to CI pipeline | 30 min | P2 |

**Phase 2 deliverables:**
- [ ] `supabase/functions/` with all edge function source
- [ ] `supabase/migrations/` with schema + RLS
- [ ] CI pipeline running on every PR
- [ ] Stripe redirect pages working
- [ ] Service role usage minimized and documented

---

### Phase 3: Testing Foundation (Week 5–6)

**Goal:** Prevent regressions on critical paths.

| # | Task | Effort | Priority |
|---|------|--------|----------|
| 3.1 | Install and configure Vitest | 1 hr | P0 |
| 3.2 | Unit tests for `createAuctionAction` (auth, validation, seller gate) | 4 hr | P0 |
| 3.3 | Unit tests for `activateSellerAccount` | 2 hr | P1 |
| 3.4 | Unit tests for Cloudinary upload validation | 2 hr | P1 |
| 3.5 | Install and configure Playwright | 2 hr | P1 |
| 3.6 | E2E: Browse auctions → view product | 4 hr | P1 |
| 3.7 | E2E: Sign in → place bid (mock edge function) | 4 hr | P2 |
| 3.8 | E2E: Seller onboarding flow | 2 hr | P2 |
| 3.9 | Add test step to GitHub Actions CI | 1 hr | P1 |
| 3.10 | Target: 60%+ coverage on server actions | Ongoing | P2 |

**Phase 3 deliverables:**
- [ ] Vitest + Playwright configured
- [ ] Critical server actions have unit tests
- [ ] At least 3 E2E happy-path tests
- [ ] CI runs tests on every PR

---

## 8. New Feature Implementation Plan

### Tier A: Core Auction Completeness (Week 7–9)

**Goal:** Complete the auction lifecycle from listing to purchase.

#### A1. Buy Now Feature

**User story:** As a buyer, I want to instantly purchase an item at a fixed price without waiting for the auction to end.

**Implementation:**

| Step | Detail |
|------|--------|
| Database | `buy_now_price` column already exists on `auction_items` |
| UI | Add "Buy Now for ₹X" button on product page (below bid panel) |
| Logic | New edge function `buy-now`: deduct wallet balance, create order, set `status=sold`, `bought_by=userId` |
| Validation | Check wallet balance ≥ buy_now_price; item must be `status=live` |
| Notification | Notify seller of instant sale |

**Files to create/modify:**
- `src/FunComponents/product/ProductBidPanel.tsx` — add Buy Now button
- `supabase/functions/buy-now/index.ts` — new edge function
- `src/FunComponents/Notification.tsx` — handle buy-now notification type

**Effort:** 2–3 days

---

#### A2. Wallet Balance Check Before Bid

**User story:** As a buyer, I want to know if I have enough wallet balance before placing a bid.

**Implementation:**

| Step | Detail |
|------|--------|
| UI | Show wallet balance on bid panel; disable bid button if balance < bid amount |
| Server | Enforce in `place-bid` edge function: reject if `profiles.wallet_balance < bid_amount` |
| UX | Toast message: "Insufficient wallet balance. Add funds to continue." with link to Add Funds modal |

**Files to modify:**
- `src/FunComponents/product/ProductBidPanel.tsx`
- `supabase/functions/place-bid/index.ts`

**Effort:** 1 day

---

#### A3. Auction End → Winner Checkout Flow

**User story:** As the system, when an auction ends, I want to automatically determine the winner, create an order, and notify both parties.

**Implementation:**

```
Auction ends (ends_at reached)
        │
        ▼
Cron job / Supabase scheduled function
        │
        ├── Query highest bid for auction
        ├── If no bids → set status=expired
        ├── If bids exist:
        │     ├── Set status=sold, bought_by=winner_id
        │     ├── Deduct winner's wallet balance
        │     ├── Create order record (status=pending_payment)
        │     ├── Notify winner: "You won! Complete your purchase."
        │     └── Notify seller: "Your item sold!"
        ▼
Winner sees order in Orders tab
        │
        ▼
Winner confirms → order status=confirmed
        │
        ▼
Seller ships → updates tracking → order status=shipped
```

**Files to create:**
- `supabase/functions/process-ended-auctions/index.ts` — cron handler
- `supabase/migrations/xxx_add_auction_cron.sql` — pg_cron schedule
- `src/FunComponents/profile/OrderTab.tsx` — add "Confirm Purchase" action
- `src/FunComponents/profile/OrderTab.tsx` — add tracking display for sellers

**Effort:** 4–5 days

---

#### A4. Seller Item Management

**User story:** As a seller, I want to edit, end early, or cancel my auction listings.

**Implementation:**

| Action | Rules | UI |
|--------|-------|-----|
| Edit title/description/image | Only if `status=scheduled` or `status=live` with 0 bids | Edit modal in Selling tab |
| End early | Only if `status=live`; triggers winner flow immediately | "End Auction" button with confirmation |
| Cancel | Only if `status=scheduled` or `live` with 0 bids | "Cancel Listing" button |
| Delete | Only if `status=scheduled` with 0 bids | "Delete" button |

**Files to create/modify:**
- `src/FunComponents/Modals/EditAuctionModal.tsx` — new
- `src/FunComponents/profile/SellingProductTab.tsx` — add action buttons
- `src/app/actions/auctions.ts` — add `updateAuctionAction`, `endAuctionAction`, `cancelAuctionAction`

**Effort:** 3–4 days

---

#### A5. Configurable Bid Increments

**User story:** As a platform, I want bid increments to vary by price range or category.

**Implementation:**

| Step | Detail |
|------|--------|
| Database | Add `bid_increment` column to `auction_items` (default 10) or `categories` table |
| UI | Replace hardcoded +₹10 in `ProductBidPanel.tsx` with dynamic increment |
| Validation | `place-bid` enforces: `bid_amount >= current_bid + bid_increment` |

**Effort:** 1 day

---

### Tier B: Engagement & Retention (Week 10–12)

#### B1. Watchlist / Favorites

**User story:** As a buyer, I want to save auctions I'm interested in and get notified of changes.

**Implementation:**

| Step | Detail |
|------|--------|
| Database | New `watchlist` table: `(user_id, auction_id, created_at)` |
| UI | Heart icon on `ItemCard.tsx` and product page |
| Profile | New "Watchlist" tab showing saved auctions with live status |
| Notification | Notify when watched auction is ending soon (1 hour before) |

**Effort:** 3 days

---

#### B2. Email Outbid Alerts

**User story:** As a bidder, I want to receive an email when someone outbids me.

**Implementation:**

| Step | Detail |
|------|--------|
| Service | Integrate Resend or SendGrid |
| Trigger | `place-bid` edge function sends email to previous highest bidder |
| Template | "You've been outbid on [item]. Current bid: ₹X. Place a higher bid now." |
| Preference | User setting to opt in/out of email alerts |

**Effort:** 2–3 days

---

#### B3. Multi-Image Gallery

**User story:** As a seller, I want to upload multiple images for my auction listing.

**Implementation:**

| Step | Detail |
|------|--------|
| Database | New `auction_images` table: `(id, auction_id, image_url, sort_order)` or JSON array on `auction_items` |
| Upload | Extend `AddAuctionModal` to accept multiple files |
| Display | Extend `ProductGallery.tsx` with carousel for multiple images |

**Effort:** 2–3 days

---

#### B4. Category-Filtered Browse

**User story:** As a buyer, I want to browse auctions by category from the homepage.

**Implementation:**

| Step | Detail |
|------|--------|
| UI | Wire `AuctionByCategory.tsx` category cards to `/auction-products?category=X` |
| Backend | `get-auctions` edge function already supports category filter |
| UX | Show active category filter chip on auction listing page |

**Effort:** 1 day

---

#### B5. Proxy / Auto-Bidding

**User story:** As a buyer, I want to set a maximum bid and let the system bid automatically on my behalf.

**Implementation:**

| Step | Detail |
|------|--------|
| Database | New `proxy_bids` table: `(user_id, auction_id, max_amount)` |
| UI | "Set Max Bid" input on product page |
| Logic | `place-bid` checks proxy bids and auto-bids minimum increment for eligible users |
| Rules | Only one proxy bid per user per auction; must be > current bid + increment |

**Effort:** 5–7 days

---

### Tier C: Trust & Scale (Week 13+)

#### C1. Admin Moderation Panel

- Admin role in Clerk (`publicMetadata.role = 'admin'`)
- Admin route: `/admin/auctions` — approve/reject new listings before going live
- Change default auction `status` from `live` to `pending_approval`
- Admin can ban users, remove listings, view reports

**Effort:** 5–7 days

---

#### C2. Reserve Price Auctions

- Add `reserve_price` column (hidden from buyers)
- On auction end: if highest bid < reserve_price → status = `reserve_not_met`
- Seller notified; no order created

**Effort:** 2 days

---

#### C3. Shipping & Tracking

- Order status workflow: `pending` → `confirmed` → `shipped` → `delivered`
- Seller can add tracking number and carrier
- Buyer sees tracking info in Orders tab
- Email notification on status changes

**Effort:** 3–4 days

---

#### C4. Dispute Resolution

- "Report Issue" button on orders
- Dispute table: `(order_id, reporter_id, reason, status, resolution)`
- Admin dashboard to review and resolve disputes
- Hold funds during dispute

**Effort:** 5–7 days

---

#### C5. Seller Analytics Dashboard

- Views per listing, bid count, conversion rate
- Revenue over time chart
- Top-performing categories
- New "Analytics" tab in seller profile

**Effort:** 4–5 days

---

## 9. Testing Strategy

### 9.1 Test Pyramid

```
        ┌─────────┐
        │   E2E   │  Playwright — 5–10 critical path tests
        │  Tests  │
        ├─────────┤
        │ Integr. │  API/edge function tests — bid flow, payment
        │  Tests  │
        ├─────────┤
        │  Unit   │  Vitest — server actions, utilities, validation
        │  Tests  │
        └─────────┘
```

### 9.2 Unit Tests (Vitest)

| Target | Test Cases |
|--------|------------|
| `createAuctionAction` | Rejects unauthenticated; rejects non-seller; rejects missing fields; rejects invalid dates; succeeds for valid seller input |
| `activateSellerAccount` | Rejects if already seller; creates seller profile; updates Clerk metadata |
| `uploadToCloudinary` | Rejects unauthenticated; rejects non-image MIME; rejects oversized file; succeeds for valid image |
| `markNotificationRead` | Marks correct notification; rejects wrong user |
| Zod schemas | Valid/invalid inputs for all action schemas |

### 9.3 E2E Tests (Playwright)

| Test | Steps |
|------|-------|
| Browse auctions | Visit homepage → click "View All Auction" → see auction grid |
| View product | Click auction card → see product detail with bid panel |
| Sign in flow | Click sign in → Clerk modal → redirect back |
| Place bid | Sign in → navigate to product → enter bid → confirm (mock edge function) |
| Seller onboarding | Sign in → profile → "Become a Seller" → fill form → see seller tab |
| Blog read | Visit /blogs → click post → see blog content (no auth required) |

### 9.4 CI Integration

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test        # Vitest
      - run: npm run build
      - run: npx playwright test  # E2E (with mocked backend)
```

---

## 10. DevOps & Documentation Plan

### 10.1 Documentation Deliverables

| Document | Purpose | Priority |
|----------|---------|----------|
| `README.md` | Project overview, setup, features, tech stack | P0 |
| `.env.example` | All required environment variables with descriptions | P0 |
| `docs/ARCHITECTURE.md` | System architecture, data flow, auth flow | P1 |
| `docs/API.md` | Edge function contracts (request/response shapes) | P1 |
| `docs/DATABASE.md` | Schema, RLS policies, relationships | P1 |
| `docs/DEPLOYMENT.md` | Vercel + Supabase deployment steps | P2 |
| `docs/CONTRIBUTING.md` | Code style, PR process, branch strategy | P2 |

### 10.2 Deployment Checklist

- [ ] Vercel project connected to GitHub repo
- [ ] All environment variables set in Vercel dashboard
- [ ] Supabase project provisioned with migrations applied
- [ ] Edge functions deployed to Supabase
- [ ] RLS policies enabled and tested
- [ ] Clerk production instance configured
- [ ] Stripe production keys configured
- [ ] Cloudinary production account configured
- [ ] Custom domain configured (optional)
- [ ] Error monitoring (Sentry) integrated (optional)

---

## 11. Dependency Hygiene

### 11.1 Remove Unused Dependencies

| Package | Reason |
|---------|--------|
| `@stripe/stripe-js` | Never imported — Stripe handled via edge function |
| `next-cloudinary` | Never imported — uses `cloudinary` package directly |
| `react-vertical-timeline-component` | Never imported; pulls legacy Babel 6 transitive deps |

### 11.2 Add Missing Dependencies

| Package | Reason |
|---------|--------|
| `zod` | Input validation for server actions |
| `vitest` | Unit testing (devDependency) |
| `@playwright/test` | E2E testing (devDependency) |

### 11.3 Dependency Risks

| Package | Risk | Mitigation |
|---------|------|------------|
| `next@16.0.10` | Bleeding-edge | Pin version; test thoroughly before upgrades |
| `react@19.2.1` | Ecosystem compatibility | Monitor peer dependency warnings |
| `react-vertical-timeline-component` | Unmaintained, large transitive tree | Remove (unused) |
| No `npm audit` in CI | Unknown vulnerabilities | Add audit step to CI |

---

## 12. Execution Timeline

```
Week 1–2   ████████████████████  Phase 1: Security fixes, bug fixes, docs
Week 3–4   ████████████████████  Phase 2: Backend in repo, CI, Stripe pages
Week 5–6   ████████████████████  Phase 3: Testing foundation
Week 7–9   ████████████████████  Tier A: Buy Now, wallet check, settlement, seller mgmt
Week 10–12 ████████████████████  Tier B: Watchlist, email alerts, gallery, categories
Week 13+   ████████████████████  Tier C: Admin, reserve, shipping, disputes, analytics
```

### Milestone Summary

| Milestone | Week | Definition of Done |
|-----------|------|-------------------|
| **M1: Secure Baseline** | 2 | All P0 security fixes merged; broken UI fixed; README + .env.example |
| **M2: Auditable Backend** | 4 | Edge functions + migrations in repo; CI running; Stripe pages |
| **M3: Test Coverage** | 6 | Vitest + Playwright configured; critical paths tested |
| **M4: Complete Auction Loop** | 9 | Buy Now, wallet checks, auction settlement, seller management |
| **M5: Engagement** | 12 | Watchlist, email alerts, multi-image, category browse |
| **M6: Production Ready** | 16+ | Admin panel, reserve price, shipping, disputes |

---

## 13. Priority Matrix

### Do First (P0) — Blocks production

| Item | Phase |
|------|-------|
| Seller auth on `createAuctionAction` | Phase 1 |
| Fix middleware blog route | Phase 1 |
| Fix OrderTab loading bug | Phase 1 |
| Auth-guard Cloudinary uploads | Phase 1 |
| Version edge functions in repo | Phase 2 |
| Document + audit RLS policies | Phase 2 |
| JWT-only identity in edge functions | Phase 2 |
| `.env.example` + README | Phase 1 |

### Do Next (P1) — Required for launch

| Item | Phase |
|------|-------|
| Buy Now feature | Tier A |
| Wallet balance enforcement | Tier A |
| Auction end → winner checkout | Tier A |
| Seller item management | Tier A |
| Stripe success/cancel pages | Phase 2 |
| GitHub Actions CI | Phase 2 |
| Unit tests for server actions | Phase 3 |
| E2E critical path tests | Phase 3 |

### Do Later (P2) — Post-launch improvements

| Item | Phase |
|------|-------|
| Watchlist / favorites | Tier B |
| Email outbid alerts | Tier B |
| Multi-image gallery | Tier B |
| Proxy / auto-bidding | Tier B |
| Admin moderation panel | Tier C |
| Reserve price auctions | Tier C |
| Shipping & tracking | Tier C |
| Dispute resolution | Tier C |
| Seller analytics | Tier C |

---

## 14. Success Criteria

### Phase 1 Complete When:
- [ ] No user can create an auction without seller role
- [ ] No unauthenticated file uploads possible
- [ ] All homepage buttons navigate correctly
- [ ] Blog pages accessible without login
- [ ] Orders tab handles errors gracefully
- [ ] README explains how to set up the project from scratch

### Phase 2 Complete When:
- [ ] All edge function source code is in the repository
- [ ] SQL migrations can recreate the full database schema
- [ ] RLS policies are documented and tested
- [ ] CI pipeline passes on every PR (lint + build)
- [ ] Stripe payment flow has success and cancel pages

### Phase 3 Complete When:
- [ ] Server actions have ≥ 60% unit test coverage
- [ ] At least 5 E2E tests pass in CI
- [ ] No regressions on critical paths without test failures

### Tier A Complete When:
- [ ] User can Buy Now at fixed price
- [ ] Bids rejected when wallet balance insufficient
- [ ] Ended auctions automatically create orders for winners
- [ ] Sellers can edit, end early, and cancel listings

### Production Ready When:
- [ ] All Phase 1–3 and Tier A items complete
- [ ] Security audit passed (no P0/P1 vulnerabilities)
- [ ] Load tested with 100+ concurrent bidders
- [ ] Error monitoring active
- [ ] Deployment runbook documented

---

## 15. Appendix

### A. File Reference — Key Files by Concern

| Concern | Files |
|---------|-------|
| Authentication | `src/middleware.ts`, `src/FunComponents/Header.tsx` |
| Auction creation | `src/app/actions/auctions.ts`, `src/FunComponents/Modals/AddAuctionModal.tsx` |
| Bidding | `src/FunComponents/product/ProductBidPanel.tsx` |
| Wallet / payments | `src/FunComponents/AddFundsModal.tsx`, `src/FunComponents/Context/UserContext.tsx` |
| Seller onboarding | `src/app/actions/seller-onboarding.ts`, `src/FunComponents/Modals/BecomeSellerModal.tsx` |
| Profile dashboard | `src/app/(group)/profile/page.tsx`, `src/FunComponents/ProfileTabs.tsx` |
| Image uploads | `src/app/actions/cloudinary.ts` |
| Notifications | `src/app/actions/notification.ts`, `src/FunComponents/Notification.tsx` |
| Blog CMS | `src/app/(group)/blogs/`, `src/FunComponents/Modals/EditBlogModal.tsx` |
| Configuration | `next.config.ts`, `package.json`, `.env` |

### B. Edge Function Inventory

| Function | HTTP Method | Auth | Called From |
|----------|-------------|------|-------------|
| `place-bid` | POST | JWT | `ProductBidPanel.tsx` |
| `get-auctions` | POST | None | `AuctionsList.tsx` |
| `create-stripe-session` | POST | JWT | `AddFundsModal.tsx` |
| `send-chat-message` | POST | JWT | `ChatRoom.tsx` |
| `add-comment` | POST | JWT | `ProductComments.tsx` |
| `create-blog` | POST | JWT | `blogs/create/page.tsx` |
| `update-blog` | POST | JWT | `EditBlogModal.tsx` |
| `delete-blog` | POST | JWT | `blogs/manage/page.tsx` |
| `contact-email` | POST | None | `contact/page.tsx` |

### C. Suggested Git Branch Strategy

```
main          ← production-ready code
develop       ← integration branch
feature/*     ← new features (e.g., feature/buy-now)
fix/*         ← bug fixes (e.g., fix/order-tab-loading)
security/*    ← security patches (e.g., security/seller-auth)
```

### D. Glossary

| Term | Definition |
|------|------------|
| RLS | Row Level Security — Supabase/Postgres feature restricting data access per user |
| Edge Function | Serverless function running on Supabase infrastructure |
| Service Role Key | Supabase admin key that bypasses RLS — use only server-side |
| JWT Template | Clerk feature to issue Supabase-compatible JWTs |
| Server Action | Next.js `"use server"` function running on the server |

---

*End of document.*
