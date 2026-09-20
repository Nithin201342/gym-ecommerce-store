# NovaFit

NovaFit is a full-stack gym e-commerce website for selling gym equipment, supplements, and fitness accessories.

The project includes:

- Product browsing and category pages
- Product variants such as different colors
- User registration and login
- Shopping cart for signed-in users
- Stripe Checkout payments
- Order history and printable invoices
- Admin dashboard for products, categories, orders, and users
- User blocking and product visibility controls
- Responsive storefront for desktop and mobile

## Technology Used

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **MongoDB Atlas**
- **Auth.js / NextAuth** for login sessions
- **Stripe Checkout** for payments
- **ESLint** for code quality

## Before You Start

Install these tools on your computer:

1. **Node.js 20 or newer**
2. **npm**
3. A free **MongoDB Atlas** account
4. A free **Stripe** account if you want to test payments
5. **Git**, if you downloaded the project using Git

You can check Node.js and npm with:

```bash
node --version
npm --version
```

## Install the Project

Open a terminal in the project folder and install the dependencies:

```bash
npm install
```

This project automatically runs Prisma Client generation after installation.

## Create the Environment File

Create a file named `.env` in the project root. It should be next to `package.json`.

Add the following values:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/novafit?retryWrites=true&w=majority"
AUTH_SECRET="replace-this-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

### What these values mean

- `DATABASE_URL`: The connection string for your MongoDB Atlas database.
- `AUTH_SECRET`: A private key used to protect login sessions.
- `NEXTAUTH_URL`: The address where the app is running locally.
- `STRIPE_SECRET_KEY`: Your Stripe secret key. Use a test key while developing.
- `STRIPE_WEBHOOK_SECRET`: The secret used to verify Stripe webhook events.

Never commit `.env` to Git or share its contents publicly.

### Generate an Auth Secret

You can generate a random secret with OpenSSL:

```bash
openssl rand -base64 33
```

If OpenSSL is not installed, use any secure random string of sufficient length. Do not use a simple word such as `password`.

## Set Up MongoDB Atlas

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free account and a free cluster.
3. Create a database user with a username and password.
4. Add your IP address under **Network Access**.
5. Click **Connect**, choose **Drivers**, and copy the connection string.
6. Replace the username, password, cluster address, and database name in `DATABASE_URL`.

Example:

```env
DATABASE_URL="mongodb+srv://novafit-user:your-password@cluster0.example.mongodb.net/novafit?retryWrites=true&w=majority"
```

If your database password contains special characters, URL-encode them. For example, `@` becomes `%40`.

## Create the Database Structure and Demo Data

After creating `.env`, run:

```bash
npx prisma db push
npx prisma db seed
```

These commands do the following:

- `prisma db push` creates or updates the MongoDB collections from `prisma/schema.prisma`.
- `prisma db seed` adds sample categories and products.

The seed data includes equipment, supplements, and accessories.

To inspect your database visually, run:

```bash
npx prisma studio
```

Prisma Studio opens a browser window where you can view and edit database records.

## Start the Development Server

Run:

```bash
npm run dev
```

Open the website at:

