import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';
import { TopTacticalHUD } from '../components/navigation/TopTacticalHUD';
import { SeasonProvider } from '../lib/context/SeasonContext';
import { SeasonSelectorPill } from '../components/navigation/SeasonSelectorPill';
import { Footer } from '../components/navigation/Footer';
import { CommandPalette } from '../components/ux/CommandPalette';
import { FirstVisitTip } from '../components/ux/FirstVisitTip';

const sora = localFont({
  src: [
    {
      path: './fonts/sora/Sora-VariableFont_wght.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  weight: '100 800',
});

export const metadata: Metadata = {
  title: 'GP-Dashboard | MotoGP™ Live Telemetry & Pitwall',
  description:
    'Dedicated MotoGP telemetry dashboard: 68° lean angle dynamics, Michelin asymmetric tyre thermal stress, Brembo carbon braking zones, TV delay buffer, and live pitwall timing.',
  keywords: ['MotoGP', 'Live Session', 'Lean Angle', 'Telemetry', 'Tyre Degradation', 'Brembo', 'Bagnaia', 'Martin', 'Marquez', 'Acosta'],
  openGraph: {
    title: 'GP-Dashboard | MotoGP™ Live Telemetry & Pitwall',
    description: 'Track live lean angles, asymmetric tyre stress, and sector splits in real-time.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sora.variable}`}>
      <body className="bg-black text-white min-h-screen antialiased selection:bg-[#E10600] selection:text-white font-sans flex flex-col font-normal">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SeasonProvider>
        <TopTacticalHUD />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <CommandPalette />
        <FirstVisitTip />
        <Toaster
          theme="dark"
          position="bottom-right"
          closeButton
          toastOptions={{
            style: {
              borderRadius: '14px',
              background: '#111111',
              border: '1px solid #262626',
              color: '#ffffff',
            },
          }}
        />
        <SeasonSelectorPill />
        </SeasonProvider>
      </body>
    </html>
  );
}
