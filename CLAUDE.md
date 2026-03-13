# QRForge - AI QR Code Generator

## Project Overview
Build a modern AI-powered QR code generator SaaS inspired by qrcode-ai.com. The product lets users create beautiful, customizable QR codes with AI-generated artistic designs, track scans, and manage campaigns.

**Brand Name:** QRForge
**Tagline:** "Forge stunning QR codes with AI"

## Tech Stack (STRICT - do not deviate)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (Google + GitHub + email/password)
- **Payments:** Stripe (subscriptions)
- **Storage:** MinIO (S3-compatible) for QR code images
- **QR Generation:** `qrcode` npm package for base QR + canvas manipulation
- **AI Art:** Stable Diffusion API (Replicate/Fal.ai) for artistic QR codes

## Superpowers Skills (MUST USE)
You have access to superpowers skills. Use them in this order for every feature:

1. **Before ANY implementation:** Use `/superpowers:brainstorming` to explore the feature design
2. **Before coding:** Use `/superpowers:writing-plans` to create a step-by-step plan
3. **When implementing:** Use `/superpowers:test-driven-development` - write tests FIRST
4. **When executing plans:** Use `/superpowers:executing-plans` for systematic execution
5. **Before claiming done:** Use `/superpowers:verification-before-completion` to verify everything works
6. **After major features:** Use `/superpowers:requesting-code-review` to review quality

## Core Features to Build

### Phase 1 - MVP (Build This First)
1. **Landing Page** - Modern, conversion-focused with hero, features, pricing sections
2. **QR Code Generator** (free tier)
   - URL, text, WiFi, vCard, email, phone QR types
   - Color customization (foreground, background, gradient)
   - Logo/image overlay on QR code
   - Shape customization (dots, rounded, square patterns)
   - Download as PNG, SVG, PDF
3. **User Auth** - Sign up, login, Google/GitHub OAuth
4. **Dashboard** - Manage created QR codes
5. **Basic Analytics** - Scan count per QR code

### Phase 2 - Monetization
6. **AI Art QR Codes** - Generate artistic QR codes using AI (premium feature)
7. **Stripe Subscriptions** - Free / Pro ($9/mo) / Business ($29/mo) plans
8. **Advanced Analytics** - Scan location, device type, time charts
9. **Bulk Generation** - Upload CSV, generate multiple QR codes
10. **API Access** - REST API for programmatic QR generation

### Phase 3 - Growth
11. **Templates Library** - Pre-designed QR code templates
12. **Custom Domains** - White-label QR code short URLs
13. **Team Features** - Invite team members, shared workspace

## Database Schema (Prisma)
Design tables for: User, Subscription, QRCode, QRScan, Template, ApiKey

## Pricing Plans
- **Free:** 10 QR codes/month, basic customization, no analytics
- **Pro ($9/mo):** Unlimited QR codes, AI art, analytics, logo overlay
- **Business ($29/mo):** Everything in Pro + API access, bulk generation, custom domains, team

## Design Guidelines
- Clean, modern SaaS aesthetic
- Dark mode support
- Mobile-responsive
- Fast loading (optimize images, lazy load)
- Inspired by qrcode-ai.com but with our own brand identity

## File Structure
```
src/
  app/
    (marketing)/        # Landing, pricing, about pages
    (auth)/             # Login, register, verify
    dashboard/          # User dashboard
    generator/          # QR code generator tool
    api/                # API routes
  components/
    ui/                 # shadcn/ui components
    qr/                 # QR code specific components
    layout/             # Header, footer, sidebar
  lib/
    prisma.ts           # Prisma client
    stripe.ts           # Stripe helpers
    auth.ts             # Auth config
    qr/                 # QR generation logic
    minio.ts            # MinIO client
  types/
```

## Environment Variables Needed
```
DATABASE_URL=postgresql://qrforge:qrforge@localhost:5433/qrforge
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
MINIO_ENDPOINT=localhost
MINIO_PORT=9002
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
REPLICATE_API_TOKEN=
```

## Commands
- `npm run dev` - Start dev server
- `npx prisma migrate dev` - Run migrations
- `npx prisma studio` - Database GUI
- `npm run build` - Production build
- `npm test` - Run tests

## Important Notes
- Use server components where possible, client components only when needed
- All API routes should validate input with zod
- Use proper error handling and loading states
- Implement rate limiting on public endpoints
- QR code scanning endpoint must be fast (redirect endpoint)
- Store QR images in MinIO, serve via signed URLs
