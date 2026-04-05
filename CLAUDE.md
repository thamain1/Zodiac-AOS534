# Zodiac (AOS534) — CLAUDE.md

## Project Identity
- **Internal name**: AOS534
- **Public brand**: Zodiac
- **UI branding rule**: Primary = Zodiac. AOS534 appears in secondary labels, tooltips, architecture refs, and admin/internal contexts only.
- **Type**: Governance-first cybersecurity simulator — investor/grant demo, NOT a production security tool
- **Build doc**: `C:\Dev\Zodiac-AOS534\build_document.txt` (source of truth for requirements)

## Platform Definition (Core Philosophy)

> **AOS534 combines intelligence + evidence + context to produce defensible truth.**

AOS534 is a governance-first cybersecurity and operational truth platform. It is NOT a SIEM, XDR, dashboard, or alerting tool. It is the **truth, evidence, and decision layer** that sits above and across existing technologies.

Its purpose: help organizations understand what is actually happening, what can be proven, what matters, and what action should be taken next.

### The 5-Stage Workflow — backbone of the entire platform
Every UI screen, report, and architecture decision aligns to this:
1. **Signal Intake** — ingest signals from distributed agents and integrations
2. **Correlation** — link signals across time, space, entity, and behavior
3. **Truth Validation** — validate what is real against authoritative sources (Truth Model v0.98 simulated)
4. **Decision** — present validated evidence for human or automated decisioning
5. **Evidence & Replay** — preserve chain-of-custody, enable forensic replay and timeline review

### Core Mindset (use this copy throughout the product)
> *"AOS534 does NOT detect issues — you identify issues by combining Intelligence + Evidence + Context."*

### What AOS534 IS
- A governance-first platform
- A truth-validation system
- An evidence-driven decision environment
- A replayable, auditable operational intelligence layer
- A platform for combining signals into defensible understanding
- Court-defensible, auditable, replayable — chain-of-custody thinking throughout

### What AOS534 IS NOT
- Not a generic SOC dashboard
- Not a fantasy "AI takes over everything" platform
- Not a simple alert console
- Not a vendor replacement claim machine
- Not a bright cyberpunk interface
- Not a cartoon product

### Integrations (governance overlay — not replacement)
Integrates with Splunk, IBM QRadar, Wazuh, and others. AOS534's job is to **unify, scrutinize, and validate** across them — not replace them.

### Design Optimization Targets
Optimize every screen, flow, and piece of copy for:
**clarity · proof · trust · control · replayability · executive readability**

## CRITICAL NON-NEGOTIABLES
1. Every screen must display: "SIMULATED ENVIRONMENT", "DEMO MODE", "SIMULATED DATA / GOVERNANCE LOGIC"
2. Every data element must carry a truth label badge: **Runtime-inspired** | **Simulated** | **Roadmap**
3. This is a GOVERNANCE OVERLAY simulator — never imply Zodiac replaces vendors or takes live control
4. "98% truth model" must appear as: `Truth Model: v0.98 (simulated)` — never a real performance claim
5. All mock data uses anonymized vendor classes or mock vendor names (no real vendor IP)

## Tech Stack (pending user confirmation)
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui (or similar)
- **Mock API**: Node/Express (separate server)
- **State**: Zustand (client) + scenario state machine (server)
- **Data**: Seeded JSON fixtures on server
- **Live feel**: SSE or WebSocket for log streaming

## Architecture Pattern
```
Frontend (React/TS) ← REST + SSE → Mock API Server (Node/Express)
                                         ↓
                                  Seeded JSON fixtures
                                  Scenario state machine
                                  Log stream emitters
```

## Named Agents (appear across screens)

> **Future deployment feature**: Clients will be able to rename agents in their instance.
> Default display names below are used throughout the simulator. Internal/legacy names are kept for reference.

| Display Name | Internal Ref | Full Role Definition |
|--------------|-------------|----------------------|
| **Argus** | Noah | AOS534's identity and trust authority that manages registry, RBAC, and access decisions so the platform knows who is valid, active, and allowed. |
| **Verdict** | T-Bone / Mitchell | AOS534's governance reasoning agent that evaluates inputs across the platform and makes final policy and decisioning calls. |
| **Bedrock** | Roman | AOS534's hardware and substrate security agent that governs device interfaces, wireless exposure, and physical-layer trust and risk. |
| **Aegis** | Von | AOS534's network governance agent that monitors transport posture, validates network truth, and supports controlled policy enforcement decisions. |
| **Apollo** | Apollo | AOS534's truth and evidence authority that generates, signs, preserves, and validates artifacts for trusted operational and investigative use. |
| **Conduit** | Chewy | AOS534's secure logging and forensic correlation agent that collects, protects, and organizes audit and event data into tamper-resistant operational truth. |
| **Atlas** | Atlas | AOS534's topology and dependency mapping agent that tracks relationships, pathways, and blast radius across systems and services. |
| **Chronicle** | Snitch | AOS534's narrative reporting agent that turns technical findings into human-readable escalations, storyboards, and executive-level explanations. |
| **Sage** | Joshy | AOS534's explainability and human-guidance agent that translates complex platform activity into clear, understandable insights for operators and leaders. |
| **Helm** | KiKi | AOS534's threat intelligence validation agent that enriches advisories, compares sources, and adds confidence and context to security findings. |
| **Canon** | Micah | AOS534's external threat-hunting agent that looks outside the environment for emerging risks and feeds those findings back into the platform for validation and governance. |
| **Relic** | Relic | AOS534's historical memory and retrieval agent — recalls past evidence, prior events, and archived artifacts to support current investigations and replay analysis. |

