/**
 * Where the HTPN model has been taught, and where it has been adopted.
 *
 * Coordinates are [lon, lat]. Every one is checked at build time against
 * Natural Earth's Malaysia polygon (`npm run map`), which catches a pin in
 * the sea or in the wrong country; it cannot confirm a street address.
 */

export type SiteKind = 'hospital' | 'national' | 'community'

export interface Site {
  n: number
  name: string
  dates: string
  /** Sort key: first day of the session. */
  on: string
  kind: SiteKind
  lon: number
  lat: number
  /** Runs a tool built on the HTPN model. */
  adopted?: string[]
  /** Share a pin position with this site number, label offset instead. */
  stackWith?: number
}

/** Origin of every arc. Not a destination. */
export const HOME = {
  name: 'HTPN Kajang',
  state: 'Selangor',
  lon: 101.789,
  lat: 2.993,
  note: 'Plus internal sessions: Medical, Nursing, O&G, Psychiatry, Pathology, Pharmacy, Forensic, Rehabilitation, Infection Control, Clinical Management',
}

/** The fifteen external sessions, in date order. */
export const SITES: Site[] = [
  { n: 1, name: 'Hospital Kepala Batas & Seberang Perai Cluster, Penang', dates: '5–6 Nov 2025', on: '2025-11-05', kind: 'hospital', lon: 100.427, lat: 5.517, adopted: ['Medexa', 'Innovathon Patient Journey winner'] },
  { n: 2, name: 'Hospital Sultanah Aminah, Johor', dates: '5 Feb 2026', on: '2026-02-05', kind: 'hospital', lon: 103.903, lat: 1.470, adopted: ['Patient Safety Incident Reporting Form'] },
  { n: 3, name: 'National Center for Food Security, Sepang', dates: 'Mar 2026', on: '2026-03-01', kind: 'national', lon: 101.750, lat: 2.690 },
  { n: 4, name: 'Hospital Pulau Pinang', dates: '30–31 Mar 2026', on: '2026-03-30', kind: 'hospital', lon: 100.311, lat: 5.417, adopted: ['HPP OSH-Alert', 'Sistem eBooking'] },
  { n: 5, name: 'Central Zone O&G Services, MOH, Putrajaya', dates: '29–30 Apr 2026', on: '2026-04-29', kind: 'national', lon: 101.696, lat: 2.926 },
  { n: 6, name: 'Sarawak State Health Department, Kuching', dates: '12–13 May 2026', on: '2026-05-12', kind: 'national', lon: 110.344, lat: 1.553 },
  { n: 7, name: 'Occupational & Environmental Health Unit (KPAS), JKN Selangor, KL', dates: '20–22 May 2026', on: '2026-05-20', kind: 'national', lon: 101.690, lat: 3.140 },
  { n: 8, name: 'PUSPANITA, Hospital Kuala Lumpur branch', dates: '5 Jun 2026', on: '2026-06-05', kind: 'community', lon: 101.702, lat: 3.171 },
  { n: 9, name: 'Northern Zone O&G Services, MOH, Alor Setar', dates: '23–24 Jun 2026', on: '2026-06-23', kind: 'national', lon: 100.368, lat: 6.121 },
  { n: 10, name: 'National Family Medicine Profession Division, MOH, Putrajaya', dates: '6–7 Jul 2026', on: '2026-07-06', kind: 'national', lon: 101.696, lat: 2.926, stackWith: 5 },
  { n: 11, name: 'National Medical Services, MOH, Subang Jaya', dates: '9–10 Sep 2026', on: '2026-09-09', kind: 'national', lon: 101.585, lat: 3.049 },
  { n: 12, name: 'St John Ambulance, Federal Territory KL branch', dates: '18 Sep 2026', on: '2026-09-18', kind: 'community', lon: 101.700, lat: 3.150 },
  { n: 13, name: 'Hospital Cyberjaya', dates: '24–25 Sep 2026', on: '2026-09-24', kind: 'hospital', lon: 101.651, lat: 2.928 },
  { n: 14, name: 'Southern Zone O&G Services, MOH, Johor Bahru', dates: '8–9 Oct 2026', on: '2026-10-08', kind: 'national', lon: 103.746, lat: 1.458 },
  { n: 15, name: 'Hospital Port Dickson, Negeri Sembilan', dates: '14–15 Oct 2026', on: '2026-10-14', kind: 'hospital', lon: 101.8065, lat: 2.5305 },
]

/** Adopters without their own teaching pin — listed, not plotted. */
export const ADOPTED_ONLY = [
  { name: 'Hospital Marudi, Sarawak', tool: 'Phlebotomy Appointment System' },
  { name: 'Hospital Sri Aman, Sarawak', tool: 'PhysioMeasurePro' },
  { name: 'Hospital Mukah, Sarawak', tool: 'MOH HIRARC Portal' },
]

export const KIND_LABEL: Record<SiteKind, string> = {
  hospital: 'hospital',
  national: 'national service / state department',
  community: 'community organisation',
}
