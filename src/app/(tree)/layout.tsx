import { BeweWidgets } from "@/components/BeweWidgets";

/** Layout mínimo para /tree (sin nav ni footer de la home). */
export default function TreeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-full">{children}</main>
      <BeweWidgets />
    </>
  );
}
