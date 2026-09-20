"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/admin-actions";
import type { Category, ProductType } from "@prisma/client";

type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  images: string[];
  stock: number;
  type: ProductType;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  variantGroup: string | null;
  color: string | null;
  equipmentDetails: {
    material: string | null;
    dimensions: string | null;
    weightKg: number | null;
    maxUserWeightKg: number | null;
    warrantyMonths: number | null;
    assemblyRequired: boolean;
  } | null;
  supplementDetails: {
    servingSize: string | null;
    servingsPerContainer: number | null;
    flavor: string | null;
    ingredients: string | null;
    allergenInfo: string | null;
    nutritionFacts: unknown;
  } | null;
};

type ProductChoice = {
  id: string;
  name: string;
  type: ProductType;
  variantGroup: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toNum(s: string): number | undefined {
  if (s.trim() === "") return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_15px_35px_rgba(17,17,17,0.04)]">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  );
}

export function ProductForm({
  categories,
  productChoices,
  initialProduct,
}: {
  categories: Category[];
  productChoices: ProductChoice[];
  initialProduct?: InitialProduct;
}) {
  const router = useRouter();
  const isEditing = !!initialProduct;
  const nutritionFacts = (initialProduct?.supplementDetails?.nutritionFacts ??
    {}) as Record<string, number | undefined>;

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [description, setDescription] = useState(
    initialProduct?.description ?? ""
  );
  const [price, setPrice] = useState(
    initialProduct ? (initialProduct.priceCents / 100).toString() : ""
  );
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPriceCents != null
      ? (initialProduct.compareAtPriceCents / 100).toString()
      : ""
  );
  const [imageUrl, setImageUrl] = useState(initialProduct?.images[0] ?? "");
  const [stock, setStock] = useState(
    initialProduct ? initialProduct.stock.toString() : "0"
  );
  const [type, setType] = useState<ProductType>(
    initialProduct?.type ?? "EQUIPMENT"
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId ?? categories[0]?.id ?? ""
  );
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(
    initialProduct?.isFeatured ?? false
  );
  const [variantOfProductId, setVariantOfProductId] = useState(() => {
    if (!initialProduct?.variantGroup) return "";
    return (
      productChoices.find(
        (product) =>
          product.variantGroup === initialProduct.variantGroup &&
          product.id !== initialProduct.id
      )?.id ?? ""
    );
  });
  const [color, setColor] = useState(initialProduct?.color ?? "");

  // Equipment fields
  const [material, setMaterial] = useState(
    initialProduct?.equipmentDetails?.material ?? ""
  );
  const [dimensions, setDimensions] = useState(
    initialProduct?.equipmentDetails?.dimensions ?? ""
  );
  const [weightKg, setWeightKg] = useState(
    initialProduct?.equipmentDetails?.weightKg?.toString() ?? ""
  );
  const [maxUserWeightKg, setMaxUserWeightKg] = useState(
    initialProduct?.equipmentDetails?.maxUserWeightKg?.toString() ?? ""
  );
  const [warrantyMonths, setWarrantyMonths] = useState(
    initialProduct?.equipmentDetails?.warrantyMonths?.toString() ?? ""
  );
  const [assemblyRequired, setAssemblyRequired] = useState(
    initialProduct?.equipmentDetails?.assemblyRequired ?? false
  );

  // Supplement fields
  const [servingSize, setServingSize] = useState(
    initialProduct?.supplementDetails?.servingSize ?? ""
  );
  const [servingsPerContainer, setServingsPerContainer] = useState(
    initialProduct?.supplementDetails?.servingsPerContainer?.toString() ?? ""
  );
  const [flavor, setFlavor] = useState(
    initialProduct?.supplementDetails?.flavor ?? ""
  );
  const [ingredients, setIngredients] = useState(
    initialProduct?.supplementDetails?.ingredients ?? ""
  );
  const [allergenInfo, setAllergenInfo] = useState(
    initialProduct?.supplementDetails?.allergenInfo ?? ""
  );
  const [calories, setCalories] = useState(
    nutritionFacts.calories?.toString() ?? ""
  );
  const [proteinG, setProteinG] = useState(
    nutritionFacts.protein_g?.toString() ?? ""
  );
  const [carbsG, setCarbsG] = useState(
    nutritionFacts.carbs_g?.toString() ?? ""
  );
  const [fatG, setFatG] = useState(nutritionFacts.fat_g?.toString() ?? "");
  const [sugarG, setSugarG] = useState(
    nutritionFacts.sugar_g?.toString() ?? ""
  );

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice.trim() === "" ? null : Number(compareAtPrice),
      imageUrl: imageUrl.trim() === "" ? null : imageUrl.trim(),
      stock: Math.max(0, Math.trunc(Number(stock) || 0)),
      type,
      categoryId,
      isActive,
      isFeatured,
      variantOfProductId: variantOfProductId || null,
      color: color.trim() || null,
      equipment:
        type === "EQUIPMENT"
          ? {
            material: material || undefined,
            dimensions: dimensions || undefined,
            weightKg: toNum(weightKg),
            maxUserWeightKg: toNum(maxUserWeightKg),
            warrantyMonths: toNum(warrantyMonths),
            assemblyRequired,
          }
          : null,
      supplement:
        type === "SUPPLEMENT"
          ? {
            servingSize: servingSize || undefined,
            servingsPerContainer: toNum(servingsPerContainer),
            flavor: flavor || undefined,
            ingredients: ingredients || undefined,
            allergenInfo: allergenInfo || undefined,
            calories: toNum(calories),
            proteinG: toNum(proteinG),
            carbsG: toNum(carbsG),
            fatG: toNum(fatG),
            sugarG: toNum(sugarG),
          }
          : null,
    };

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(initialProduct.id, payload)
        : await createProduct(payload);

      if (result.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Section title="Basics">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Slug">
          <input
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="Image URL">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        {imageUrl && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
              Preview
            </p>
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <img
                src={imageUrl}
                alt={name || "Product preview"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}
      </Section>

      <Section title="Pricing & inventory">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Price (USD)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Compare-at price (optional)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              step="1"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Type">
        <div className="flex gap-3">
          {(["EQUIPMENT", "SUPPLEMENT", "ACCESSORY"] as ProductType[]).map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${type === t
                  ? "bg-emerald-500 text-neutral-950"
                  : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </Section>

      {type === "ACCESSORY" && (
        <Section title="Variants">
          <Field label="Color">
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Black, white, red..."
              className={inputClass}
            />
          </Field>
          <Field label="Group with an existing product">
            <select
              value={variantOfProductId}
              onChange={(e) => setVariantOfProductId(e.target.value)}
              className={inputClass}
            >
              <option value="">Standalone product</option>
              {productChoices
                .filter((product) => product.type === "ACCESSORY")
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                    {product.variantGroup ? " (variant family)" : ""}
                  </option>
                ))}
            </select>
            <p className="mt-1.5 text-xs text-neutral-500">
              Choose the existing t-shirt so customers can switch colors from one product page.
            </p>
          </Field>
        </Section>
      )}

      {type === "EQUIPMENT" && (
        <Section title="Equipment specs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Material">
              <input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Dimensions">
              <input
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Max user weight (kg)">
              <input
                type="number"
                step="0.1"
                value={maxUserWeightKg}
                onChange={(e) => setMaxUserWeightKg(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Warranty (months)">
              <input
                type="number"
                step="1"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={assemblyRequired}
              onChange={(e) => setAssemblyRequired(e.target.checked)}
            />
            Assembly required
          </label>
        </Section>
      )}

      {type === "SUPPLEMENT" && (
        <Section title="Supplement facts">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Serving size">
              <input
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Servings per container">
              <input
                type="number"
                step="1"
                value={servingsPerContainer}
                onChange={(e) => setServingsPerContainer(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Flavor">
              <input
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Allergen info">
              <input
                value={allergenInfo}
                onChange={(e) => setAllergenInfo(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Ingredients">
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Field label="Calories">
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Protein (g)">
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Carbs (g)">
              <input
                type="number"
                value={carbsG}
                onChange={(e) => setCarbsG(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Fat (g)">
              <input
                type="number"
                value={fatG}
                onChange={(e) => setFatG(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Sugar (g)">
              <input
                type="number"
                value={sugarG}
                onChange={(e) => setSugarG(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>
      )}

      <Section title="Visibility">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active (visible in store)
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured on homepage
        </label>
      </Section>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Saving..." : isEditing ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
