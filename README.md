# Iron & Fuel — Gym Equipment & Supplements Store

Next.js (App Router) + TypeScript + Tailwind + Prisma/MongoDB + NextAuth + Stripe.

## 1. Install

```bash
npm install
```

This also runs `prisma generate` automatically via `postinstall`.

## 2. Database — MongoDB Atlas

Render doesn't host managed MongoDB, so use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (the free M0 tier is fine for development):

1. Create a free cluster.
2. Create a database user and grab the connection string.
3. Copy `.env.example` to `.env` and set `DATABASE_URL`.

Then push the schema and seed demo data:

```bash
npx prisma db push
npx prisma db seed
```

## 3. Auth

Generate a secret and set it as `AUTH_SECRET` in `.env`:

```bash
openssl rand -base64 33
```

The first user you register is a regular `USER`. To make yourself an admin, either update the role directly in Atlas, or run:

```bash
npx prisma studio
```

and flip `role` to `ADMIN` on your user document.

## 4. Stripe

Set these in `.env`:

- `STRIPE_SECRET_KEY` — from the Stripe Dashboard (use a **test mode** key while developing).
- `STRIPE_WEBHOOK_SECRET` — see below.

Checkout uses Stripe's hosted Checkout page (redirect-based), so no publishable key or Stripe.js is required for the current flow.

### Testing webhooks locally

The webhook at `/api/stripe/webhook` needs to actually receive events from Stripe, which can't reach `localhost` directly. Use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This prints a webhook signing secret (`whsec_...`) — put that in `STRIPE_WEBHOOK_SECRET` for local dev. In production, create a webhook endpoint in the Stripe Dashboard pointed at `https://your-domain.com/api/stripe/webhook` and use the signing secret it gives you.

## 5. Run

```bash
npm run dev
```

## Deploying (Render)

- Create a Render **Web Service** from this repo. Build command: `npm run build`. Start command: `npm run start`.
- Set all the same env vars from `.env` in Render's dashboard (with your production `DATABASE_URL`, live Stripe keys, and a production `AUTH_SECRET`/`NEXTAUTH_URL`).
- Point a Stripe Dashboard webhook endpoint at your Render URL once it's live, and use that endpoint's signing secret for `STRIPE_WEBHOOK_SECRET`.

## Notes on design decisions

- **Money is stored as integer cents**, never `Decimal`/`Float` — MongoDB's Prisma connector doesn't support `Decimal`, and cents avoid floating-point rounding bugs regardless. Use `formatCents()` / `dollarsToCents()` from `src/lib/format.ts` everywhere a price crosses the display/input boundary.
- **Orders embed a snapshot** of product name/image/price at purchase time (`OrderItem.productNameSnapshot` etc.) so order history stays accurate even if a product is later edited or removed. Products should be **soft-deleted** (`isActive: false`), not hard-deleted, since `OrderItem` still references `productId`.
- **Carts require a signed-in user** — there's no guest/localStorage cart. `AddToCartButton` redirects unauthenticated visitors to `/login` and back.
- **Tax is not calculated** (`taxCents` is always `0` in `src/lib/pricing.ts`) — wire up a real provider (Stripe Tax, TaxJar, Avalara) before taking real payments anywhere with a tax obligation.
