import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <p className="font-display text-6xl font-semibold text-must">404</p>
          <p className="mt-4 text-orchard/80">Page not found — maybe the cider&apos;s already gone?</p>
          <Link href="/" className="mt-8 text-sm font-semibold text-must hover:underline">
            Back home
          </Link>
        </div>
      </body>
    </html>
  );
}
