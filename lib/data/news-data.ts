export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'TECH DEBRIEF' | 'TYRE ALLOCATION' | 'STEWARDS' | 'TELEMETRY' | 'PADDOCK';
  categoryColor: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export const MOTOGP_NEWS: NewsArticle[] = [
  {
    id: 'michelin-thermal-alert-sepang',
    title: 'Michelin Thermal Alert: Sepang Turn 14-15 Asphalt Reaches 46.2°C, Shifting Race Strategy to Hard Front',
    summary: 'Infrared telemetry from Saturday Sprint revealed extreme thermal stress on the asymmetric right shoulder. Paddock engineers prepare dual hard tyre allocations for Sunday’s 20-lap endurance test.',
    category: 'TYRE ALLOCATION',
    categoryColor: '#EAB308',
    author: 'Piero Taramasso · Michelin Motorsport',
    publishedAt: '2 hours ago',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    id: 'marquez-68-lean-telemetry',
    title: 'Marc Márquez on 68.2° Lean Angle: "Front Aerodynamic Downforce is the Only Thing Keeping Us Grounded"',
    summary: 'Gresini & Ducati data logs show Márquez scraping elbow and shoulder through the off-camber apex of Turn 15 with zero front-wheel slip angle.',
    category: 'TELEMETRY',
    categoryColor: '#A855F7',
    author: 'Telemetry Desk · Gigi Dall’Igna Notes',
    publishedAt: '3 hours ago',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'brembo-carbon-1-83g-decel',
    title: 'Brembo Deceleration Audit: 362.8 km/h to 72 km/h in 5.3 Seconds at Turn 1 Hairpin',
    summary: 'Hydraulic master cylinder pressure peaked at 14.1 Bar as riders absorbed 1.83G sustained braking force before tipping into the second-gear right-hander.',
    category: 'TECH DEBRIEF',
    categoryColor: '#E10600',
    author: 'Brembo Racing Engineering Hub',
    publishedAt: '5 hours ago',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1571188654249-7a9021873fb2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'fim-stewards-turn-4-ruling',
    title: 'FIM Stewards Bulletin: Bagnaia vs Martín Turn 4 Incident Declared Racing Contact',
    summary: 'After reviewing on-board gyroscopic footage and GPS tracking lines, race direction determined no rider was predominantly to blame during lap 7 overtake.',
    category: 'STEWARDS',
    categoryColor: '#3B82F6',
    author: 'FIM MotoGP™ Race Direction',
    publishedAt: '6 hours ago',
    readTime: '2 min read',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'acosta-ktm-holeshot-start',
    title: 'Acosta’s Hole-Shot Secret: How KTM’s Dual Ride-Height Device Crushed the Sprint Start',
    summary: 'Red Bull KTM telemetry traces reveal Pedro Acosta dropped rear suspension by 65mm on the grid, accelerating 0-100 km/h in an astonishing 2.18 seconds.',
    category: 'PADDOCK',
    categoryColor: '#10B981',
    author: 'Paddock Pitwall Engineering',
    publishedAt: '8 hours ago',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?q=80&w=800&auto=format&fit=crop',
  },
];