## 14 Screens
1. Mission Overview
2. Environment Truth Map ← centerpiece
3. Identity Governance (Argus + Sage)
4. Cloud Governance (Sage)
5. Network/Substrate Governance (Bedrock + Aegis + Atlas)
6. Advanced API (Inline / Proxy)
7. AI Agent Governance
8. Evidence/Ledger (Apollo + Chewy)
9. Reporting/Storyboards (Snitch)
10. Secure Channel Visibility (mTLS/PQC/SPIFFE/SPIRE)
11. Policies/Alerts/Config
12. Control Plane / Data Plane Health
13. Scenario Playback
14. Roadmap / Next Waves

## Simulator Modes
- Guided demo | Free exploration | Operator | Executive/Investor | Scenario playback | Before/After toggle

## Build Phases
| Phase | Screens |
|-------|---------|
| **1** (first) | Mission Overview, Environment Truth Map, Identity Governance, Reporting/Storyboards, Scenario Playback shell |
| **2** | Network/Substrate, Advanced API, Evidence/Ledger, Control/Data Plane Health |
| **3** | Secure Channel Visibility, Policies/Alerts/Config, AI Agent Governance, Cloud Governance |
| **4** | Roadmap/Next Waves, extra scenarios, polish |

## Required Scenarios (8)
1. Terminated user escalated access
2. Directory/workstation misalignment
3. Cloud IAM drift
4. Network appliance multi-vendor drift
5. Advanced API inline vs proxy difference
6. AI governance + evidence path
7. Storage governance + runtime validation lane
8. Roadmap-only supply-chain truth scoring preview

## Object Schema Rule
Every simulated object MUST have:
`declared_state`, `verified_state`, `alignment_state`, `truth_score`, `confidence_score`,
`evidence_refs`, `owner_system`, `risk_level`, `governance_status`, `last_change`, `source_of_signal`

Plus plane tag: `control_plane | data_plane | evidence_plane | reporting_plane | governance_plane | identity_plane | advisory_plane`

## Run Commands
```bash
# API server (port 3001)
cd C:/Dev/Zodiac-AOS534/server && npm run dev

# Frontend (port 5173, proxies /api → :3001)
cd C:/Dev/Zodiac-AOS534/client && npm run dev
```

## GitHub Repo
https://github.com/thamain1/Zodiac-AOS534

## Phase 1 Status — COMPLETE
Screens built: Mission Overview (1), Environment Truth Map (2),
Identity Governance (3), Reporting/Storyboards (9), Scenario Playback (13)
Server: All fixtures, routes, SSE streaming operational

## Phase 2 Status — COMPLETE
Screens built: Network/Substrate (5), Advanced API (6), Evidence/Ledger (8), CP/DP Health (12)
Server additions: HealthNode type, health fixture (15 nodes), health routes, WAP + API-GW-CORE objects, 4 new evidence artifacts

## Visual Design System (from image/ folder)

### Brand
- Bull (strength/forward force) + Lion (authority/control) — SEPARATE, NOT merged, NOT cartoon
- Bull+Lion logo appears top-right of every screen header
- "AOS534 ZODIAC OS" wordmark + "4wardmotion Solutions" sub-label

### Color Palette
- Background: Deep dark navy/near-black (~#0a0e1a)
- Teal/cyan: primary accents and node connections
- Semantic only: Green = verified, Amber = warning, Red = critical, Blue = info
- NO harsh neon — controlled glow only, reduce oversaturation

### Panel Aesthetic
- Glass-like surfaces with translucency and layered depth
- Slightly rounded corners, smooth edges, shadows define structure
- Cinematic lighting, subtle gradients
- Motion: calm, fluid — NO aggressive animations

### Layout (from main_dashboard.jfif)
- Left icon-only sidebar: AOS, Storyboard, BI, Evidence, Replay, Impact, Narrative, Frameworks
- Persistent top header: platform name | Trust Mode | Identity/Session | Evidence Freshness | Alerts | Bull+Lion logo
- Sub-tab row: Summary | Run | Provenance | Replay
- Left panel: Command Control + Topology Layers toggles
- Central canvas: topology map (primary living element)
- Right panel: Mission Control Widgets (Impact chart, Decision Queue, Evidence Store, Replay Timeline)
- Bottom: persistent timeline scrubber with replay controls

### Core 5-Stage Workflow (wire consistently across all reporting/storyboard screens)
1. Signal Intake → 2. Correlation → 3. Truth Validation → 4. Decision → 5. Evidence & Replay
Each stage card: Data Feeds, Confidence %, Honesty Status badge, output feeds

### Two Visual Tones (both must exist in the product)
| Tone | Used For | Feel |
|------|----------|------|
| **Operator** | All 14 screens, live data, logs, topology | Dark, premium, disciplined, enterprise — SOC-grade precision |
| **Executive/Storyboard** | Reports, Storyboards (Screen 9), exec summaries | Sketchnote-style, hand-drawn, approachable, visually narrative |

Executive storyboard screens should feel like a **guided visual explanation** of what happened, why it mattered, and what was validated — NOT like a SOC console.

### Executive Report Style
- Sketchnote/visual aesthetic — approachable, hand-drawn feel, icons + arrows + callouts
- NOT pixel-perfect polished for executive storyboards — intentionally human
- Bold key terms, color for emphasis, numbered steps around central concept

## Common Gotchas
- NEVER remove simulation/demo labels from any screen
- "Roadmap" features must be clearly badged — do not present them as current capability
- Fail-open = edge; Fail-closed = core/middleware (this distinction must be visible in API screen)
- Before/After toggle affects: scores, confidence, explanations, storyboards — wire all four
