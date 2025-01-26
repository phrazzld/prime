import { AuthProvider } from '@/app/auth-provider';
import NavBar from '@/app/NavBar';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--code-font'
});

export const metadata = {
  title: 'prime mvp',
  description: 'an anki-like srs built in next 15'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${jetbrains.variable}`}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NavBar />
            <div className="max-w-4xl mx-auto mt-8 px-4">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
