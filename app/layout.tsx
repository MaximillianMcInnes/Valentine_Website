import "./globals.css";

export const metadata = {
  title: "ifellinlovewithzeldagirl.com",
  description: "A tiny shrine on the internet 💚",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}