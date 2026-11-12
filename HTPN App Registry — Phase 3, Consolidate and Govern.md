# HTPN App Registry — Phase 3, Consolidate and Govern

Nov 3, 2026 · @Fairis

All 50 showcase apps are now registered and given a proposed tier, reach tag and data class. HTPN owns 17 of them; the other 33 belong to partner facilities. Every tier and data class below is a proposal made from the showcase descriptions, so each owner should confirm it.

## How each app was classed

Each app gets three labels. The tier sets how much governance it needs, the reach tag sets how far it can travel across KKM, and the data class sets how its data must be handled under the PDPA.

**Risk tier**, using the three tiers from the roadmap:

1. **Tier 1, Experimental:** a demo, a tool still in development, or a personal tool not used on patient data. Built freely, with dummy or de-identified data only.
2. **Tier 2, Departmental:** in routine use in one unit, where a clinician or officer checks the output and a paper fallback is easy. Needs a named owner, documentation and a backup maintainer.
3. **Tier 3, Hospital-critical:** the output drives a patient-safety decision (an alert, a medication, a triage or a handover), or the hospital relies on it across departments. Needs full governance, a security review and impact measures.

**Reach**, for the KKM rail of the roadmap:

- **Facility:** built for one site's setup, such as a single building's defects or one state's air transfers. Stays local.
- **Service:** belongs to a discipline, so it travels to every hospital running that service.
- **General:** any KKM hospital can use it, from a district hospital to a state hospital.

**Data class.** This is a working scheme, because the roadmap's PDPA data classes are not yet defined:

- **A, identifiable patient data:** names, IC numbers, clinical history, images.
- **B, identifiable staff data:** rosters, leave, credentials, staff IC numbers.
- **C, no personal data:** operational, aggregate or anonymous data.
- **D, public or reference:** no data is collected.

## The registry

HTPN governs its own 17 apps, so they get owners, backups and dropdowns you can change. The 33 partner apps are governed by the facilities that built them; HTPN records them so it can track reach and offer each partner the same tiering.

### HTPN apps (17)

Highest tier first. Type the named owner and backup into the last two columns.

| # | App | Builders credited | Tier | Why this tier | Reach | Data class | Named owner | Backup maintainer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 03 | Fetal Kick Chart | Matron Norziah, KJ Manimala, KJ Zanariah, KJ Nur Azimah (O&G) | Tier 3 Hospital-critical | Drives fetal-movement alerts | Service | A Patient | To confirm | To name |
| 11 | OT Scheduling System | Dr Fairis, Dr Nida (Anaesthesiology) | Tier 3 Hospital-critical | Used across departments; 9 theatres | Service | A Patient | To confirm | To name |
| 13 | EBL Estimator AI | Dr Amalyna, Dr Anita bt Ali (O&G) | Tier 3 Hospital-critical | AI estimate used in obstetric emergencies | Service | A Patient | To confirm | To name |
| 14 | TherapyAI | Dr Naim | Tier 3 Hospital-critical | AI risk stratification on mental-health sessions | Service | A Patient | To confirm | To name |
| 23 | Dashboard ED | Dr Naim | Tier 3 Hospital-critical | Hospital patient flow; Command Centre stream | Service | A Patient | To confirm | To name |
| 01 | GynaeClerk | Dr Hamizah, Dr Asma' (O&G) | Tier 2 Departmental | Intake form one clinic uses; doctor reviews it | Service | A Patient | To confirm | To name |
| 02 | AntenatalClerk | Dr Koghila, Dr Liyana (O&G) | Tier 2 Departmental | Intake form one clinic uses; doctor reviews it | Service | A Patient | To confirm | To name |
| 10 | Skin Diary Generator | Pn Hanim (Pharmacy) | Tier 2 Departmental | Patient instruction sheets from one unit; offline | Service | A Patient | To confirm | To name |
| 12 | Gynae Census Web Form | Dr Hazimah, Dr Missdalia, Dr Zulaikha (O&G) | Tier 2 Departmental | Census and logbook for one department | Service | A Patient | To confirm | To name |
| 24 | Dashboard DLP | Dr Naim, CC Yati (Pembangunan & Perolehan) | Tier 2 Departmental | Facilities tracker for one building | Facility | C No personal data | To confirm | To name |
| 25 | Roster Scheduling Web App | Dr Fairis | Tier 2 Departmental | One department roster; Tier 3 once it feeds the Command Centre | General | B Staff | To confirm | To name |
| 26 | CGR Web Form | Dr Fairis, Dr Aina (Risk Mgmt) | Tier 2 Departmental | Audit form; paper fallback is easy | General | C No personal data | To confirm | To name |
| 27 | DLP Reporting Web Form | Dr Syafiz (Pembangunan & Perolehan) | Tier 2 Departmental | Defect reports for one building | Facility | C No personal data | To confirm | To name |
| 29 | Portal Aktiviti JPPOBG | Dr Anita Rina bt Ali (O&G) | Tier 2 Departmental | Activity reporting for one fraternity | Service | C No personal data | To confirm | To name |
| 31 | HTPN Digital Showcase Website | Dr Fairis, Dr Naim, Dr Syafiz | Tier 2 Departmental | Public portfolio; no personal data | Facility | D Public | To confirm | To name |
| 15 | Clinical Document Checker | Dr Naim | Tier 1 Experimental | Research prototype; becomes Tier 3 at go-live | General | A Patient | To confirm | Not needed yet |
| 28 | Slide Deck OCR PDF Editor | Dr Fairis | Tier 1 Experimental | Personal productivity tool on cloud AI; keep off clinical data | General | C No personal data | To confirm | Not needed yet |

