'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Server, Mail, AlertCircle, Lock, BookOpen } from 'lucide-react';

export default function LegalNoticePage() {
  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white font-sans select-none px-4 sm:px-6 lg:px-12 py-10">
      <div className="max-w-[880px] mx-auto space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-2 border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E10600]" />
            <span>Compliance &amp; Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Legal Notice &amp; Terms
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Last updated: November 2, 2026 · Governing law and digital publication disclosure
          </p>
        </div>

        {/* Section 1: Publisher Information */}
        <section className="space-y-3 bg-[#0D0D0E]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <BookOpen className="w-5 h-5 text-[#E10600]" />
            <h2>Publisher Information</h2>
          </div>
          <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed space-y-3">
            <p>
              <strong>GP-Dashboard</strong> is an independently operated, non-commercial personal publication created strictly for motorsport data visualization, telemetry engineering analysis, and educational purposes.
            </p>
            <p>
              The publication is edited under the public project identifier <strong>GP-Dashboard</strong>. In accordance with Article 6-III-2 and Article 1-1, II of the French Law on Confidence in the Digital Economy (<em>LCEN - Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique</em>) and European Directive 2000/31/EC on digital information services, the non-professional publisher does not publish a private home address and has deposited personal identification details directly with the hosting provider identified below.
            </p>
          </div>
        </section>

        {/* Section 2: Hosting Provider */}
        <section className="space-y-3 bg-[#0D0D0E]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Server className="w-5 h-5 text-[#E10600]" />
            <h2>Hosting Provider</h2>
          </div>
          <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed space-y-2">
            <p>This web application is deployed, hosted, and globally distributed by:</p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs text-neutral-200 space-y-1">
              <div className="font-bold text-white">Vercel Inc.</div>
              <div>440 N Barranca Ave #4133</div>
              <div>Covina, CA 91723</div>
              <div>United States</div>
              <div>
                Website:{' '}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline underline-offset-4 hover:text-[#FF2A24]"
                >
                  https://vercel.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Contact */}
        <section className="space-y-3 bg-[#0D0D0E]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Mail className="w-5 h-5 text-[#E10600]" />
            <h2>Contact &amp; DMCA Inquiries</h2>
          </div>
          <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed space-y-2">
            <p>
              For general questions, technical reports, trademark clarifications, or copyright inquiries, you may reach the editorial team at:
            </p>
            <div className="pt-1">
              <a
                href="mailto:contact@gp-dashboard.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/[0.08] transition-colors"
              >
                <span>contact@gp-dashboard.com</span>
              </a>
            </div>
          </div>
        </section>

        {/* Section 4: Independence & Nominative Fair Use */}
        <section id="independence" className="space-y-3 bg-[#0D0D0E]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <AlertCircle className="w-5 h-5 text-[#E10600]" />
            <h2>Independence &amp; Trademark Disclaimer</h2>
          </div>
          <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed space-y-3">
            <p>
              <strong>GP-Dashboard is an independent fan project.</strong> It is not affiliated with, sponsored by, endorsed by, or officially associated with MotoGP™, Dorna Sports, S.L., the FIM (<em>Fédération Internationale de Motocyclisme</em>), IRTA (<em>International Road Racing Teams Association</em>), or any competing manufacturer, team, or driver.
            </p>
            <p>
              The official MotoGP™ digital portal is accessible at{' '}
              <a
                href="https://www.motogp.com"
                target="_blank"
                rel="noreferrer"
                className="text-white underline underline-offset-4 hover:text-[#FF2A24]"
              >
                www.motogp.com
              </a>
              . All trademarks, registered logos, team emblems, rider squad numbers, and commercial marks displayed or referenced within this dashboard are the sole property of their respective owners.
            </p>
            <p>
              Any usage of names, logos, or marks (such as Ducati, Aprilia, KTM, Yamaha, Honda, or rider names) is conducted strictly under <strong>nominative fair use</strong> principles for non-commercial identification, journalistic reporting, and technical telemetry simulation.
            </p>
          </div>
        </section>

        {/* Section 5: Data Privacy & Cookies */}
        <section id="privacy" className="space-y-3 bg-[#0D0D0E]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <Lock className="w-5 h-5 text-[#E10600]" />
            <h2>Privacy Policy &amp; Storage Architecture</h2>
          </div>
          <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed space-y-3">
            <p>
              GP-Dashboard is designed with a strict privacy-first architecture:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-300">
              <li>
                <strong>No Third-Party Cookies:</strong> We do not deploy third-party advertising, analytics tracking pixels, or user-profiling scripts.
              </li>
              <li>
                <strong>Client-Side Local Storage:</strong> User interface preferences (such as time display format, active rider spotlight selections, and sound/filter settings) are saved solely inside your browser's LocalStorage and are never transmitted to external databases.
              </li>
              <li>
                <strong>Zero Personal Data Collection:</strong> We do not operate user registration systems, nor do we harvest emails, passwords, or payment credentials.
              </li>
              <li>
                <strong>Hosting Logs:</strong> Standard HTTP request headers (IP address, user agent, requested paths) are automatically processed by Vercel edge networks solely for denial-of-service mitigation and infrastructure security.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
