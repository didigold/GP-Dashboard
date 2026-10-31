import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/navigation/Sidebar';

export const metadata: Metadata = {
  title: 'GP-Dashboard | Ultimate MotoGP™ Live Timing & 3D Analytics',
  description:
    'Real-time live timing, TV broadcast delay sync, interactive 3D circuit visualizations, race pace telemetry, and comprehensive Grand Prix analytics.',
  keywords: ['MotoGP', 'Live Timing', 'Telemetry', 'Grand Prix', 'Race Pace', '3D Circuit', 'Bagnaia', 'Martin', 'Marquez'],
  openGraph: {
    title: 'GP-Dashboard | MotoGP™ Live Timing & 3D Analytics',
    description: 'Track live sector splits, gaps, tyre choices, and 3D circuits in real-time.',
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
      <body className="bg-racing-dark text-slate-100 flex min-h-screen antialiased selection:bg-racing-cyan selection:text-black">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </body>
    </html>
  );
}