[http://localhost:3000](http://localhost:3000)

The page will refresh automatically when you edit source files.

## Create an Account

1. Open [http://localhost:3000/register](http://localhost:3000/register).
2. Create a user account.
3. Sign in at `/login`.
4. Add products to the cart.

A cart belongs to the signed-in user. Guest users are redirected to the login page before adding products to the cart.

## Make a User an Admin

New accounts have the regular `USER` role. To access the admin dashboard, change the role to `ADMIN`.

1. Start Prisma Studio:

   ```bash
   npx prisma studio
   ```

2. Open the `User` collection.
3. Find your account by email.
4. Change `role` from `USER` to `ADMIN`.
5. Refresh the website and sign in again.

The admin dashboard is available at:

[http://localhost:3000/admin](http://localhost:3000/admin)

Admins can manage:

- Products
- Categories
- Orders
- Users
- Product visibility
- User blocking

## Test Stripe Payments Locally

The application uses Stripe's hosted Checkout page. You do not need Stripe.js or a publishable key for the current implementation.

### 1. Create a Stripe test key

1. Open the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Turn on **Test mode**.
3. Open **Developers > API keys**.
4. Copy the **Secret key** into `.env`:

```env
STRIPE_SECRET_KEY="sk_test_..."
```

### 2. Install the Stripe CLI

Follow the instructions in the [Stripe CLI documentation](https://stripe.com/docs/stripe-cli).

Log in once with:

```bash
stripe login
```

### 3. Forward Stripe events to your local app

Start the Next.js app in one terminal:

```bash
npm run dev
```

In a second terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The Stripe CLI prints a webhook signing secret beginning with `whsec_`.

Copy it into `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Restart the development server after changing `.env`.

### 4. Complete a test order

1. Sign in.
2. Add a product to the cart.
3. Open the cart and continue to checkout.
4. Enter a shipping address.
5. Use a Stripe test card on the hosted Checkout page.

A common Stripe test card is:

```text
4242 4242 4242 4242
```

Use any future expiry date, any three-digit CVC, and any valid postal code.

The webhook marks the order as paid, reduces product stock, and clears the user's cart.

## Useful Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Checks the project with ESLint |
| `npx prisma db push` | Applies the Prisma schema to MongoDB |
| `npx prisma db seed` | Adds the sample products and categories |
| `npx prisma studio` | Opens the database browser |

Before submitting changes, run:

```bash
npm run lint
npm run build
```

## Project Structure

```text
.
├── prisma/
│   ├── schema.prisma       Database models
│   └── seed.ts             Demo categories and products
├── public/                 Images, logo, and static files
├── src/
│   ├── app/                Pages, layouts, and API routes
│   ├── components/         Reusable user interface components
│   ├── lib/                Database, Stripe, cart, pricing, and actions
│   └── types/              TypeScript type extensions
├── auth.ts                 Auth.js configuration
├── next.config.ts          Next.js configuration
├── package.json            Scripts and dependencies
└── README.md               Project documentation
```

### Important folders

- `src/app/(storefront)`: Customer-facing pages such as products, cart, checkout, and orders.
- `src/app/(admin)`: Admin dashboard pages.
- `src/app/(auth)`: Login and registration pages.
- `src/app/api`: API route handlers, including authentication and Stripe webhooks.
- `src/lib/actions`: Server actions that change data, such as adding to a cart or creating checkout sessions.
- `src/lib/products.ts`: Product queries.
- `src/lib/cart.ts`: Cart queries.
- `src/lib/orders.ts`: Order queries and payment fulfillment.
- `prisma/schema.prisma`: The database model definitions.

## Important Project Rules

### Prices use cents

Prices are stored as integers in cents to avoid floating-point errors.

For example:

```text
$49.99 is stored as 4999
```

Use the existing formatting helpers in `src/lib/format.ts` when displaying or converting prices.

### Products are hidden instead of deleted

Products used by previous orders should not be permanently deleted. Set `isActive` to `false` to hide a product from the storefront while keeping old order records valid.

### Carts require login

This project does not use guest carts or local browser storage for cart data. Every cart belongs to a registered user.

### Tax is currently zero

The current pricing logic sets tax to zero. Before launching in a region where tax collection is required, connect a tax service such as Stripe Tax, TaxJar, or Avalara and update `src/lib/pricing.ts`.

### Product images need safe URLs

Remote images must be accessible and should be allowed by the image configuration in `next.config.ts`. If an image does not load, check the URL and the configured remote image hosts.

## Common Problems

### The app says `DATABASE_URL` is missing

Check that:

1. The file is named exactly `.env`.
2. It is in the project root.
3. The variable is written as `DATABASE_URL=...`.
4. You restarted `npm run dev` after editing `.env`.

### Login does not work

Check that:

- `AUTH_SECRET` exists in `.env`.
- The user exists in MongoDB.
- The password was entered correctly.
- The user has not been blocked by an admin.

### Stripe says the webhook signature is invalid

Restart Stripe CLI and copy its newest `whsec_...` value into `STRIPE_WEBHOOK_SECRET`. The secret changes when you start a new Stripe CLI listener.

### Checkout returns to an error page

Check all of the following:

- The development server is running.
- Stripe CLI is forwarding events to `/api/stripe/webhook`.
- `STRIPE_SECRET_KEY` is a test secret key.
- `STRIPE_WEBHOOK_SECRET` matches the currently running Stripe CLI listener.
- `NEXTAUTH_URL` is `http://localhost:3000` for local development.

### A product image is broken

Check that:

- The image URL is publicly accessible.
- The hostname is allowed in `next.config.ts`.
- The URL does not require a login.
- The image is a supported format such as PNG, JPG, JPEG, or WebP.

## Deployment Notes

The project is ready to deploy with [Vercel](https://vercel.com/), which is made by the creators of Next.js.

### Deploy with Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com/).
3. Select **Add New Project**.
4. Import this repository.
5. Keep the detected framework as **Next.js**.
6. Keep the default build settings.
7. Add the production environment variables listed below.
8. Click **Deploy**.

Vercel normally detects these settings automatically:

```text
Build command: npm run build
Output directory: .next
Install command: npm install
```

Add these environment variables in the Vercel project settings. Add them for the **Production** environment, and also for **Preview** if you want to test preview deployments:

- A production MongoDB connection string
- A production `AUTH_SECRET`
- The real production application URL in `NEXTAUTH_URL`
- Stripe live keys only after the application has been tested thoroughly

Example:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/novafit?retryWrites=true&w=majority"
AUTH_SECRET="your-production-random-secret"
NEXTAUTH_URL="https://your-domain.com"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### MongoDB Atlas and Vercel

Vercel runs from changing server IP addresses. In MongoDB Atlas, open **Network Access** and allow Vercel to connect. For a simple deployment, you can temporarily allow access from anywhere with:

```text
0.0.0.0/0
```

Use a strong database password and restrict access more tightly when your infrastructure supports it.

### Stripe webhook on Vercel

After deployment, create a webhook endpoint in the Stripe Dashboard and point it to:

```text
https://your-domain.com/api/stripe/webhook
```

Subscribe the endpoint to the checkout event used by this project:

```text
checkout.session.completed
```

Copy the signing secret generated by Stripe into the Vercel environment variable:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Use Stripe test mode and `sk_test_...` while testing. Switch to live mode and `sk_live_...` only when the production deployment is ready to accept real payments.

After changing environment variables in Vercel, redeploy the project so the new values are available to the application.

## License

This project is private and intended for learning and development unless a separate license is added.
