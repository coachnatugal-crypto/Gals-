import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin eventos | GAL'S Studio",
  robots: { index: false, follow: false },
};

/**
 * Layout del panel admin — sin chrome de la landing pública.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-full bg-gals-mist text-gals-ink">{children}</main>
  );
}
