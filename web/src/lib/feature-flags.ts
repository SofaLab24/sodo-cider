/** When `NEXT_PUBLIC_ENABLE_SHOP` is exactly `"false"`, shop, cart, checkout and Stripe admin are off. */
export function isShopEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SHOP !== "false";
}
