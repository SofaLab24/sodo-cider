import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-orchard text-cream-50 shadow-md hover:bg-orchard-light focus-visible:ring-orchard",
  secondary:
    "border border-orchard/25 bg-white text-orchard hover:border-must/50 hover:bg-cream-50 focus-visible:ring-must",
  ghost: "text-orchard underline-offset-4 hover:underline focus-visible:ring-orchard",
};

type Base = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonProps =
  | (Base & { href: string } & Omit<ComponentProps<typeof Link>, "children" | "className">)
  | (Base & { href?: undefined } & ComponentProps<"button">);

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ComponentProps<"button">;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
