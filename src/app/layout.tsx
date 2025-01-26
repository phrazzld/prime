import { AuthProvider } from "@/app/auth-provider";
import NavBar from "@/app/NavBar";
import { ThemeProvider } from "@/app/ThemeProvider";
import "./globals.css";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--code-font" });

export const metadata = {
  title: "prime mvp",
  description: "an anki-like srs built in next 15",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NavBar />
            <main className="max-w-4xl mx-auto px-4 py-8 fade-in-up">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
