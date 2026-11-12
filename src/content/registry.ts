// Generated from "HTPN App Registry — Phase 3, Consolidate and Govern.md".
// Tiers are the registry's proposals, for each owner to confirm.

export interface RegisteredApp {
  /** Showcase and registry number, 1 to 50. */
  no: number
  name: string
  tier: 1 | 2 | 3
  by: 'htpn' | 'partner'
}

export const REGISTRY: RegisteredApp[] = [
  { no: 1, name: "GynaeClerk", tier: 2, by: 'htpn' },
  { no: 2, name: "AntenatalClerk", tier: 2, by: 'htpn' },
  { no: 3, name: "Fetal Kick Chart", tier: 3, by: 'htpn' },
  { no: 4, name: "Kempen Derma Darah", tier: 3, by: 'partner' },
  { no: 5, name: "Maternal Assessment Center registration", tier: 3, by: 'partner' },
  { no: 6, name: "Klinik Diabetes Pintar", tier: 2, by: 'partner' },
  { no: 7, name: "Memory Clinic Intake", tier: 2, by: 'partner' },
  { no: 8, name: "Klinik Reumatologi pre-consultation", tier: 2, by: 'partner' },
  { no: 9, name: "CardioFlow HF Clinic Portal", tier: 2, by: 'partner' },
  { no: 10, name: "Skin Diary Generator", tier: 2, by: 'htpn' },
  { no: 11, name: "OT Scheduling System", tier: 3, by: 'htpn' },
  { no: 12, name: "Gynae Census Web Form", tier: 2, by: 'htpn' },
  { no: 13, name: "EBL Estimator AI", tier: 3, by: 'htpn' },
  { no: 14, name: "TherapyAI", tier: 3, by: 'htpn' },
  { no: 15, name: "Clinical Document Checker", tier: 1, by: 'htpn' },
  { no: 16, name: "Phlebotomy Appointment System", tier: 2, by: 'partner' },
  { no: 17, name: "PhysioMeasurePro", tier: 2, by: 'partner' },
  { no: 18, name: "Akasia Ward MO Task Manager", tier: 3, by: 'partner' },
  { no: 19, name: "e-Lampiran D (drug formulary)", tier: 1, by: 'partner' },
  { no: 20, name: "Pocket Nurse", tier: 3, by: 'partner' },
  { no: 21, name: "MedPulse MAR", tier: 3, by: 'partner' },
  { no: 22, name: "TBIS 10A-1 Digital", tier: 2, by: 'partner' },
  { no: 23, name: "Dashboard ED", tier: 3, by: 'htpn' },
  { no: 24, name: "Dashboard DLP", tier: 2, by: 'htpn' },
  { no: 25, name: "Roster Scheduling Web App", tier: 2, by: 'htpn' },
  { no: 26, name: "CGR Web Form", tier: 2, by: 'htpn' },
  { no: 27, name: "DLP Reporting Web Form", tier: 2, by: 'htpn' },
  { no: 28, name: "Slide Deck OCR PDF Editor", tier: 1, by: 'htpn' },
  { no: 29, name: "Portal Aktiviti JPPOBG", tier: 2, by: 'htpn' },
  { no: 30, name: "Patient Safety Incident Reporting", tier: 3, by: 'partner' },
  { no: 31, name: "HTPN Digital Showcase Website", tier: 2, by: 'htpn' },
  { no: 32, name: "E-Kehadiran Kursus", tier: 2, by: 'partner' },
  { no: 33, name: "Mental Wellbeing Monitoring Portal", tier: 2, by: 'partner' },
  { no: 34, name: "MedMove Pro", tier: 3, by: 'partner' },
  { no: 35, name: "MEDEVAC E-Request Portal", tier: 3, by: 'partner' },
  { no: 36, name: "MOH HIRARC Portal", tier: 2, by: 'partner' },
  { no: 37, name: "HPP OSH-Alert", tier: 2, by: 'partner' },
  { no: 38, name: "Sistem eBooking", tier: 2, by: 'partner' },
  { no: 39, name: "Ward Jasmin pharmacy stock", tier: 2, by: 'partner' },
  { no: 40, name: "Psychiatry Department Dashboard (HPD)", tier: 2, by: 'partner' },
  { no: 41, name: "OT Unit Staff Movement & Leave", tier: 2, by: 'partner' },
  { no: 42, name: "Aduan HPD complaints", tier: 2, by: 'partner' },
  { no: 43, name: "Vehicle Booking", tier: 2, by: 'partner' },
  { no: 44, name: "Credentialing & Privileging Portal", tier: 3, by: 'partner' },
  { no: 45, name: "Nursing Daily Census (HPD)", tier: 3, by: 'partner' },
  { no: 46, name: "IQC Glucometer POCT", tier: 3, by: 'partner' },
  { no: 47, name: "Duty Rotator", tier: 2, by: 'partner' },
  { no: 48, name: "PathoLab Pro", tier: 2, by: 'partner' },
  { no: 49, name: "SJAM KPW Dispatch & Analytics", tier: 3, by: 'partner' },
  { no: 50, name: "Internal Medicine Duty Planner", tier: 2, by: 'partner' },
]
