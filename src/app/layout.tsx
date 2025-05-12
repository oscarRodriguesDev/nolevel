import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "./(auth)/auth/AuthContext";


const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "No-Level Admn",
  description: "Landing Page No-Level",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      
        <ThemeProvider attribute="class">
      <AuthProvider>
            <div>
              {children}
              </div>
          </AuthProvider>
        </ThemeProvider>
       
      </body>
    </html>
  );
}
