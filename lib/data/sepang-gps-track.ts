// Official GPS centerline coordinates for Petronas Sepang International Circuit (5.549 km)
// Extracted from authentic GPS survey and OpenStreetMap racing way data

export const SEPANG_OFFICIAL_GPS_COORDS: [number, number][] = [
  [101.735641, 2.760529], // 0: Start/Finish Straight (Start Line)
  [101.732942, 2.760307],
  [101.732818, 2.760317],
  [101.732706, 2.760373],
  [101.732629, 2.760454],
  [101.732587, 2.760564],
  [101.732582, 2.760688], // 6: Turn 1 Apex (Hairpin Right)
  [101.732627, 2.760818],
  [101.732732, 2.760916],
  [101.732874, 2.760961],
  [101.733040, 2.760928],
  [101.733348, 2.760818],
  [101.733451, 2.760835],
  [101.733538, 2.760921], // 13: Turn 2 Apex (Left Flick)
  [101.733566, 2.761026],
  [101.733538, 2.761164],
  [101.733446, 2.761304],
  [101.733236, 2.761561],
  [101.733147, 2.761718],
  [101.733089, 2.761904],
  [101.733061, 2.762091],
  [101.733061, 2.762303],
  [101.733112, 2.762825],
  [101.733194, 2.763070],
  [101.733323, 2.763320],
  [101.733453, 2.763481], // 25: Turn 3 Apex (Long Sweeping Right)
  [101.733653, 2.763662],
  [101.733863, 2.763800],
  [101.734083, 2.763881],
  [101.735319, 2.764284],
  [101.736244, 2.764648],
  [101.736863, 2.764916],
  [101.737262, 2.765097],
  [101.737400, 2.765153],
  [101.737503, 2.765149], // 34: Turn 4 Apex (Medium Left)
  [101.737592, 2.765093],
  [101.737624, 2.764981], // 36: SECTOR 1 SPLIT (1,321.8m)
  [101.737796, 2.764022],
  [101.737901, 2.763528],
  [101.738049, 2.762929],
  [101.738157, 2.762698],
  [101.738278, 2.762533],
  [101.738486, 2.762367], // 42: Turn 5 Apex (High-Speed Left)
  [101.738692, 2.762257],
  [101.738897, 2.762206],
  [101.739098, 2.762197],
  [101.739327, 2.762232],
  [101.739561, 2.762323],
  [101.739727, 2.762442],
  [101.740051, 2.762789], // 49: Turn 6 Apex (High-Speed Right)
  [101.740210, 2.762885],
  [101.740460, 2.762971],
  [101.740673, 2.762978],
  [101.740883, 2.762950],
  [101.741053, 2.762880],
  [101.741205, 2.762759],
  [101.743020, 2.760691], // 56: Turn 7 Apex (Double Right Entry)
  [101.743030, 2.760590],
  [101.742988, 2.760475],
  [101.742679, 2.759782],
  [101.742586, 2.759717], // 60: Turn 8 Apex (Double Right Exit)
  [101.742476, 2.759691], // 61: SECTOR 2 SPLIT (1,094.0m)
  [101.740819, 2.759595],
  [101.739263, 2.759413],
  [101.738410, 2.759273],
  [101.738329, 2.759207],
  [101.738303, 2.759098], // 66: Turn 9 Apex (Slow Uphill Left)
  [101.738375, 2.758976],
  [101.738983, 2.758640],
  [101.739116, 2.758506],
  [101.739209, 2.758308],
  [101.739256, 2.758102], // 71: Turn 10 Apex (Fast Right)
  [101.739249, 2.757808],
  [101.739209, 2.757561],
  [101.739154, 2.757320],
  [101.739009, 2.757012],
  [101.738792, 2.756697],
  [101.738673, 2.756622],
  [101.738559, 2.756603], // 78: Turn 11 Apex (Right Entry)
  [101.738430, 2.756627],
  [101.738327, 2.756694],
  [101.736426, 2.758259],
  [101.736293, 2.758308],
  [101.736122, 2.758318], // 83: Turn 12 Apex (Left Sweeper)
  [101.735935, 2.758271],
  [101.735242, 2.757916],
  [101.735057, 2.757858],
  [101.734837, 2.757828],
  [101.734644, 2.757830],
  [101.734284, 2.757895],
  [101.734039, 2.757996], // 90: Turn 13 Apex (Right Transition)
  [101.733880, 2.758122],
  [101.733667, 2.758402],
  [101.733592, 2.758612],
  [101.733581, 2.758740],
  [101.733670, 2.758884], // 95: Turn 14 Apex (Hairpin to Back Straight)
  [101.733861, 2.758963], // 96: SECTOR 3 SPLIT (1,561.7m)
  [101.741400, 2.760348], // 97: Back Straight End (Braking 342 km/h)
  [101.741508, 2.760443],
  [101.741587, 2.760625], // 99: Turn 15 Apex (Final Hairpin Left)
  [101.741547, 2.760777],
  [101.741410, 2.760919],
  [101.741185, 2.760954], // 102: Main Straight Entry
  [101.735641, 2.760529], // 103: Finish Line
];

