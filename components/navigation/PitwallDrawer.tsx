'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wind,
  Thermometer,
  Zap,
  Activity,
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
          <span>Pitwall HUD</span>
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
                  <span className="font-mono text-[11px] font-semibold text-[#E10600]">
                    Live Telemetry Feed
                  </span>
                </div>
                <Badge variant="outline" size="sm">
                  Rnd 07 · Mugello
                </Badge>
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight text-white mt-1">
                Pitwall Tactical Drawer
              </SheetTitle>
              <SheetDescription className="text-xs text-neutral-400 font-light">
                Real-time meteorological metrics, sensor feeds, and active rider telemetry.
              </SheetDescription>
            </SheetHeader>

            {/* Quick Meteorological Grid (Spec Cells) */}
            <div className="grid grid-cols-2 gap-2 my-5">
              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono mb-1">
                  <span>Track Temp</span>
                  <Thermometer className="w-3.5 h-3.5 text-[#E10600]" />
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">44.8°C</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">Air: 26.2°C</div>
              </div>

              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono mb-1">
                  <span>Wind Velocity</span>
                  <Wind className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">14 km/h</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">Direction: NW</div>
              </div>

              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono mb-1">
                  <span>Track Condition</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-sm font-semibold text-emerald-400 font-mono">Green Flag</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">Optimum Grip</div>
              </div>

              <div className="spec-cell">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono mb-1">
                  <span>Speed Trap Peak</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">363.6</div>
                <div className="text-[10px] text-neutral-400 font-light mt-0.5">#89 J. Martin</div>
              </div>
            </div>

            {/* Live Rider Watchlist */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                <span>Active Track Pace</span>
                <span className="text-[10px] font-mono text-neutral-500 font-normal">Top 3 in Q2</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-3 bg-[#111111] border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[#E10600] w-6">#1</span>
                    <div>
                      <div className="text-white font-semibold">P. Bagnaia</div>
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
                    <span className="font-bold text-neutral-400 w-6">#93</span>
                    <div>
                      <div className="text-white font-semibold">M. Marquez</div>
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
                    <span className="font-bold text-neutral-400 w-6">#89</span>
                    <div>
                      <div className="text-white font-semibold">J. Martin</div>
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
              <div className="text-xs font-semibold text-neutral-300 mb-2">
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
                      <span>Front Hard / Rear Medium</span>
                      <span className="text-amber-400">1.84 bar</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brembo">
                  <AccordionTrigger>Brembo Carbon Thermal Window</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      At Turn 1 San Donato, 355mm carbon discs reach 860°C while shedding 270 km/h in under 5.2 seconds.
                    </p>
                    <div className="flex justify-between items-center text-[11px] font-mono text-neutral-300 pt-1 border-t border-neutral-800">
                      <span>Peak Deceleration</span>
                      <span className="text-[#E10600]">1.80 G</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="lean">
                  <AccordionTrigger>Gyroscopic Max Lean Threshold</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Maximum recorded lean angle is 68.2° in Turn 15 Bucine. Friction coefficient required exceeds 1.35 mu.
                    </p>
                    <div className="flex justify-between items-center text-[11px] font-mono text-neutral-300 pt-1 border-t border-neutral-800">
                      <span>Knee &amp; Elbow Down</span>
                      <span className="text-white">68.2°</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Close HUD Drawer
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
