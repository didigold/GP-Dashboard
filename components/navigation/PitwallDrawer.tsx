'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Flame,
  Wind,
  Thermometer,
  Gauge,
  Radio,
  Compass,
  Zap,
  Activity,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface PitwallDrawerProps {
  defaultOpen?: boolean;
}

export function PitwallDrawer({ defaultOpen = true }: PitwallDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Open right-side drawer automatically on initial dashboard mount
  useEffect(() => {
    if (defaultOpen) {
      if (typeof window !== 'undefined' && window.location.search.includes('drawer=false')) {
        return;
      }
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [defaultOpen]);

  return (
    <>
      {/* Floating Tactical Trigger Button on Right Viewport */}
      <div className="fixed right-4 bottom-6 z-40 hidden sm:block">
        <Button
          variant="motogp"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="shadow-2xl flex items-center gap-2 border-none"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>PITWALL HUD</span>
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="overflow-y-auto no-scrollbar flex flex-col justify-between">
          <div>
            {/* MotoGP Speed Stripe */}
            <div className="h-[3px] bg-[#E10600] w-full mb-4 -mx-6 -mt-6" />

            <SheetHeader className="pb-4 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
                  <span className="font-mono text-[11px] font-bold tracking-widest text-[#E10600] uppercase">
                    LIVE TELEMETRY FEED
                  </span>
                </div>
                <Badge variant="outline" size="sm">
                  RND 07 · MUGELLO
                </Badge>
              </div>
              <SheetTitle className="text-xl font-black tracking-tight uppercase text-white mt-1">
                Pitwall Tactical Drawer
              </SheetTitle>
              <SheetDescription className="text-xs text-neutral-400 font-light">
                Real-time meteorological metrics, sensor feeds, and active rider telemetry.
              </SheetDescription>
            </SheetHeader>

            {/* Quick Meteorological Grid (Spec Cells) */}
            <div className="grid grid-cols-2 gap-2 my-5">
              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase mb-1">
                  <span>Track Temp</span>
                  <Thermometer className="w-3.5 h-3.5 text-[#E10600]" />
                </div>
                <div className="text-xl font-black text-white font-mono tabular-nums">44.8°C</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">Air: 26.2°C</div>
              </div>

              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase mb-1">
                  <span>Wind Velocity</span>
                  <Wind className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div className="text-xl font-black text-white font-mono tabular-nums">14 km/h</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">Direction: NW</div>
              </div>

              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase mb-1">
                  <span>Track Condition</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-sm font-black text-emerald-400 font-mono uppercase">GREEN FLAG</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">Optimum Grip</div>
              </div>

              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase mb-1">
                  <span>Speed Trap Peak</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-white font-mono tabular-nums">363.6</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">#89 J. Martin</div>
              </div>
            </div>

            {/* Live Rider Watchlist */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-[1.5px] text-neutral-300 mb-2 flex items-center justify-between">
                <span>Active Track Pace</span>
                <span className="text-[10px] font-mono text-neutral-500 font-normal">TOP 3 Q2</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-3 bg-[#111111] border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-[#E10600] w-6">#1</span>
                    <div>
                      <div className="text-white font-bold">P. Bagnaia</div>
                      <div className="text-[10px] text-neutral-500">Ducati Lenovo Team</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white tabular-nums">1&apos;44.855</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">-0.142s (P1)</div>
                  </div>
                </div>

                <div className="p-3 bg-[#111111] border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-neutral-400 w-6">#93</span>
                    <div>
                      <div className="text-white font-bold">M. Marquez</div>
                      <div className="text-[10px] text-neutral-500">Gresini Racing MotoGP</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white tabular-nums">1&apos;44.920</div>
                    <div className="text-[10px] text-neutral-400 font-semibold">+0.065s (P2)</div>
                  </div>
                </div>

                <div className="p-3 bg-[#111111] border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-neutral-400 w-6">#89</span>
                    <div>
                      <div className="text-white font-bold">J. Martin</div>
                      <div className="text-[10px] text-neutral-500">Prima Pramac Racing</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white tabular-nums">1&apos;44.982</div>
                    <div className="text-[10px] text-neutral-400 font-semibold">+0.127s (P3)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Components inside Drawer */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-[1.5px] text-neutral-300 mb-2">
                Engineering Diagnostics
              </div>
              <Accordion type="single" collapsible defaultValue="michelin">
                <AccordionItem value="michelin">
                  <AccordionTrigger>Michelin Asymmetric Stress</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Mugello features 9 right-hand turns and 6 left-hand turns. Right shoulders experience +24°C higher thermal load, reaching 138°C in Arrabbiata 1 &amp; 2.
                    </p>
                    <div className="flex justify-between items-center text-[11px] font-mono text-neutral-300 pt-1 border-t border-neutral-800">
                      <span>Front Min Pressure:</span>
                      <span className="text-emerald-400 font-bold">1.84 BAR (Legal &gt;1.80)</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brembo">
                  <AccordionTrigger>Brembo San Donato Braking</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      De-acceleration from 360 km/h to 91 km/h in 286 meters. Peak deceleration: 1.80G. Carbon disc temperature exceeds 900°C for 5.2 seconds.
                    </p>
                    <div className="flex justify-between items-center text-[11px] font-mono text-neutral-300 pt-1 border-t border-neutral-800">
                      <span>Carbon Disc Spec:</span>
                      <span className="text-white font-bold">355mm Heavy Duty</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="lean">
                  <AccordionTrigger>Gyroscopic Max Lean Angle</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Marc Marquez recorded peak 68.2° lean in Turn 15 (Bucine). Knee and elbow scraping grounds chassis at &gt;64° angle of attack.
                    </p>
                    <div className="flex justify-between items-center text-[11px] font-mono text-neutral-300 pt-1 border-t border-neutral-800">
                      <span>Elbow Down Threshold:</span>
                      <span className="text-[#E10600] font-bold">ACTIVE (&gt;64°)</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-1/2"
            >
              Close HUD
            </Button>
            <Button
              variant="motogp"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/live-timing';
              }}
              className="w-1/2 flex items-center justify-center gap-1"
            >
              <span>Full Pitwall</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
