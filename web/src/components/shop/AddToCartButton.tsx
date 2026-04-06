"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/Button";

type Props = {
  boxId: string;
  slug: string;
  name: string;
  priceEur: number;
  disabled?: boolean;
  disabledReason?: string;
};

export function AddToCartButton({
  boxId,
  slug,
  name,
  priceEur,
  disabled,
  disabledReason,
}: Props) {
  const { addBox } = useCart();

  if (disabled) {
    return (
      <p className="text-sm text-russet" role="status">
        {disabledReason ?? "Not available to order right now."}
      </p>
    );
  }

  return (
    <Button
      type="button"
      variant="primary"
      className="w-full sm:w-auto"
      onClick={() => addBox({ boxId, slug, name, priceEur }, 1)}
    >
      Add to cart
    </Button>
  );
}
