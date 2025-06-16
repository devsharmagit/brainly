
import { Appbar } from "@/components/AppBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
    <Appbar />
    {children}
    </div>
  );
}
