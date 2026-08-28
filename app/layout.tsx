import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vebpartner',
  description: 'Discover verified business opportunities, partner programs and platforms.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
