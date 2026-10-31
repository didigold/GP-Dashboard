import type { Metadata } from 'next';
import './globals.css';
import { TopTacticalHUD } from '../components/navigation/TopTacticalHUD';

export const metadata: Metadata = {
  title: 'GP-Dashboard | MotoGP™ Live Telemetry, Lean Angle & Tactical Pitwall',
  description:
    'Dedicated MotoGP telemetry dashboard: 68° lean angle dynamics, Michelin asymmetric tyre thermal stress, Brembo carbon braking zones, TV delay buffer, and live pitwall timing.',
  keywords: ['MotoGP', 'Live Timing', 'Lean Angle', 'Telemetry', 'Tyre Degradation', 'Brembo', 'Bagnaia', 'Martin', 'Marquez', 'Acosta'],
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
    <html lang="en" className="dark">
      <body className="bg-surface-base text-text-primary min-h-screen antialiased selection:bg-apex-cyan selection:text-black font-sans flex flex-col">
        <TopTacticalHUD />
        <div className="flex-1 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
