import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sodo Sidrinė — cider from our orchard",
  description:
    "Lithuanian orchard cider: dry and sweeter styles, gift boxes. Sodo Sidrinė.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
