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
  Banner,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Slider,
  Tooltip,
  MetricCard,
  SectorPill,
  Modal,
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
  const [demoSearch, setDemoSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const COLOR_TOKENS = [
    { name: 'surface.base', hex: '#07090E', role: 'Main canvas, deepest asphalt black', class: 'bg-[#07090E]' },
    { name: 'surface.subtle', hex: '#0D111A', role: 'Secondary backgrounds, panels & table rows', class: 'bg-[#0D111A]' },
    { name: 'surface.card', hex: '#121824', role: 'Pitwall cards, elevated bento blocks', class: 'bg-[#121824]' },
    { name: 'surface.cardHover', hex: '#182030', role: 'Card hover state elevation', class: 'bg-[#182030]' },
    { name: 'surface.border', hex: '#222C40', role: 'Default structural grid borders', class: 'bg-[#222C40]' },
    { name: 'surface.borderActive', hex: '#3B4863', role: 'Focused input, active tab borders', class: 'bg-[#3B4863]' },
  ];

  const ACCENT_TOKENS = [
    { name: 'apex.cyan', hex: '#00F5D4', role: 'Primary brand, speed traps, UI glow', class: 'bg-[#00F5D4]' },
    { name: 'apex.purple', hex: '#A855F7', role: 'Fastest overall lap, all-time record split', class: 'bg-[#A855F7]' },
    { name: 'apex.green', hex: '#00E676', role: 'Personal best sector, track clear condition', class: 'bg-[#00E676]' },
    { name: 'apex.amber', hex: '#FFB703', role: 'Caution flag, medium tyre, moderate wear', class: 'bg-[#FFB703]' },
    { name: 'apex.crimson', hex: '#FF2A54', role: 'Red flag, hard braking hazard, soft tyre', class: 'bg-[#FF2A54]' },
    { name: 'apex.orange', hex: '#FB8500', role: 'Ride-height shapeshifter, secondary warning', class: 'bg-[#FB8500]' },
    { name: 'apex.blue', hex: '#3A86FF', role: 'Wet weather, rain flag, cool tyre state', class: 'bg-[#3A86FF]' },
  ];

  const RADII_TOKENS = [
    { name: 'rounded-apex-none', px: '0px', usage: 'Data matrices, raw 14-col timing rows, high-density telemetry', radius: 'rounded-none' },
    { name: 'rounded-apex-xs', px: '4px', usage: 'Sector chips, micro pills, compound badges, status dots', radius: 'rounded-[4px]' },
    { name: 'rounded-apex-sm', px: '8px', usage: 'Buttons, form inputs, segmented tab triggers, tooltips', radius: 'rounded-[8px]' },
    { name: 'rounded-apex-md', px: '12px', usage: 'Standard pitwall cards, alert banners, metric blocks', radius: 'rounded-[12px]' },
    { name: 'rounded-apex-lg', px: '16px', usage: 'Hero panels, 3D radar canvas containers, modals', radius: 'rounded-[16px]' },
    { name: 'rounded-full', px: '9999px', usage: 'Rider avatar badges, radar pulse rings, circular indicators', radius: 'rounded-full' },
  ];

  const TYPOGRAPHY_TOKENS = [
    { name: 'Display H1', font: 'Font Sans Black', size: '32px / 2rem', sample: 'PEAK LEAN: 68.2°', code: 'text-3xl font-black tracking-tight font-sans' },
    { name: 'Display H2', font: 'Font Sans Bold', size: '24px / 1.5rem', sample: 'Brembo Carbon Deceleration', code: 'text-2xl font-bold tracking-tight font-sans' },
    { name: 'Card Title / H3', font: 'Font Sans SemiBold', size: '14px / 0.875rem', sample: 'MICHELIN ASYMMETRIC MATRIX', code: 'text-sm font-bold tracking-wide uppercase font-sans' },
    { name: 'Telemetry Monospace', font: 'JetBrains Mono', size: '14px / Tabular', sample: "1'45.249 (-0.142s)", code: 'font-mono tabular-nums font-bold' },
    { name: 'Telemetry Micro', font: 'JetBrains Mono', size: '10px / Uppercase', sample: 'S1: 34.182 | TMAX: 363.6 KM/H', code: 'font-mono text-[10px] tracking-widest text-text-muted uppercase' },
  ];

  return (
    <div className="w-full min-h-screen bg-surface-base text-text-primary">
      {/* Hero Header */}
      <div className="border-b border-surface-border bg-gradient-to-b from-surface-subtle to-surface-base px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot size="sm">
                DESIGN SYSTEM SPECIFICATION
              </Badge>
              <Badge variant="outline" size="sm">
                v2.1.0 STABLE
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Apex Design System</span>
              <span className="text-apex-cyan text-xl font-mono font-medium">(Apex DS)</span>
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 max-w-2xl">
              Strict tokenization, component hierarchies, and motorsport-grade primitives engineered for MotoGP™
              telemetry. Borrowing design cues from shadcn/ui, getdesign.md, React Bits, and Fontshare.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="tactical"
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              iconPosition="right"
              onClick={() => window.open('https://ui.shadcn.com', '_blank')}
            >
              shadcn/ui
            </Button>
            <Button
              variant="tactical"
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              iconPosition="right"
              onClick={() => window.open('https://reactbits.dev', '_blank')}
            >
              React Bits
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Component Drawer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Architecture & Rules</TabsTrigger>
            <TabsTrigger value="tokens">Design Tokens (Colors, Radii, Type)</TabsTrigger>
            <TabsTrigger value="components">UI Components & Hierarchies</TabsTrigger>
            <TabsTrigger value="telemetry">MotoGP™ Physics Primitives</TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle className="text-apex-cyan">
                      <Layers className="w-4 h-4" />
                      Core Architectural Principles
                    </CardTitle>
                    <Badge variant="cyan">MANDATORY</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs text-text-secondary leading-relaxed">
                    <div className="p-3.5 rounded-apex-sm bg-surface-subtle border border-surface-border">
                      <div className="text-white font-bold font-mono text-sm mb-1">
                        1. 100% Horizontal Viewport Maximization (No Left Sidebar)
                      </div>
                      <p>
                        Motorsport telemetry requires 14+ columns of simultaneous data (Sector splits T1-T4, Lean Angles,
                        Tyre Compound, Speed Traps, G-Forces). The legacy left sidebar has been replaced by the 56px{' '}
                        <strong className="text-white">Top Tactical HUD</strong>, reserving all horizontal pixels for live
                        timing and comparison matrices.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-apex-sm bg-surface-subtle border border-surface-border">
                      <div className="text-white font-bold font-mono text-sm mb-1">
                        2. Absolute Zero-Jitter Monospace Tabular Numerals
                      </div>
                      <p>
                        All telemetry numbers, lap times, deltas, and sensor angles must use fixed-width monospace fonts
                        (<code className="text-apex-cyan">font-mono tabular-nums</code>). When a rider clock ticks from
                        1'45.999 to 1'46.000, column widths must not shift a single pixel.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-apex-sm bg-surface-subtle border border-surface-border">
                      <div className="text-white font-bold font-mono text-sm mb-1">
                        3. Semantic Motorsport Contrast & Glow Architecture
                      </div>
                      <p>
                        Colors carry life-and-death track meaning. Red (<code className="text-apex-crimson">#FF2A54</code>)
                        is exclusively reserved for track stoppages and extreme braking loads. Purple (
                        <code className="text-apex-purple">#A855F7</code>) signifies an all-time record split. Cyan (
                        <code className="text-apex-cyan">#00F5D4</code>) directs visual priority.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Chrome Bookmarks Inspiration */}
                <Card variant="subtle">
                  <CardHeader>
                    <CardTitle>
                      <Palette className="w-4 h-4 text-apex-amber" />
                      Inspiration from User Bookmarks ("Disseny" Folder)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-apex-xs bg-surface-card border border-surface-border">
                        <div className="font-bold text-white mb-1">shadcn/ui</div>
                        <p className="text-text-muted text-[11px]">
                          Component ergonomics, accessible primitive compositions, copy-paste architecture.
                        </p>
                      </div>
                      <div className="p-3 rounded-apex-xs bg-surface-card border border-surface-border">
                        <div className="font-bold text-white mb-1">React Bits</div>
                        <p className="text-text-muted text-[11px]">
                          Asphalt textures, radial glow gradients, subtle micro-animations and border bevels.
                        </p>
                      </div>
                      <div className="p-3 rounded-apex-xs bg-surface-card border border-surface-border">
                        <div className="font-bold text-white mb-1">getdesign.md</div>
                        <p className="text-text-muted text-[11px]">
                          Tokenization system, strict CSS variable hierarchies, consistent semantic naming.
                        </p>
                      </div>
                      <div className="p-3 rounded-apex-xs bg-surface-card border border-surface-border">
                        <div className="font-bold text-white mb-1">Fontshare & Tabler</div>
                        <p className="text-text-muted text-[11px]">
                          Geometric font pairing, crisp stroke icons (Tabler/Lucide), tabular number balance.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Specs Column */}
              <div className="space-y-6">
                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle className="text-sm">Design Token Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-surface-border/40">
                      <span className="text-text-muted">Surface Layers</span>
                      <span className="text-white font-bold">6 Deep Tiers</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-surface-border/40">
                      <span className="text-text-muted">Accent Colors</span>
                      <span className="text-white font-bold">7 Motorsport</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-surface-border/40">
                      <span className="text-text-muted">Corner Radii</span>
                      <span className="text-white font-bold">6 Precise Steps</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-surface-border/40">
                      <span className="text-text-muted">Typography</span>
                      <span className="text-white font-bold">Sans + Mono</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-text-muted">Glow Filters</span>
                      <span className="text-apex-cyan font-bold">Cyan, Purple, Crimson</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-[11px] text-text-muted">Verified Tailwind Config</span>
                    <ShieldCheck className="w-4 h-4 text-apex-green" />
                  </CardFooter>
                </Card>

                <Banner
                  type="info"
                  title="Pitwall Mode Active"
                  description="All components are reactive to the Broadcast Delay Sync Slider."
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: TOKENS */}
          <TabsContent value="tokens">
            <div className="space-y-8">
              {/* Surface Tokens */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-apex-cyan" />
                    Surface & Canvas Tokens (Asphalt Layers)
                  </h3>
                  <span className="text-xs font-mono text-text-muted">Defined in lib/tokens/colors.ts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COLOR_TOKENS.map((token) => (
                    <div
                      key={token.name}
                      onClick={() => copyToClipboard(token.hex, token.name)}
                      className="p-4 rounded-apex-md bg-surface-card border border-surface-border hover:border-apex-cyan/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-apex-xs border border-surface-borderActive shadow-inner ${token.class}`} />
                        <div>
                          <div className="font-mono font-bold text-xs text-white group-hover:text-apex-cyan transition-colors flex items-center gap-1.5">
                            <span>{token.name}</span>
                            {copiedToken === token.name ? (
                              <Check className="w-3.5 h-3.5 text-apex-green" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <div className="font-mono text-xs text-text-muted">{token.hex}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary">{token.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accent Tokens */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-apex-crimson" />
                    Semantic Motorsport Accents
                  </h3>
                  <span className="text-xs font-mono text-text-muted">Tailwind apex-* Utilities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ACCENT_TOKENS.map((token) => (
                    <div
                      key={token.name}
                      onClick={() => copyToClipboard(token.hex, token.name)}
                      className="p-4 rounded-apex-md bg-surface-card border border-surface-border hover:border-surface-borderActive cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`w-8 h-8 rounded-apex-xs shadow-md ${token.class}`} />
                        <div>
                          <div className="font-mono font-bold text-xs text-white group-hover:text-apex-cyan transition-colors">
                            {token.name}
                          </div>
                          <div className="font-mono text-xs text-text-muted">{token.hex}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary">{token.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner Radii Tokens */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-apex-purple" />
                    Corner Rounding Hierarchy (Radii)
                  </h3>
                  <span className="text-xs font-mono text-text-muted">Defined in lib/tokens/radii.ts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {RADII_TOKENS.map((token) => (
                    <div
                      key={token.name}
                      onClick={() => copyToClipboard(token.name, token.name)}
                      className="p-4 rounded-apex-md bg-surface-card border border-surface-border hover:border-surface-borderActive cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-mono font-bold text-xs text-white group-hover:text-apex-cyan">
                          {token.name}
                        </div>
                        <span className="font-mono text-xs text-text-muted font-bold">{token.px}</span>
                      </div>
                      <div className="flex items-center justify-center p-4 bg-surface-base rounded-apex-xs border border-surface-border mb-2.5">
                        <div
                          className={`w-14 h-14 bg-gradient-to-tr from-apex-cyan/20 to-apex-purple/20 border-2 border-apex-cyan ${token.radius} flex items-center justify-center text-[10px] font-mono text-apex-cyan font-bold`}
                        >
                          {token.px}
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary">{token.usage}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Scales */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-apex-green" />
                    Typography Scale & Tabular Monospace
                  </h3>
                  <span className="text-xs font-mono text-text-muted">Defined in lib/tokens/typography.ts</span>
                </div>
                <Card variant="pitwall">
                  <CardContent className="divide-y divide-surface-border/50 p-0">
                    {TYPOGRAPHY_TOKENS.map((type) => (
                      <div key={type.name} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="w-48 shrink-0">
                          <div className="font-mono font-bold text-xs text-white">{type.name}</div>
                          <div className="text-[11px] text-text-muted font-mono">{type.size}</div>
                        </div>
                        <div className="flex-1">
                          <div className={type.code}>{type.sample}</div>
                        </div>
                        <div className="text-[11px] font-mono text-text-muted bg-surface-base px-2.5 py-1 rounded-apex-xs border border-surface-border">
                          {type.code}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: COMPONENTS */}
          <TabsContent value="components">
            <div className="space-y-8">
              {/* Button Hierarchy */}
              <Card variant="pitwall">
                <CardHeader>
                  <CardTitle>Button Component Hierarchy</CardTitle>
                  <CardDescription>
                    Variants from high-impact action (Primary) to subtle telemetry controls (Tactical & Ghost)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Variants */}
                  <div>
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-3 font-semibold">
                      Variants
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="primary">Primary Action</Button>
                      <Button variant="secondary">Secondary Default</Button>
                      <Button variant="tactical">Tactical Pitwall</Button>
                      <Button variant="ghost">Ghost Trigger</Button>
                      <Button variant="destructive">Destructive / Abort</Button>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-3 font-semibold">
                      Sizes (xs to lg)
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="xs" variant="tactical">
                        XS (24px)
                      </Button>
                      <Button size="sm" variant="secondary">
                        SM (32px)
                      </Button>
                      <Button size="md" variant="primary">
                        MD Default (40px)
                      </Button>
                      <Button size="lg" variant="primary">
                        LG Hero (48px)
                      </Button>
                    </div>
                  </div>

                  {/* Icons & Positions */}
                  <div>
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-3 font-semibold">
                      With Icons & Loading States
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="primary" icon={<Flame className="w-4 h-4" />}>
                        Icon Left
                      </Button>
                      <Button variant="secondary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                        Icon Right
                      </Button>
                      <Button variant="tactical" disabled>
                        Disabled State
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges & Sector Chips */}
              <Card variant="pitwall">
                <CardHeader>
                  <CardTitle>Badges, Sector Chips & Radar Dots</CardTitle>
                  <CardDescription>Micro status indicators for telemetry flags, sectors, and compounds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="purple" dot>
                      RECORD SECTOR
                    </Badge>
                    <Badge variant="green" dot>
                      TRACK CLEAR
                    </Badge>
                    <Badge variant="amber" dot>
                      YELLOW SECTOR
                    </Badge>
                    <Badge variant="crimson" dot>
                      RED FLAG
                    </Badge>
                    <Badge variant="cyan" dot>
                      SPEED TRAP
                    </Badge>
                    <Badge variant="outline">HARD COMPOUND</Badge>
                    <Badge variant="subtle">IN PITLANE</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Alert Banners */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-apex-amber" />
                  Racing Condition Banners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Banner
                    type="green"
                    title="Track Clear: Green Flag"
                    description="Session restarted. Sector 3 debris cleared."
                  />
                  <Banner
                    type="yellow"
                    title="Yellow Flag: Sector 2"
                    description="Rider down at Turn 4 (Luco). Medical car deployed."
                    action={
                      <Button size="xs" variant="tactical">
                        Acknowledge
                      </Button>
                    }
                  />
                  <Banner
                    type="red"
                    title="Session Red Flagged"
                    description="Immediate stoppage. Return to pitlane at restricted pace."
                  />
                  <Banner
                    type="rain"
                    title="White Flag: Wet Conditions"
                    description="Bike swaps permitted in pit lane. Rain detected in Sector 4."
                  />
                </div>
              </div>

              {/* Form Controls: Inputs, Tabs, Sliders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle>Input & Search Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-xs font-mono text-text-muted block mb-1.5">Search with Shortcut</span>
                      <Input
                        isSearch
                        shortcut="⌘K"
                        placeholder="Search rider, circuit, or telemetry metric..."
                        value={demoSearch}
                        onChange={(e) => setDemoSearch(e.target.value)}
                        onClear={() => setDemoSearch('')}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-text-muted block mb-1.5">Standard Input Field</span>
                      <Input placeholder="Enter lap target (e.g. 1'45.200)" />
                    </div>
                  </CardContent>
                </Card>

                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle>Slider & Range Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Slider
                      min={0}
                      max={60}
                      step={1}
                      value={14}
                      onChange={() => {}}
                      label="Broadcast Delay Offset"
                      unit="s"
                      variant="cyan"
                    />
                    <Slider
                      min={0}
                      max={70}
                      step={0.5}
                      value={demoLean}
                      onChange={setDemoLean}
                      label="Interactive Lean Angle Tester"
                      unit="°"
                      variant="purple"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: MOTO GP TELEMETRY PRIMITIVES */}
          <TabsContent value="telemetry">
            <div className="space-y-8">
              {/* Interactive LeanMeter Playground */}
              <Card variant="pitwall">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="text-apex-cyan">
                        <Compass className="w-4 h-4" />
                        Interactive LeanMeter SVG Primitive
                      </CardTitle>
                      <CardDescription>
                        Custom radial SVG arc tracking up to 68°+ lean angles with elbow-down visual triggers
                      </CardDescription>
                    </div>
                    <Badge variant="cyan">MANDATORY MOTOGP SPEC</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center justify-center p-6 bg-surface-subtle/40 rounded-apex-md border border-surface-border">
                      <LeanMeter
                        angle={demoLean}
                        direction={demoDirection}
                        riderName="Marc Marquez #93"
                        maxAngle={68.2}
                      />
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="xs"
                          variant={demoDirection === 'left' ? 'primary' : 'tactical'}
                          onClick={() => setDemoDirection('left')}
                        >
                          Left Bank
                        </Button>
                        <Button
                          size="xs"
                          variant={demoDirection === 'right' ? 'primary' : 'tactical'}
                          onClick={() => setDemoDirection('right')}
                        >
                          Right Bank
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={70}
                        step={0.5}
                        value={demoLean}
                        onChange={setDemoLean}
                        label="Drag Lean Angle"
                        unit="°"
                        variant="cyan"
                      />

                      <div className="p-3.5 rounded-apex-sm bg-surface-base border border-surface-border text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Threshold &gt; 60°:</span>
                          <span className="text-white font-bold">Knee Scraper Grounded</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Threshold &gt; 64°:</span>
                          <span className="text-apex-crimson font-bold">Elbow Down Alert Triggered</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Current Angular Velocity:</span>
                          <span className="text-apex-cyan font-bold">48.2 °/sec</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Michelin Asymmetry & Brembo Deceleration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tyre Asymmetry */}
                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle className="text-apex-amber">
                      <Disc className="w-4 h-4" />
                      Michelin Tyre Asymmetry Pill
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {(['Soft', 'Medium', 'Hard'] as const).map((comp) => (
                        <button
                          key={comp}
                          onClick={() => setDemoTyreCompound(comp)}
                          className={`px-2 py-0.5 rounded-apex-xs text-[10px] font-mono font-bold uppercase ${
                            demoTyreCompound === comp
                              ? 'bg-apex-cyan text-surface-base'
                              : 'bg-surface-subtle text-text-muted hover:text-white'
                          }`}
                        >
                          {comp[0]}
                        </button>
                      ))}
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

                {/* Brembo Braking G-Forces */}
                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle className="text-apex-crimson">
                      <Zap className="w-4 h-4" />
                      Brembo G-Force Bar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Slider
                      min={0.0}
                      max={2.0}
                      step={0.05}
                      value={demoGForce}
                      onChange={setDemoGForce}
                      label="Brake Deceleration Load"
                      unit="G"
                      variant="crimson"
                    />
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

              {/* KPI Metric Cards & Sector Split Strip */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-apex-cyan" />
                  MetricCard & SectorPill Primitives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    label="Speed Trap Record"
                    value="366.1"
                    unit="KM/H"
                    sublabel="Brad Binder (KTM)"
                    delta="+2.4 km/h"
                    trend="up"
                    status="cyan"
                    icon={<Zap className="w-4 h-4" />}
                  />
                  <MetricCard
                    label="All-Time Pole Lap"
                    value="1'44.504"
                    sublabel="Pecco Bagnaia (Ducati)"
                    delta="-0.180s"
                    trend="up"
                    status="purple"
                    icon={<Compass className="w-4 h-4" />}
                  />
                  <MetricCard
                    label="Front Tyre Pressure"
                    value="1.84"
                    unit="BAR"
                    sublabel="FIM Min Threshold: 1.80"
                    delta="+0.04 bar"
                    trend="neutral"
                    status="green"
                    icon={<Disc className="w-4 h-4" />}
                  />
                  <MetricCard
                    label="Peak Deceleration"
                    value="1.80"
                    unit="G"
                    sublabel="Turn 1 Carbon Load"
                    delta="CRITICAL"
                    trend="down"
                    status="crimson"
                    icon={<Flame className="w-4 h-4" />}
                  />
                </div>

                <Card variant="pitwall">
                  <CardHeader>
                    <CardTitle>SectorPill Telemetry Strips</CardTitle>
                    <CardDescription>Compact 4-sector lap split indicator</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-xs font-mono text-text-muted block mb-1">Purple Record Lap:</span>
                      <SectorPill
                        sectors={['purple', 'purple', 'green', 'purple']}
                        times={['26.812', '24.119', '28.940', '24.633']}
                        showTimes
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-text-muted block mb-1">Yellow Incident Sector:</span>
                      <SectorPill
                        sectors={['green', 'yellow', 'green', 'none']}
                        times={['27.001', '25.820', '29.112', '—']}
                        showTimes
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reusable Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apex DS Component Explorer"
        description="Dynamic drawer showcasing modal overlay ergonomics"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Got It
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-text-secondary font-mono">
          <p>
            This modal is built with backdrop blur, keyboard ESC dismissal, focus trapping, and strict surface border
            hierarchies.
          </p>
          <div className="p-3 bg-surface-subtle rounded-apex-xs border border-surface-border">
            <span className="text-apex-cyan font-bold block mb-1">Telemetry Drill-Down Ready</span>
            Clicking any telemetry anomaly in the live timing sheet triggers this component for detailed sensor inspection.
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-base" />}>
      <DesignSystemContent />
    </Suspense>
  );
}
