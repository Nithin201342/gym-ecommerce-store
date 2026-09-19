import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazily constructs the Stripe client on first real use, rather than at
 * module import time. This matters because importing this module happens
 * just from loading the checkout page (Next.js evaluates server action
 * modules to build the client reference) — if the client were constructed
 * eagerly, a missing STRIPE_SECRET_KEY would crash the whole page on load
 * instead of failing clearly at the moment checkout is actually attempted.
 */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env — see README.md for where to get a test key."
    );
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
  }
  return _stripe;
}
