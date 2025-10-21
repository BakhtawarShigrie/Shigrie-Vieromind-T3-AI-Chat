import "../styles/globals.css"; 
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "../providers/ThemeProvider";

export const metadata = {
  title: "AI Debate",
  description: "AI-powered debate simulator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}