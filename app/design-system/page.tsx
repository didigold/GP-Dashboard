'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Palette,
  Sparkles,
  Layers,
  Code2,
  Copy,
  Check,
  Compass,
  Disc,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Flame,
  Info,
  Maximize2,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Separator,
  Slider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  LeanMeter,
  TyreAsymmetryPill,
  BrakingGForceBar,
} from '@/components/ui';

function DesignSystemContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Interactive playground states
  const [demoLean, setDemoLean] = useState(64.5);
  const [demoDirection, setDemoDirection] = useState<'left' | 'right'>('right');
  const [demoTyreCompound, setDemoTyreCompound] = useState<'Soft' | 'Medium' | 'Hard'>('Medium');
  const [demoGForce, setDemoGForce] = useState(1.68);
  const [sliderVal, setSliderVal] = useState([14]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const MOTOGP_SURFACES = [
    { name: 'canvas', hex: '#000000', role: 'True asphalt floor, edge-to-edge pure black', class: 'bg-black' },
    { name: 'surface-card', hex: '#111111', role: 'Engineered carbon card background', class: 'bg-[#111111]' },
    { name: 'surface-elevated', hex: '#1A1A1A', role: 'Elevated panel / hover state', class: 'bg-[#1A1A1A]' },
    { name: 'surface-soft', hex: '#0A0A0A', role: 'Spec table cells & contrast bands', class: 'bg-[#0A0A0A]' },
    { name: 'hairline', hex: '#262626', role: 'Precision 1px structural hairlines', class: 'bg-[#262626]' },
    { name: 'hairline-strong', hex: '#383838', role: 'Focused input & table headers', class: 'bg-[#383838]' },
  ];

  const MOTOGP_BRAND_COLORS = [
    { name: 'motogp-red', hex: '#E10600', role: 'Official MotoGP brand primary & speed stripe', class: 'bg-[#E10600]' },
    { name: 'motogp-darkred', hex: '#990400', role: 'Deep red border / danger accent', class: 'bg-[#990400]' },
    { name: 'pure-white', hex: '#FFFFFF', role: 'Confident bold uppercase typography & CTAs', class: 'bg-white' },
    { name: 'body-engineered', hex: '#A3A3A3', role: 'Light running text (weight 300)', class: 'bg-[#A3A3A3]' },
    { name: 'fastest-purple', hex: '#A855F7', role: 'Record sector / all-time pole split', class: 'bg-[#A855F7]' },
    { name: 'personal-green', hex: '#16A34A', role: 'Personal best sector / track clear', class: 'bg-[#16A34A]' },
    { name: 'caution-amber', hex: '#EAB308', role: 'Yellow flag / medium tyre compound', class: 'bg-[#EAB308]' },
  ];

  const RADII_TOKENS = [
    { name: 'rounded.none', px: '0px', usage: 'Dominant system radius: buttons, cards, photo frames, inputs, spec cells (BMW M Industrial Precision)', radius: 'rounded-none' },
    { name: 'rounded.xs', px: '2px', usage: 'Micro legal tags, subtle sector chips', radius: 'rounded-[2px]' },
    { name: 'rounded.sm', px: '4px', usage: 'Small toggle pills on telemetry switches', radius: 'rounded-sm' },
    { name: 'rounded.full', px: '9999px', usage: 'Strictly circular icon buttons, carousel arrows, rider numbers', radius: 'rounded-full' },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* MotoGP Red Speed Stripe */}
      <div className="h-[3px] bg-[#E10600] w-full" />

      {/* Hero Header (BMW M Editorial Style) */}
      <div className="border-b border-neutral-800 bg-[#0A0A0A] px-6 py-10">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="motogp">OFFICIAL MOTOGP™ SYSTEM</Badge>
              <Badge variant="outline">BMW M MOTORSPORT INSPIRATION</Badge>
              <Badge variant="secondary">SHADCN/UI PRIMITIVES</Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-sans font-black tracking-tight uppercase text-white leading-none">
              MOTORSPORT PRECISION <br />
              <span className="text-[#E10600]">DESIGN SYSTEM</span>
            </h1>
            <p className="text-sm text-neutral-400 font-light mt-3 max-w-3xl leading-relaxed">
              Anchored on a pure black canvas with confident uppercase headlines, rectangular industrial precision
              (0px radii), 1px hairlines, and the official MotoGP red speed stripe. Fully built with shadcn/ui components.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://ui.shadcn.com', '_blank')}
              className="flex items-center gap-1.5"
            >
              <span>shadcn/ui</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="motogp"
              size="sm"
              onClick={() => setIsSheetOpen(true)}
              className="flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>TEST RIGHT DRAWER</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Interactive Showcase */}
      <div className="max-w-[1560px] mx-auto px-6 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Design Principles</TabsTrigger>
            <TabsTrigger value="tokens">Color &amp; Radii Tokens</TabsTrigger>
            <TabsTrigger value="shadcn">shadcn/ui Suite</TabsTrigger>
            <TabsTrigger value="telemetry">MotoGP™ Primitives</TabsTrigger>
          </TabsList>

          {/* TAB 1: DESIGN PRINCIPLES (BMW M INSPIRATION) */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#E10600]">
                      BMW M Design Analysis &amp; MotoGP Translation
                    </CardTitle>
                    <CardDescription>
                      Key guidelines derived from the BMW M motorsport engineering specification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs text-neutral-300 font-light leading-relaxed">
                    <div className="p-4 bg-[#0A0A0A] border border-neutral-800">
                      <div className="text-white font-black font-sans text-sm uppercase mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#E10600]" />
                        <span>1. Pure Black Canvas with Zero Decorative Voltage</span>
                      </div>
                      <p className="text-neutral-400">
                        The canvas is true black (#000000). The brand carries no decorative voltage or fake neon glow drop-shadows.
                        Energy comes from high-contrast typography, crisp 1px hairlines (#262626), and raw motorsport physics.
                      </p>
                    </div>

                    <div className="p-4 bg-[#0A0A0A] border border-neutral-800">
                      <div className="text-white font-black font-sans text-sm uppercase mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#E10600]" />
                        <span>2. Rectangular Precision (0px Border Radius Dominance)</span>
                      </div>
                      <p className="text-neutral-400">
                        Buttons, cards, spec tables, inputs, and photo frames use <code className="text-white">rounded-none (0px)</code>.
                        The sharp rectangular silhouette communicates European motorsport engineering; bubbly rounded pills read as consumer tech.
                        Circular radii are strictly reserved for circular icon controls and rider number badges.
                      </p>
                    </div>

                    <div className="p-4 bg-[#0A0A0A] border border-neutral-800">
                      <div className="text-white font-black font-sans text-sm uppercase mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#E10600]" />
                        <span>3. Heavy Display (800) vs. Light Body (300) Contrast</span>
                      </div>
                      <p className="text-neutral-400">
                        Headlines use confident UPPERCASE with tight tracking. Body text drops to Light (weight 300 / zinc-400).
                        All button labels and category tags carry 1.5px letterspacing (<code className="text-white">tracking-[1.5px]</code>)
                        giving them a machined, industrial finish.
                      </p>
                    </div>

                    <div className="p-4 bg-[#0A0A0A] border border-neutral-800">
                      <div className="text-white font-black font-sans text-sm uppercase mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#E10600]" />
                        <span>4. The MotoGP Red Speed Stripe as Brand Signature</span>
                      </div>
                      <p className="text-neutral-400">
                        Like the iconic 4px BMW M tricolor stripe, MotoGP uses the signature 3px Red Speed Stripe (#E10600).
                        It is used on headers, brand dividers, and active tabs — never as a loud full-bleed background fill.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Quick Specs */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Blueprint Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-400">Canvas</span>
                      <span className="text-white font-bold">#000000 True Black</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-400">Brand Primary</span>
                      <span className="text-[#E10600] font-bold">#E10600 MotoGP Red</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-400">Default Radius</span>
                      <span className="text-white font-bold">0px (rounded-none)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-400">Hairlines</span>
                      <span className="text-white font-bold">1px #262626</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-400">Display Type</span>
                      <span className="text-white font-bold">UPPERCASE 800</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-neutral-400">Running Body</span>
                      <span className="text-neutral-400 font-light">Light 300 / zinc-400</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-4 bg-[#111111] border border-neutral-800 text-xs font-mono">
                  <div className="text-[#E10600] font-bold uppercase mb-1">Right-Side Drawer Built-In</div>
                  <p className="text-neutral-400 font-light mb-3">
                    Click below or use the HUD trigger in the header to preview the sliding telemetry drawer.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSheetOpen(true)} className="w-full">
                    Open Drawer-Right
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: TOKENS */}
          <TabsContent value="tokens">
            <div className="space-y-8">
              {/* Surface Tokens */}
              <div>
                <h3 className="text-base font-black uppercase text-white font-sans mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#E10600]" />
                  <span>Surfaces &amp; Hairlines (Pure Black Canvas)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MOTOGP_SURFACES.map((token) => (
                    <div
                      key={token.name}
                      onClick={() => copyToClipboard(token.hex, token.name)}
                      className="p-4 bg-[#111111] border border-neutral-800 hover:border-neutral-600 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 border border-neutral-700 ${token.class}`} />
                        <div>
                          <div className="font-mono font-bold text-xs text-white group-hover:text-[#E10600] flex items-center gap-1.5">
                            <span>{token.name}</span>
                            {copiedToken === token.name ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100" />
                            )}
                          </div>
                          <div className="font-mono text-xs text-neutral-400">{token.hex}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light">{token.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand & Technical Colors */}
              <div>
                <h3 className="text-base font-black uppercase text-white font-sans mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#E10600]" />
                  <span>Official MotoGP™ Brand &amp; Sector Semantics</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {MOTOGP_BRAND_COLORS.map((token) => (
                    <div
                      key={token.name}
                      onClick={() => copyToClipboard(token.hex, token.name)}
                      className="p-4 bg-[#111111] border border-neutral-800 hover:border-neutral-600 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 border border-neutral-700 ${token.class}`} />
                        <div>
                          <div className="font-mono font-bold text-xs text-white group-hover:text-[#E10600]">
                            {token.name}
                          </div>
                          <div className="font-mono text-xs text-neutral-400">{token.hex}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light">{token.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner Radii */}
              <div>
                <h3 className="text-base font-black uppercase text-white font-sans mb-3 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-white" />
                  <span>Corner Roundings Hierarchy</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {RADII_TOKENS.map((token) => (
                    <div
                      key={token.name}
                      className="p-4 bg-[#111111] border border-neutral-800"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono font-bold text-xs text-white">{token.name}</span>
                        <span className="font-mono text-xs text-[#E10600] font-bold">{token.px}</span>
                      </div>
                      <div className="h-16 bg-[#0A0A0A] border border-neutral-800 flex items-center justify-center mb-3">
                        <div className={`w-10 h-10 border-2 border-white ${token.radius} flex items-center justify-center text-[10px] font-mono text-white`}>
                          {token.px}
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed">{token.usage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SHADCN/UI SUITE */}
          <TabsContent value="shadcn">
            <div className="space-y-8">
              {/* Button Component Suite */}
              <Card>
                <CardHeader>
                  <CardTitle>shadcn/ui Button Variants</CardTitle>
                  <CardDescription>
                    Industrial rectangular precision (rounded-none) with uppercase letterspacing tracking-[1.5px]
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3 font-semibold">
                      Variants
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="default">DEFAULT WHITE</Button>
                      <Button variant="motogp">MOTOGP RED</Button>
                      <Button variant="outline">OUTLINE PRECISION</Button>
                      <Button variant="secondary">SECONDARY DARK</Button>
                      <Button variant="ghost">GHOST HOVER</Button>
                      <Button variant="destructive">DESTRUCTIVE</Button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3 font-semibold">
                      Sizes
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm" variant="outline">SM (32PX)</Button>
                      <Button size="default" variant="motogp">DEFAULT (40PX)</Button>
                      <Button size="lg" variant="default">LG HERO (48PX)</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accordion Component Suite */}
              <Card>
                <CardHeader>
                  <CardTitle>shadcn/ui Accordion</CardTitle>
                  <CardDescription>
                    Smooth collapsible engineering accordions with hairline dividers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What is the FIM 1.80 Bar Front Tyre Pressure Rule?</AccordionTrigger>
                      <AccordionContent>
                        Riders must operate above a minimum pressure of 1.80 bar for at least 60% of Grand Prix laps (or 33% of Sprint laps). Violating this threshold incurs an immediate post-race time penalty of 16 seconds.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Why do Michelin asymmetric tyres have different compound hardness on each side?</AccordionTrigger>
                      <AccordionContent>
                        Circuits with unbalanced corner counts (such as Mugello with 9 rights and 6 lefts, or Sachsenring with 10 lefts and 3 rights) generate severe thermal imbalance. The more-stressed side uses a reinforced compound to prevent blistering, while the less-used side uses a softer compound to avoid cooling into dangerous low-grip temperatures.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How do ride-height shapeshifter devices generate acceleration?</AccordionTrigger>
                      <AccordionContent>
                        By mechanically lowering the rear suspension at corner exits, the motorcycle&apos;s center of gravity drops significantly. This suppresses wheelies under full 300 horsepower throttle application, converting wasted rotational lift directly into forward longitudinal drive.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Sheet & Dialog Suite */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>shadcn/ui Sheet (Drawer-Right)</CardTitle>
                    <CardDescription>
                      Full slide-over telemetry drawer from the right edge
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-neutral-400 font-light">
                      The right drawer provides an instant live telemetry overview without navigating away from the current screen.
                    </p>
                    <Button variant="motogp" onClick={() => setIsSheetOpen(true)}>
                      TRIGGER RIGHT DRAWER
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>shadcn/ui Dialog (Modal)</CardTitle>
                    <CardDescription>
                      Tactical modal dialog with backdrop blur and focus trapping
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-neutral-400 font-light">
                      Used for telemetry drill-downs, race control rulings, and fine-tuning sync parameters.
                    </p>
                    <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                      OPEN MODAL DIALOG
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Slider & Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>shadcn/ui Slider &amp; Badges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-neutral-400 uppercase">Interactive Delay Offset:</span>
                      <span className="font-bold text-white tabular-nums">{sliderVal[0]}s</span>
                    </div>
                    <Slider
                      value={sliderVal}
                      onValueChange={setSliderVal}
                      max={60}
                      step={1}
                      motogp
                    />
                  </div>

                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                      Motorsport Sector Badges
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="motogp" dot>MOTOGP POLE</Badge>
                      <Badge variant="purple" dot>PURPLE RECORD</Badge>
                      <Badge variant="green" dot>PERSONAL BEST</Badge>
                      <Badge variant="amber" dot>YELLOW CAUTION</Badge>
                      <Badge variant="destructive" dot>RED STOPPAGE</Badge>
                      <Badge variant="outline">HARD FRONT</Badge>
                      <Badge variant="secondary">IN PITLANE</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 4: MOTO GP TELEMETRY PRIMITIVES */}
          <TabsContent value="telemetry">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#E10600]">
                    Gyroscopic Lean Angle SVG Primitive
                  </CardTitle>
                  <CardDescription>
                    Custom radial SVG arc tracking up to 68°+ lean angles with elbow-down visual triggers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center justify-center p-6 bg-[#0A0A0A] border border-neutral-800">
                      <LeanMeter
                        angle={demoLean}
                        direction={demoDirection}
                        riderName="Marc Marquez #93"
                        maxAngle={68.2}
                      />
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          variant={demoDirection === 'left' ? 'motogp' : 'outline'}
                          onClick={() => setDemoDirection('left')}
                        >
                          Left Bank
                        </Button>
                        <Button
                          size="sm"
                          variant={demoDirection === 'right' ? 'motogp' : 'outline'}
                          onClick={() => setDemoDirection('right')}
                        >
                          Right Bank
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400 uppercase">Simulate Lean Angle:</span>
                        <span className="text-[#E10600] font-black text-sm tabular-nums">{demoLean.toFixed(1)}°</span>
                      </div>
                      <Slider
                        value={[demoLean]}
                        onValueChange={(val) => setDemoLean(val[0])}
                        max={70}
                        step={0.5}
                        motogp
                      />
                      <div className="p-4 bg-[#0A0A0A] border border-neutral-800 text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Threshold &gt; 60°:</span>
                          <span className="text-white font-bold">Knee Scraper Grounded</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Threshold &gt; 64°:</span>
                          <span className="text-[#E10600] font-bold">Elbow Down Alert Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tyre Asymmetry & Brembo Deceleration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-amber-400">Michelin Tyre Asymmetry Pill</CardTitle>
                      <div className="flex items-center gap-1 font-mono text-xs">
                        {(['Soft', 'Medium', 'Hard'] as const).map((comp) => (
                          <button
                            key={comp}
                            onClick={() => setDemoTyreCompound(comp)}
                            className={`px-2 py-0.5 font-bold uppercase ${
                              demoTyreCompound === comp
                                ? 'bg-white text-black'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {comp[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TyreAsymmetryPill
                      position="FRONT"
                      compound={demoTyreCompound}
                      leftTemp={104}
                      rightTemp={128}
                      leftWear={78}
                      rightWear={54}
                      pressureBar={1.84}
                    />
                    <TyreAsymmetryPill
                      position="REAR"
                      compound={demoTyreCompound}
                      leftTemp={112}
                      rightTemp={139}
                      leftWear={68}
                      rightWear={41}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#E10600]">Brembo G-Force Bar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <BrakingGForceBar
                      cornerName="Turn 1 — San Donato"
                      initialSpeed={360}
                      apexSpeed={91}
                      gForce={demoGForce}
                      brakingDistanceM={286}
                      carbonDiscTemp={Math.round(450 + demoGForce * 280)}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Demo Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tactical Telemetry Drilldown</DialogTitle>
            <DialogDescription>
              Inspection modal built with shadcn/ui Dialog and Radix UI
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-xs font-mono text-neutral-300 space-y-2">
            <p>
              This modal component provides telemetry drill-downs for individual corners, speed traps, and tyre temperature channels.
            </p>
            <div className="p-3 bg-[#0A0A0A] border border-neutral-800 text-[11px]">
              <span className="text-[#E10600] font-bold block mb-1">Corner #9 Arrabbiata 2</span>
              Apex velocity: 232 km/h · Gyroscopic roll: 68.2° · Surface friction μ: 1.18
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button variant="motogp" size="sm" onClick={() => setIsDialogOpen(false)}>
              Acknowledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Demo Sheet (Drawer-Right) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right">
          <div className="h-[3px] bg-[#E10600] w-full mb-4 -mx-6 -mt-6" />
          <SheetHeader>
            <SheetTitle>Pitwall Telemetry Drawer</SheetTitle>
            <SheetDescription>
              Interactive right-hand drawer built with shadcn/ui Sheet
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4 text-xs font-mono">
            <div className="spec-cell">
              <div className="text-neutral-400 text-[10px] uppercase">Session</div>
              <div className="text-white font-bold text-sm">MotoGP™ Qualifying 2</div>
              <div className="text-[#E10600] text-[10px]">Track Clear (Green Flag)</div>
            </div>
            <div className="spec-cell">
              <div className="text-neutral-400 text-[10px] uppercase">Asphalt Temperature</div>
              <div className="text-white font-bold text-lg tabular-nums">44.8°C</div>
              <div className="text-neutral-400 text-[10px]">Thermal imbalance warning active</div>
            </div>
            <Button variant="motogp" size="sm" className="w-full" onClick={() => setIsSheetOpen(false)}>
              Close Drawer
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <DesignSystemContent />
    </Suspense>
  );
}
