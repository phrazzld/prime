import { AuthProvider } from '@/app/auth-provider';
import NavBar from '@/app/NavBar';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      {/* data-theme is handled dynamically by ThemeProvider */}
      <body className={inter.className}>
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