### Partner apps (33)

Grouped by facility. Tier, reach and data class are proposals to share with each partner.

| # | App | Facility | Built by | Proposed tier | Why this tier | Reach | Data class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20 | Pocket Nurse | BPF JKN Selangor | Kong Sang Ho (ICU/CCU/HDW) | Tier 3 | Drug dilution and antidote decision support | General | D Public |
| 17 | PhysioMeasurePro | Hospital Aman Sarawak | Hospital Aman Sarawak | Tier 2 | Outcome calculator one unit uses; therapist reviews | Service | A Patient |
| 22 | TBIS 10A-1 Digital | Hospital Cyberjaya | Sektor Tibi/Kusta, KKM | Tier 2 | Statutory notification form | General | A Patient |
| 47 | Duty Rotator | Hospital Cyberjaya | Medical Dept Roster Committee | Tier 2 | One department roster | General | B Staff |
| 48 | PathoLab Pro | Hospital Cyberjaya | Pathology Informatics Team | Tier 2 | Workload tracking for one department | Service | C No personal data |
| 16 | Phlebotomy Appointment System | Hospital Marudi | Hospital Marudi | Tier 2 | Booking for one service | General | A Patient |
| 36 | MOH HIRARC Portal | Hospital Mukah | Hospital Mukah | Tier 2 | OSH risk register | General | C No personal data |
| 04 | Kempen Derma Darah | Hospital Port Dickson | Blood Bank & Transfusion Unit | Tier 3 | Donor eligibility screening | Service | A Patient |
| 05 | Maternal Assessment Center registration | Hospital Port Dickson | O&G Clinical Informatics Team | Tier 3 | Feeds urgent obstetric triage | Service | A Patient |
| 06 | Klinik Diabetes Pintar | Hospital Port Dickson | Diabetes Clinical Care Team | Tier 2 | Intake form one clinic uses; doctor reviews it | Service | A Patient |
| 18 | Akasia Ward MO Task Manager | Hospital Port Dickson | Medical Dept Informatics Team | Tier 3 | Ward-round tasks and shift handover | General | A Patient |
| 19 | e-Lampiran D (drug formulary) | Hospital Port Dickson | Urusetia JKUT, Pharmacy | Tier 1 | Still in development | General | C No personal data |
| 21 | MedPulse MAR | Hospital Port Dickson | Clinical Informatics & Nursing Safety | Tier 3 | Medication administration record | General | A Patient |
| 40 | Psychiatry Department Dashboard (HPD) | Hospital Port Dickson | Psychiatry Department | Tier 2 | Admin dashboard for one department | Facility | B Staff |
| 41 | OT Unit Staff Movement & Leave | Hospital Port Dickson | Occupational Therapy Unit | Tier 2 | Leave register for one unit | General | B Staff |
| 42 | Aduan HPD complaints | Hospital Port Dickson | Public Relations & Complaints Unit | Tier 2 | Complaint tracking for one unit | General | A Patient |
| 43 | Vehicle Booking | Hospital Port Dickson | Transportation Unit | Tier 2 | Vehicle requests for one unit | General | B Staff |
| 44 | Credentialing & Privileging Portal | Hospital Port Dickson | Clinical Privileging Committee | Tier 3 | Expired privileges are a patient-safety risk | General | B Staff |
| 45 | Nursing Daily Census (HPD) | Hospital Port Dickson | Nursing Division | Tier 3 | Hospital-wide bed occupancy | General | C No personal data |
| 46 | IQC Glucometer POCT | Hospital Port Dickson | Pathology & POCT QC Unit | Tier 3 | Clears glucometers before patient use | General | C No personal data |
| 07 | Memory Clinic Intake | Hospital Port Dickson / NMS | Geriatric & Psychogeriatric Team | Tier 2 | Intake form one clinic uses; doctor reviews it | Service | A Patient |
| 37 | HPP OSH-Alert | Hospital Pulau Pinang | Occupational Health & OSH Unit | Tier 2 | Staff incident reporting for one unit | General | B Staff |
| 38 | Sistem eBooking | Hospital Pulau Pinang | IT Department | Tier 2 | Room booking; low impact if down | General | C No personal data |
| 30 | Patient Safety Incident Reporting | Hospital Sultanah Aminah JB | Quality Unit, HSAJB | Tier 3 | Patient safety; statutory IR form | General | A Patient |
| 32 | E-Kehadiran Kursus | JKN Sarawak | JKN Sarawak | Tier 2 | Training attendance | General | B Staff |
| 33 | Mental Wellbeing Monitoring Portal | JKN Sarawak | JKN Sarawak | Tier 2 | Anonymous staff pulse survey | General | C No personal data |
| 34 | MedMove Pro | JKN Sarawak | JKN Sarawak | Tier 3 | Interfacility patient transport | General | A Patient |
| 35 | MEDEVAC E-Request Portal | JKN Sarawak | JKN Sarawak | Tier 3 | Emergency air transfers | Facility | A Patient |
| 08 | Klinik Reumatologi pre-consultation | National Medical Services | Rheumatology Specialty Service | Tier 2 | Intake form one clinic uses; doctor reviews it | Service | A Patient |
| 09 | CardioFlow HF Clinic Portal | National Medical Services | Cardiology Specialty Service | Tier 2 | Intake and note one clinic uses; clinician reviews it | Service | A Patient |
| 39 | Ward Jasmin pharmacy stock | Not stated | Pharmacy Logistics Team, Ward Jasmin | Tier 2 | Stock for one ward | General | C No personal data |
| 50 | Internal Medicine Duty Planner | Not stated | Internal Medicine Roster Committee | Tier 2 | One department roster | Service | B Staff |
| 49 | SJAM KPW Dispatch & Analytics | St John Ambulance, WP | SJAM Dispatch Division | Tier 3 | Pre-hospital triage and handover | Facility | A Patient |

