# RoktoBondhu (রক্তবন্ধু)

> **Find blood donors in minutes, not hours.**

An emergency blood donation platform for Bangladesh that connects blood donors with people in need — instantly.

> ⚠️ **Note:** This is an MVP (minimum viable product) built as a learning project to explore Next.js 16, Supabase, and modern full-stack patterns.

- **Live demo:** 
- **Source code:** https://github.com/fahimkarim01/roktobondhu

---

## 1. Project Overview

**The problem:** In Bangladesh, finding a blood donor during a medical emergency often takes hours of frantic Facebook posts and phone calls — time that critically ill patients don't have.

**The solution:** RoktoBondhu connects blood donors with people in need instantly, replacing scattered social-media searches with a single, purpose-built platform.

**Key features:**

- 🔍 Search available donors by blood group in seconds
- 🩸 Post urgent blood requests publicly — no login required
- 👤 Register as a donor and toggle your availability on demand
- 🔐 Phone numbers protected behind authentication to respect donor privacy

---

## 2. Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL, Email/Password Auth via Supabase Auth) |
| **Database** | PostgreSQL — 2 tables (`donors`, `requests`) |
| **Deployment** | Vercel |

**Only external packages:** `@supabase/supabase-js`, `@supabase/ssr`

---

## 3. Features

- **Email/password authentication** via Supabase Auth
- **Register as a blood donor** with blood group and location
- **Search donors by blood group** (login required to view phone numbers)
- **Post urgent blood requests** — public, no login required
- **View all open blood requests** with contact details
- **Role-aware dashboard** with different views for donors vs. non-donors
  - *Donors:* profile management, availability toggle, and open requests in their area
  - *Non-donors:* a quick search form and a link to register

---

## 4. Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/fahimkarim01/roktobondhu.git
cd roktobondhu

# 2. Install dependencies
npm install

# 3. Create a Supabase project at https://supabase.com,
#    then copy your Project URL and anon (public) key.

# 4. Create a .env.local file in the project root (see below)

# 5. Run the development server
npm run dev
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=[PLACEHOLDER_SUPABASE_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PLACEHOLDER_SUPABASE_ANON_KEY]
```

Then visit **[http://localhost:3000](http://localhost:3000)**.

---

## 5. Project Structure

```
roktobondhu/
├── app/                      # Next.js pages (App Router)
│   ├── page.tsx              # Home
│   ├── signup/               # Sign up
│   ├── signin/               # Sign in
│   ├── register/             # Register as donor
│   ├── search/               # Search donors by blood group
│   ├── request/              # Post a blood request
│   ├── requests/             # View open blood requests
│   ├── dashboard/            # Role-aware dashboard
│   └── components/           # Reusable components
│       ├── Navbar.tsx
│       ├── LogoutButton.tsx
│       └── AvailabilityToggle.tsx
├── lib/
│   └── supabase.ts           # Supabase browser & server clients
├── proxy.ts                  # Route protection (Next.js 16 convention)
└── .env.local                # Environment variables (not committed)
```

**Database:** 2 tables only — `donors` and `requests`.

---

## 6. User Flows

**Donor**
```
Sign Up → Confirm Email → Sign In → Register as Donor → Toggle Availability → See Requests in Area
```

**Non-Donor (logged in)**
```
Post Blood Request → Or Sign Up to Search Donors with Phone Numbers
```

**Guest (not logged in)**
```
View Open Requests (public) → Post Request (public) → Or Sign Up
```

---

## 7. Database Schema

### `donors`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key → `auth.users` |
| `name` | `text` | Donor's full name |
| `phone` | `text` | Contact number (login required to view) |
| `blood_group` | `text` | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `district` | `text` | Location |
| `is_available` | `boolean` | Availability for donation |
| `created_at` | `timestamptz` | Record creation time |

### `requests`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `blood_group` | `text` | Blood group needed |
| `hospital_name` | `text` | Where blood is needed |
| `district` | `text` | Location |
| `requester_name` | `text` | Contact person |
| `requester_phone` | `text` | Contact number |
| `is_open` | `boolean` | Whether the request is still active |
| `created_at` | `timestamptz` | Record creation time |

---

## 8. Deployment

Deployed on **Vercel**.

- **Live URL:** [PLACEHOLDER_VERCEL_URL]
- Set the following environment variables in the Vercel dashboard (**Project Settings → Environment Variables**):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 9. Learning & Development Notes

- Built with **AI-assisted development** using Cursor.
- **Key technologies learned:** Next.js 16 Server/Client Components, Supabase Auth & SSR, Row Level Security.
- Authentication uses **`@supabase/ssr`** for cookie-based sessions, so the auth state is readable from Server Components.
- Route protection is handled by **`proxy.ts`** — the Next.js 16 convention that replaces the deprecated `middleware.ts`.

---

## 10. Future Improvements (V2+)

- 📱 SMS notifications to donors via Twilio
- 📍 Geolocation-based matching (GPS coordinates)
- 📧 Email notifications
- 🗓️ Donation history and cooldown enforcement (90 days between donations)
- ✅ Trust badges and verified donors
- 📲 Mobile app (React Native / Expo)

---

## 11. License

Released under the [MIT License](LICENSE).



