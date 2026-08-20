import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'HackPulse — Discover. Build. Compete.',
  description:
    'Discover verified hackathons across Devfolio, Unstop, Devpost, MLH, and university portals. Track deadlines and automate Discord community alerts.',
  keywords: ['hackathons', 'coding competitions', 'developer events', 'discord bot', 'devfolio', 'unstop'],
  openGraph: {
    title: 'HackPulse — Discover. Build. Compete.',
    description: 'Find verified hackathons and connect alerts to your Discord server.',
    url: 'https://hackpulse.dev',
    siteName: 'HackPulse',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
