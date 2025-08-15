# MenAlsoMatter Staging

A wellness and support platform dedicated to men’s mental health, built with **Next.js**, **Stripe**, and an engagement system based on **credits and reactivation nudges**.

---

## Project Overview

This web application powers **MenAlsoMatter.com**, a platform supporting men’s mental health.  
It allows users to donate securely, earn raffle entries, and stay engaged through a gamified credit system.  

Users not only support the cause through donations but are also motivated to stay active with **credit rewards, prize thresholds, and reactivation bonuses**.

---

## Key Features & Flow

### 1. Home Page (`pages/index.js`)
- Displays the platform’s introduction.
- Buttons for **Donate / Join Raffle** and **Learn More**.
- Progress bar showing community impact.

### 2. Donate Page (`pages/donate.js`)
- Explains donation options.
- **Donate / Join Raffle** button creates a Stripe Checkout session via `/api/create-subscription-session`.

### 3. Learn More Page (`pages/about.js`)
- Outlines the mission, contributor support model, and opportunities for involvement.

### 4. Thank You Page (`pages/thankyou.js`)
- Shown after successful Stripe payment.
- **Enhanced Flow (new):**
  - User’s email is retrieved from Stripe.
  - **Credits are awarded automatically** (configurable in backend).
  - Popup shows:
    - Credits earned in this donation.
    - Current credit balance.
    - Distance to next **prize milestone**.
  - If user was **inactive**, they can reactivate with one click and earn a **bonus credit reward**.
  - Automatic redirect back to Home.

### 5. API Routes
- `/api/create-subscription-session` → Starts Stripe Checkout.
- `/api/webhook-stripe` → Records raffle entries from Stripe.
- **New API additions:**
  - `/api/ping-activity` → Awards credits when activity is detected (e.g., donation).
  - `/api/reactivate` → Handles reactivation requests, grants bonus credits.
  - `/api/get-session` → Fetches Stripe session details (used for Thank You flow).

---

## New Modules Added

###  Module 3 – Credit Earning (Timed & Trigger-Based)
- Users earn credits for:
  - Donations
  - Other configured triggers (extendable).
- **Rules engine** ensures:
  - Some credits cannot directly unlock prizes unless the user completes special actions.
- Engagement popup triggers automatically when user’s credits are close to the **prize threshold**.

**Where to see this:**  
- On the **Thank You Page**, after completing a donation, the popup shows awarded credits and the gap to the next milestone.

---

###  Module 4 – Engagement Nudge
- Detects **inactive users** (days of inactivity configurable via `AppConfig` model).
- Provides **in-app reactivation button** (Thank You Page).
- Grants **bonus credits** on reactivation (configurable).
- Ensures users are brought back into the platform with motivation.

**Where to see this:**  
- If a user marked inactive makes a new donation:
  - They see a **“Reactivate” button** in the Thank You popup.
  - On clicking, they receive bonus credits and their account is reactivated.

---

## Brand & UI

- **Colors**: Navy (#1E3A8A) as primary, Teal (#14B8A6) as accent.
- **Typography**:  
  - Lato Bold → headlines  
  - Open Sans Regular → body text  
- **UI Style**: Rounded cards, gentle shadows, clear buttons (solid and ghost), animated progress indicators, engagement popups.

---

## Deployment

- Vercel
- Environment variables required in `.env.local`:
  - NEXT_PUBLIC_BASE_URL=http://localhost:3000
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - STRIPE_PRICE_ID
  - MONGODB_URI

---

## Setup

1. Clone the repo  
   ```bash
   git clone https://github.com/sidhantgautam/Menalsomatter.git
   cd menalso-matter