export interface CornerAnnotation {
  name: string;
  coords: [number, number];
  label: string;
  gear: string;
  speed: string;
}

export const SEPANG_CORNERS: CornerAnnotation[] = [
  { name: 'T1', coords: [101.732582, 2.760688], label: 'Turn 1 (Tight Hairpin)', gear: '1st', speed: '72 km/h' },
  { name: 'T2', coords: [101.733538, 2.760921], label: 'Turn 2 (Left Flick)', gear: '2nd', speed: '98 km/h' },
  { name: 'T3', coords: [101.733453, 2.763481], label: 'Turn 3 (Right Sweeper)', gear: '3rd', speed: '190 km/h' },
  { name: 'T4', coords: [101.737503, 2.765149], label: 'Turn 4 (Medium Left)', gear: '2nd', speed: '115 km/h' },
  { name: 'T5', coords: [101.738486, 2.762367], label: 'Turn 5 (High-Speed Left)', gear: '4th', speed: '215 km/h' },
  { name: 'T6', coords: [101.740051, 2.762789], label: 'Turn 6 (Right Flick)', gear: '3rd', speed: '175 km/h' },
  { name: 'T7', coords: [101.743020, 2.760691], label: 'Turn 7 (Apex Right)', gear: '3rd', speed: '148 km/h' },
  { name: 'T8', coords: [101.742586, 2.759717], label: 'Turn 8 (Exit Right)', gear: '3rd', speed: '162 km/h' },
  { name: 'T9', coords: [101.738303, 2.759098], label: 'Turn 9 (Slow Uphill Left)', gear: '1st', speed: '68 km/h' },
  { name: 'T10', coords: [101.739256, 2.758102], label: 'Turn 10 (Fast Right)', gear: '2nd', speed: '135 km/h' },
  { name: 'T11', coords: [101.738559, 2.756603], label: 'Turn 11 (Right Entry)', gear: '2nd', speed: '120 km/h' },
  { name: 'T12', coords: [101.736122, 2.758318], label: 'Turn 12 (Left Sweeper)', gear: '3rd', speed: '178 km/h' },
  { name: 'T13', coords: [101.734039, 2.757996], label: 'Turn 13 (Right Transition)', gear: '3rd', speed: '155 km/h' },
  { name: 'T14', coords: [101.733670, 2.758884], label: 'Turn 14 (Hairpin to Back Straight)', gear: '2nd', speed: '90 km/h' },
  { name: 'T15', coords: [101.741587, 2.760625], label: 'Turn 15 (Final Hairpin)', gear: '1st', speed: '74 km/h' },
];

/**
 * High-density Catmull-Rom spline interpolation along the authentic Sepang track
 */
export function getInterpolatedSepangSpline(numPoints = 360): [number, number][] {
  const points = SEPANG_OFFICIAL_GPS_COORDS;
  const result: [number, number][] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const step = 1 / (numPoints / n);
    for (let t = 0; t < 1; t += step) {
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      result.push([parseFloat(x.toFixed(6)), parseFloat(y.toFixed(6))]);
    }
  }
  result.push(result[0]); // closed loop
  return result;
}

/**
 * Returns GeoJSON LineStrings for each of the 4 official Dorna timing sectors
 */
export function getSepangSectorGeoJSON() {
  const coords = SEPANG_OFFICIAL_GPS_COORDS;
  // S1: 0 to 36
  const s1 = coords.slice(0, 37);
  // S2: 36 to 61
  const s2 = coords.slice(36, 62);
  // S3: 61 to 96
  const s3 = coords.slice(61, 97);
  // S4: 96 to end and 0
  const s4 = [...coords.slice(96), coords[0]];

  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { sector: 1, name: 'Sector 1', color: '#EF4444' },
        geometry: { type: 'LineString' as const, coordinates: s1 },
      },
      {
        type: 'Feature' as const,
        properties: { sector: 2, name: 'Sector 2', color: '#F59E0B' },
        geometry: { type: 'LineString' as const, coordinates: s2 },
      },
      {
        type: 'Feature' as const,
        properties: { sector: 3, name: 'Sector 3', color: '#06B6D4' },
        geometry: { type: 'LineString' as const, coordinates: s3 },
      },
      {
        type: 'Feature' as const,
        properties: { sector: 4, name: 'Sector 4', color: '#10B981' },
        geometry: { type: 'LineString' as const, coordinates: s4 },
      },
    ],
  };
}
