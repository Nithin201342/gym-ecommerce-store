import { z } from "zod";

export const shippingSchema = z.object({
  shippingName: z.string().min(2, "Enter the recipient's full name"),
  shippingAddress: z.string().min(4, "Enter a street address"),
  shippingCity: z.string().min(1, "Enter a city"),
  shippingState: z.string().min(1, "Enter a state/province"),
  shippingZip: z.string().min(3, "Enter a postal code"),
  shippingCountry: z.string().min(2, "Enter a country"),
});

export type ShippingInput = z.infer<typeof shippingSchema>;
