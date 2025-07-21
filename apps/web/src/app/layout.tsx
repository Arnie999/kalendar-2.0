import type { Metadata } from 'next';
import './globals.css';
// import { AuthGate } from '@/components/auth/AuthGate';

export const metadata: Metadata = {
  title: 'Edward-Kalendář v2',
  description: 'Systém pro správu směn a mzdy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="antialiased">
      <body className="min-h-screen bg-background text-foreground">
        {/* <AuthGate> */}
          {children}
        {/* </AuthGate> */}
      </body>
    </html>
  );
} 