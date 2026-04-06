"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/Button";
import { formatEur } from "@/lib/format";

export function CartContents() {
  const { lines, setQuantity, removeLine, subtotalEur, clear } = useCart();
  const searchParams = useSearchParams();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("paid") === "1") {
      clear();
      window.history.replaceState({}, "", "/cart");
    }
  }, [searchParams, clear]);

  const startCheckout = useCallback(async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setCheckoutError(data.error ?? "Could not start checkout.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError("Checkout URL was not returned.");
    } catch {
      setCheckoutError("Network error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [lines]);

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-8 text-center">
        <p className="text-orchard/80">Your cart is empty.</p>
        <Button href="/shop" variant="primary" className="mt-6">
          Go to shop
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <ul className="divide-y divide-cream-200 rounded-2xl border border-cream-200 bg-white">
        {lines.map((line) => (
          <li key={line.boxId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href={`/shop/${line.slug}`}
                className="font-medium text-orchard-dark hover:text-must"
              >
                {line.name}
              </Link>
              <p className="text-sm text-orchard/70">{formatEur(line.priceEur)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor={`qty-${line.boxId}`}>
                Quantity
              </label>
              <input
                id={`qty-${line.boxId}`}
                type="number"
                min={1}
                max={99}
                value={line.quantity}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n)) setQuantity(line.boxId, n);
                }}
                className="w-16 rounded-lg border border-cream-200 px-2 py-1.5 text-center text-sm text-orchard-dark"
              />
              <button
                type="button"
                onClick={() => removeLine(line.boxId)}
                className="text-sm font-medium text-russet hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-2xl bg-orchard-dark px-6 py-4 text-cream-50">
        <span className="font-medium">Total</span>
        <span className="font-display text-xl font-semibold">{formatEur(subtotalEur)}</span>
      </div>
      {checkoutError ? (
        <p className="text-sm text-russet" role="alert">
          {checkoutError}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" className="!px-0" onClick={() => clear()}>
          Clear cart
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={checkoutLoading}
          onClick={() => void startCheckout()}
        >
          {checkoutLoading ? "Loading…" : "Pay with Stripe"}
        </Button>
      </div>
    </div>
  );
}
