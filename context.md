# LeaseLens

**LeaseLens** is an AI-powered tool that turns complex rental lease agreements into **plain-language summaries**, **highlights risky clauses**, and helps renters understand what they’re signing **before committing**.

It is designed especially for **student housing**, **immigrant housing**, and **international/foreign renters** who often face language barriers, time pressure, and power imbalances when signing leases.

---

## Target Users

- **Students** (first-time renters, student housing)
- **Immigrants** (ESL renters, unfamiliar with U.S. lease norms)
- **International renters** (foreign housing experience doesn’t match local rules)
- Anyone who needs a fast “is this safe?” overview before signing

---

## Problem Context

### 1) Legal Jargon Barrier
Leases are written in dense legal language that most renters can’t easily interpret.  
**Impact:** people sign without understanding obligations → unexpected fees, penalties, disputes.

### 2) Power Imbalance Between Landlord & Renter
Landlords and property managers understand leases; many renters don’t.  
**Especially:** students, first-time renters, ESL renters.  
**Impact:** renters don’t know what’s risky, unusual, or negotiable.

### 3) Hidden Financial Risk
Clauses that can quietly cost thousands:
- Early termination penalties
- Automatic renewal deadlines
- Security deposit deductions / cleaning fees
- Maintenance responsibility costs  
**Impact:** financial surprises that renters didn’t anticipate.

### 4) Lack of Accessible Legal Guidance
Lawyers are expensive and renters rarely consult one for a lease.  
**Need:** an affordable, fast review that gives clarity + questions to ask.

### 5) ESL & Accessibility Issues
For immigrants/international students:
- Legal English is harder
- Cultural/legal norms differ
- Fear of asking questions  
**Impact:** higher vulnerability to unfair terms.

### 6) Time Pressure
Renters often need housing urgently and feel pressured to sign quickly.  
**Goal:** reduce 20+ pages into a **2-minute risk overview**.

---

## Solution

LeaseLens provides:
- **Plain-English summary** of the lease
- **Risk flags** (red/yellow/green) with the *exact clause text*
- **Financial risk breakdown**
- **Questions to ask the landlord** before signing
- **Translation + voice playback** for accessibility

> LeaseLens is **informational** and **not legal advice**.

---

## Core User Flow

1. **Sign in / Sign out** (Supabase or Firebase authentication)
2. **Upload lease PDF** (or paste text)
3. System processes the lease:
   - Extract text from PDF
   - Detect key clauses and risky patterns
   - Summarize into **simple English**
4. Optional accessibility:
   - Translate the summary into a chosen language (e.g., Google Translate API)
   - Use **ElevenLabs** to generate spoken audio of the summary
5. Results page shows:
   - “2-minute overview”
   - Top risks with clause quotes + page numbers
   - Money terms summary
   - Questions to ask

Optional sharing:
- Use **Twilio SMS** to send the top risks + a secure link to the report.

---

## Key Features (MVP)

### Summary
- 10–15 bullet plain-language summary
- Reading level optimized for non-lawyers

### Risk Highlights
- **Red / Yellow flags**
- Each flag includes:
  - Category (Deposit / Renewal / Fees / Repairs / Entry / Termination)
  - “Why it matters”
  - **Exact clause quote**
  - Page number (if available)

### Money Risk Snapshot
- Deposit terms
- Late fees
- Lease break fees
- Renewal deadlines
- Utilities/maintenance responsibilities

### Questions to Ask
- A short list of negotiation/clarification questions based on detected risk areas

---

## Accessibility Layer

### Translation
- Translate the summary into user-selected languages (e.g., Spanish, Vietnamese, Mandarin)

### Voice (ElevenLabs)
- “Read this summary aloud” in the chosen language
- Helps users with:
  - Low literacy
  - Vision impairment
  - High stress / cognitive load
  - ESL comprehension support

---

## Twilio Integration (Simple + Useful)

- **SMS delivery**: send “Top 5 risks + link”
- **Share mode**: renter can text a parent/roommate/counselor a secure link
- (Optional) Voice hotline: enter a code → listen to the ElevenLabs summary by phone

---

## Responsible AI + Safety Design

- Clear banner: **“Not legal advice. Informational only.”**
- Always **ground flags in the lease text** (quote the clause)
- Show uncertainty when needed (“This clause may be interpreted differently — verify.”)
- Privacy-first defaults:
  - Don’t store leases permanently
  - Auto-delete after a short time window (e.g., 24 hours)
  - Avoid sending sensitive info in SMS (send only a secure link + short summary)
- Minimize user data collected (only what’s needed)

---

## Tech Stack (Proposed)

### Frontend
- React + Vite (JS/TS)
- Tailwind CSS
- UI design: Figma / Excalidraw

### Backend
- Node.js or FastAPI
- Supabase (Auth + storage + DB) or Firebase Auth

### AI / Processing
- PDF text extraction → clause detection → summarization
- AMD hardware acceleration for processing (e.g., running models with torch / local inference where possible)
- LLM option: Gemini (or any chosen model)

### Translation + Voice
- Google Translate API (text translation)
- ElevenLabs (text-to-speech)

### Messaging
- Twilio (SMS sharing / alerts)

---

## MVP Demo Script (60 seconds)

1. Upload a lease PDF  
2. Show “2-minute overview”  
3. Scroll to “Top 5 risky clauses” with highlighted quotes  
4. Click “Translate → Spanish”  
5. Click “Listen” → ElevenLabs reads summary  
6. Click “Send to my phone” → Twilio SMS sends top risks + link

---

## Stretch Goals (Main Track)

- Compare the lease against “common baseline terms” and label clauses as unusual
- A “negotiation helper” section: polite email draft requesting clarifications
- On-device / edge processing option for privacy (AMD story)
- Multi-document support (addendum + house rules + lease)

---
Name of the App: Leasify