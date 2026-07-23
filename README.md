# RoktoBondhu (রক্তবন্ধু)

> **Find blood donors in minutes, not hours.**

An emergency blood donation platform for Bangladesh that connects blood donors with people in need — instantly.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-roktobondhu--bd.vercel.app-blue?style=for-the-badge&logo=vercel)](https://roktobondhu-bd.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-fahimkarim01/roktobondhu-black?style=for-the-badge&logo=github)](https://github.com/fahimkarim01/roktobondhu)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## Overview

**The problem:** Finding a blood donor during a medical emergency in Bangladesh often takes hours of frantic Facebook posts and phone calls — time critically ill patients don't have.

**The solution:** RoktoBondhu connects blood donors with people in need instantly through a single, purpose-built platform.

**This is an MVP** built to explore Next.js 16, Supabase, and modern full-stack patterns.

---

## Features

- **Search donors by blood group** — Find available donors in seconds (login required to view phone numbers)
- **Post urgent blood requests** — Public, no login required
- **Donor registration** — Register with blood group, location, and availability toggle
- **Role-aware dashboard** — Different views for donors vs. non-donors
- **Privacy-first** — Phone numbers protected behind authentication
- **Simple authentication** — Email/password via Supabase Auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth) |
| Database | PostgreSQL (2 tables: `donors`, `requests`) |
| Deployment | Vercel |

---

## User Flows

**Donor:**

Sign Up → Confirm Email → Sign In → Register as Donor → Toggle Availability


**Non-Donor (Logged In):**

Post Blood Request → Search Donors (with phone numbers)


**Guest (Not Logged In):**

View Open Requests (public) → Post Request (public) → Sign Up


---

## Project Structure

roktobondhu/
├── app/
│ ├── page.tsx # Home
│ ├── signup/ # Sign up
│ ├── signin/ # Sign in
│ ├── register/ # Register as donor
│ ├── search/ # Search donors by blood group
│ ├── request/ # Post blood request
│ ├── requests/ # View open requests
│ ├── dashboard/ # Role-aware dashboard
│ └── components/
│ ├── Navbar.tsx
│ ├── LogoutButton.tsx
│ └── AvailabilityToggle.tsx
├── lib/
│ └── supabase.ts # Supabase clients
├── proxy.ts # Route protection
└── .env.local # Environment variables (not committed)


---

## Database Schema

### `donors`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key → `auth.users` |
| `name` | `text` | Donor's full name |
| `phone` | `text` | Contact (login required to view) |
| `blood_group` | `text` | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `district` | `text` | Location |
| `is_available` | `boolean` | Donation availability |
| `created_at` | `timestamptz` | Record creation time |

### `requests`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `blood_group` | `text` | Blood group needed |
| `hospital_name` | `text` | Hospital/location name |
| `district` | `text` | Location |
| `requester_name` | `text` | Contact person |
| `requester_phone` | `text` | Contact number |
| `is_open` | `boolean` | Request status |
| `created_at` | `timestamptz` | Record creation time |

---

## Quick Start

**1. Clone and install:**
```bash
git clone https://github.com/fahimkarim01/roktobondhu.git
cd roktobondhu
npm install
```

**2. Create Supabase project:**
- Go to https://supabase.com and create a new project
- Copy your Project URL and anon (public) key

**3. Set environment variables:**

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**4. Run development server:**
```bash
npm run dev
```

Visit http://localhost:3000

---

## Deployment

**Vercel:**
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in **Project Settings → Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Live URL: https://roktobondhu-bd.vercel.app/

---

## Key Technologies

- **Next.js 16 Server/Client Components** — Hybrid rendering
- **Supabase Auth + SSR** — Cookie-based sessions readable from Server Components
- **Row Level Security** — Database-level access control
- **Route Protection** — `proxy.ts` (Next.js 16 convention)

---

## Limitations

- SMS/email notifications not yet implemented
- No geolocation-based matching
- No donation history or cooldown enforcement
- MVP scope — designed as a learning project

---

## Future Improvements

- SMS notifications (Twilio)
- Geolocation-based donor matching
- Email notifications
- Donation history with 90-day cooldown
- Verified donor badges
- Mobile app (React Native/Expo)

---

## License

[MIT License](LICENSE)

---

## Author

Md. Fahim Karim  
GitHub: [@fahimkarim01](https://github.com/fahimkarim01)

---

## Feedback

[Open an issue →](https://github.com/fahimkarim01/roktobondhu/issues)