## What the registry shows

The most urgent gap is backups. None of HTPN's 15 apps in routine use has a named backup maintainer, and five of them are Tier 3.

| Count | HTPN (17) | Partners (33) | All (50) |
| --- | --- | --- | --- |
| Tier 3, Hospital-critical | 5 | 12 | 17 |
| Tier 2, Departmental | 10 | 20 | 30 |
| Tier 1, Experimental | 2 | 1 | 3 |
| Reach: General | 4 | 21 | 25 |
| Reach: Service | 10 | 9 | 19 |
| Reach: Facility | 3 | 3 | 6 |
| Data class A, identifiable patient | 10 | 16 | 26 |

- **Key-person risk is concrete.** Dr Naim is credited on five HTPN apps, including two of the five Tier 3 apps (TherapyAI and Dashboard ED). Dr Fairis is credited on five, including OT Scheduling. Both should be the first to hand over to a backup.
- **AI on patient data needs a route decision.** EBL Estimator, TherapyAI and the Clinical Document Checker all process identifiable patient data with AI. Each needs a decision on cloud versus the on-premises route before its next release. The Slide Deck OCR editor runs on cloud AI, so keep it off clinical documents.
- **One pattern is ready to scale.** Seven intake apps share the same pre-consultation design: GynaeClerk, AntenatalClerk, and five built at Hospital Port Dickson and National Medical Services. One configurable intake template is the strongest candidate for Phase 4's first general app at another KKM hospital.
- **Partners carry most of the critical load.** Twelve of the 17 Tier 3 apps belong to partners. Hospital Port Dickson alone has built 14 apps, seven of them Tier 3, so it is the first partner to share the tiering with.
- **Two partner apps have no facility recorded:** Ward Jasmin pharmacy stock and the Internal Medicine Duty Planner. Ask the builders which hospital runs them.

## Next steps for November

These steps finish the registry part of Phase 3. The build lifecycle, data governance and baselines follow once owners are named.

- [ ] Send each HTPN builder their row and ask them to confirm the tier, reach and data class.
- [ ] Name one owner and one backup maintainer for the five Tier 3 apps first: Fetal Kick Chart, OT Scheduling, EBL Estimator, TherapyAI and Dashboard ED.
- [ ] Name backups for the ten Tier 2 apps.
- [ ] Agree the A to D data classes with the hospital's PDPA officer, and replace the working scheme above with the agreed one.
- [ ] Decide the AI route (cloud or on-premises) for EBL Estimator, TherapyAI and the Clinical Document Checker.
- [ ] Share the partner table with Hospital Port Dickson first, then the other partner facilities.
- [ ] Present the registry to the hospital director and JP ICT for endorsement as the official HTPN app register.
