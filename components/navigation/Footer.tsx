'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on full-height workstation views like /schedule
  if (pathname === '/schedule') {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07080B] text-neutral-400 font-sans select-none">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4 flex flex-col items-center justify-center text-center">
        {/* Main shadcn-style attribution line */}
        <p className="text-xs sm:text-sm text-neutral-400">
          Built by{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-white underline underline-offset-4 hover:text-neutral-300 transition-colors"
          >
            didac
          </a>{' '}
          at{' '}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-white underline underline-offset-4 hover:text-neutral-300 transition-colors"
          >
            Vercel
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-white underline underline-offset-4 hover:text-neutral-300 transition-colors"
          >
            GitHub
          </a>
          .
        </p>

        {/* Quick Legal & Compliance Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <Link
            href="/legal"
            className="hover:text-white underline underline-offset-4 transition-colors"
          >
            Legal Notice
          </Link>
          <Link
            href="/legal#privacy"
            className="hover:text-white underline underline-offset-4 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal#independence"
            className="hover:text-white underline underline-offset-4 transition-colors"
          >
            Independence &amp; Fair Use
          </Link>
        </div>

        {/* Real Legal Disclaimer & Dorna / FIM Nominative Fair Use Statement */}
        <div className="pt-2 text-[11px] text-neutral-500 max-w-2xl text-center leading-relaxed">
          <p>
            GP-Dashboard is an independent, non-commercial personal publication developed for motorsport data analysis. It is not affiliated with, endorsed by, or officially connected to MotoGP™, Dorna Sports, S.L., or the FIM. All trademarks and registered names belong to their respective holders.
          </p>
        </div>
      </div>
    </footer>
  );
}
