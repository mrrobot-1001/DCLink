import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DCLink - Connect and Discuss",
  description: "A modern forum application for connecting people",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
