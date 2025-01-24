import { AuthProvider } from '@/app/auth-provider';
import NavBar from '@/app/NavBar';
import { Inter } from 'next/font/google';
import './globals.css';

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
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          <div className="max-w-4xl mx-auto mt-8">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
