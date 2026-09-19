import { PrismaClient, ProductType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Stand-in product images. Earlier drafts of this seed file hand-picked
 * specific Unsplash photo IDs from memory without verifying they actually
 * resolved — one (the whey protein image) was broken. placehold.co is a
 * dependable, actively-maintained placeholder service, so these are
 * guaranteed to render. Swap these for real product photography before
 * going live (see the `images` field on each product below).
 */
function placeholderImage(label: string) {
  return `https://placehold.co/800x800/171717/10b981?text=${encodeURIComponent(
    label
  )}`;
}

async function main() {
  // Categories
  const [strength, cardio, protein, preworkout, accessories] =
    await Promise.all([
      prisma.category.upsert({
        where: { slug: "strength-equipment" },
        update: {},
        create: {
          name: "Strength Equipment",
          slug: "strength-equipment",
          description: "Barbells, racks, benches, and free weights.",
        },
      }),
      prisma.category.upsert({
        where: { slug: "cardio-equipment" },
        update: {},
        create: {
          name: "Cardio Equipment",
          slug: "cardio-equipment",
          description: "Treadmills, bikes, and rowers.",
        },
      }),
      prisma.category.upsert({
        where: { slug: "protein-supplements" },
        update: {},
        create: {
          name: "Protein Supplements",
          slug: "protein-supplements",
          description: "Whey, casein, and plant-based protein.",
        },
      }),
      prisma.category.upsert({
        where: { slug: "pre-workout" },
        update: {},
        create: {
          name: "Pre-Workout",
          slug: "pre-workout",
          description: "Energy and focus formulas.",
        },
      }),
      prisma.category.upsert({
        where: { slug: "accessories" },
        update: {},
        create: {
          name: "Accessories",
          slug: "accessories",
          description: "Belts, straps, gloves, and shakers.",
        },
      }),
    ]);

  // Equipment product
  await prisma.product.upsert({
    where: { slug: "olympic-barbell-20kg" },
    update: { images: [placeholderImage("Olympic Barbell")] },
    create: {
      name: "Olympic Barbell 20kg",
      slug: "olympic-barbell-20kg",
      description:
        "A competition-grade 20kg Olympic barbell with 190,000 PSI tensile strength steel and dual knurl marks for powerlifting and Olympic lifts.",
      priceCents: 24999,
      compareAtPriceCents: 29999,
      images: [placeholderImage("Olympic Barbell")],
      stock: 18,
      type: ProductType.EQUIPMENT,
      isFeatured: true,
      categoryId: strength.id,
      equipmentDetails: {
        create: {
          material: "190,000 PSI steel, chrome finish",
          dimensions: "220 x 5 cm",
          weightKg: 20,
          maxUserWeightKg: 450,
          warrantyMonths: 60,
          assemblyRequired: false,
        },
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "adjustable-power-rack" },
    update: { images: [placeholderImage("Power Rack")] },
    create: {
      name: "Adjustable Power Rack",
      slug: "adjustable-power-rack",
      description:
        "Heavy-gauge steel power rack with adjustable J-cups, safety bars, and pull-up bar. Built for home gyms that need commercial-grade stability.",
      priceCents: 64999,
      images: [placeholderImage("Power Rack")],
      stock: 6,
      type: ProductType.EQUIPMENT,
      categoryId: strength.id,
      equipmentDetails: {
        create: {
          material: "11-gauge steel",
          dimensions: "130 x 145 x 210 cm",
          weightKg: 95,
          maxUserWeightKg: 360,
          warrantyMonths: 36,
          assemblyRequired: true,
        },
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "folding-treadmill-pro" },
    update: { images: [placeholderImage("Treadmill")] },
    create: {
      name: "Folding Treadmill Pro",
      slug: "folding-treadmill-pro",
      description:
        "Space-saving folding treadmill with a 3.5HP motor, 12 incline levels, and a shock-absorbing deck for daily training.",
      priceCents: 89999,
      images: [placeholderImage("Treadmill")],
      stock: 3,
      type: ProductType.EQUIPMENT,
      isFeatured: true,
      categoryId: cardio.id,
      equipmentDetails: {
        create: {
          material: "Steel frame, rubber deck",
          dimensions: "160 x 75 x 130 cm",
          weightKg: 62,
          maxUserWeightKg: 130,
          warrantyMonths: 24,
          assemblyRequired: true,
        },
      },
    },
  });

  // Supplement products
  await prisma.product.upsert({
    where: { slug: "whey-protein-chocolate-2kg" },
    update: { images: [placeholderImage("Whey Protein")] },
    create: {
      name: "Whey Protein Isolate — Chocolate, 2kg",
      slug: "whey-protein-chocolate-2kg",
      description:
        "Fast-absorbing whey isolate with 27g of protein per serving and minimal fat or lactose. Mixes clean, tastes like a milkshake.",
      priceCents: 5499,
      images: [placeholderImage("Whey Protein")],
      stock: 120,
      type: ProductType.SUPPLEMENT,
      isFeatured: true,
      categoryId: protein.id,
      supplementDetails: {
        create: {
          servingSize: "30g (1 scoop)",
          servingsPerContainer: 66,
          flavor: "Chocolate",
          ingredients:
            "Whey protein isolate, cocoa powder, natural flavors, sunflower lecithin, stevia leaf extract.",
          nutritionFacts: {
            calories: 120,
            protein_g: 27,
            carbs_g: 2,
            fat_g: 1,
            sugar_g: 1,
          },
          allergenInfo: "Contains milk. Processed in a facility that handles soy and tree nuts.",
        },
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "pre-workout-blue-raspberry" },
    update: { images: [placeholderImage("Pre-Workout")] },
    create: {
      name: "Pre-Workout Ignite — Blue Raspberry",
      slug: "pre-workout-blue-raspberry",
      description:
        "300mg caffeine, citrulline malate, and beta-alanine for sustained energy and pump without the crash.",
      priceCents: 3999,
      images: [placeholderImage("Pre-Workout")],
      stock: 75,
      type: ProductType.SUPPLEMENT,
      categoryId: preworkout.id,
      supplementDetails: {
        create: {
          servingSize: "12g (1 scoop)",
          servingsPerContainer: 30,
          flavor: "Blue Raspberry",
          ingredients:
            "Citrulline malate, beta-alanine, caffeine anhydrous, L-tyrosine, natural and artificial flavors.",
          nutritionFacts: {
            calories: 10,
            caffeine_mg: 300,
            carbs_g: 2,
          },
          allergenInfo: "Manufactured in a facility that also processes milk and soy.",
        },
      },
    },
  });

  // Accessory (no equipment/supplement details — exercises the "neither" path)
  await prisma.product.upsert({
    where: { slug: "leather-lifting-belt" },
    update: { images: [placeholderImage("Lifting Belt")] },
    create: {
      name: "Leather Lifting Belt",
      slug: "leather-lifting-belt",
      description:
        "10mm single-prong leather belt for squats and deadlifts. Provides consistent core bracing under heavy load.",
      priceCents: 4999,
      images: [placeholderImage("Lifting Belt")],
      stock: 40,
      type: ProductType.ACCESSORY,
      categoryId: accessories.id,
      specifications: {
        width_cm: 10,
        thickness_mm: 10,
        material: "Full-grain leather",
        sizes: ["S", "M", "L", "XL"],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
