import type { PublicListingTrip } from "@/types/trip";

export function formatTripPrice({
  discountPrice,
  price,
  currency,
}: Pick<PublicListingTrip, "discountPrice" | "price" | "currency">) {
  const amount = discountPrice ?? price;
  if (
    amount == null ||
    !Number.isFinite(Number(amount)) ||
    !/^[A-Z]{3}$/i.test(currency)
  )
    return null;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
