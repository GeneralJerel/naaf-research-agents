

# Revamped Agent Research Animation

Transform the current basic spinner + text progress into an immersive, ChatGPT Deep Research-style "agent thinking" experience when generating a country report.

## What Changes

### 1. New research step data model (`src/lib/mockResearch.ts`)

Replace the simple string callback with a richer event stream. Each step will have:
- **type**: `thinking` | `searching` | `reading` | `scoring`
- **message**: The agent's internal reasoning text (e.g., "I'm pulling together specifics on China's electricity costs...")
- **source**: Optional URL being "read" (e.g., reuters.com, eia.gov)
- **layer**: Which layer this relates to
- **timestamp**: For elapsed-time display

Pre-scripted step sequences per layer that mimic the ChatGPT Deep Research log -- e.g., for Layer 1 (Power): search for industrial electricity price, read source, think about findings, then score.

### 2. New full-screen research view component (`src/components/AgentResearchView.tsx`)

Instead of a small dialog, clicking "Start Research" navigates to a dedicated research page (or takes over the dialog as a full-screen overlay). It shows:

- **Header**: "Country AI Readiness Assessment" with the country name, animated typing effect
- **Live log feed**: A scrolling timeline of agent steps, each appearing with a fade-in animation:
  - "Searched for [query]" entries with a search icon
  - "Read [source.com]" entries with a globe/link icon  
  - "Thinking..." blocks with italicized reasoning text that types in character by character
  - Layer completion cards that slide in showing the score once a layer finishes
- **Progress sidebar/bar**: Shows which of the 8 layers are done (checkmarks), in-progress (pulsing dot), or pending (gray)
- **Source counter**: "X sources analyzed" that increments live
- **Elapsed timer**: Running clock like "Research completed in 2m 14s"

### 3. Updated `CreateReportDialog.tsx`

When the user clicks "Start Research":
- Close the dialog
- Navigate to `/research/[country]` which renders the `AgentResearchView`
- Once research completes, auto-redirect to `/report/[country]` after a brief "Research complete" state

### 4. New route for the research view

Add `/research/:countryName` route in `App.tsx` pointing to a new `ResearchPage` (or inline the `AgentResearchView`).

## Visual Design

- Dark-ish card background for the log feed area (using existing `bg-card` with subtle border)
- Each log entry has a left-side icon (Search, Globe, Brain/Sparkle, CheckCircle) color-coded by type
- Typing animation on "thinking" messages using a CSS `steps()` animation or interval-based character reveal
- Layer completion cards use existing layer color variables (`--layer-N`)
- Progress indicators use the 8-layer pill bar already on the report page, but animated (gray -> pulsing -> filled)
- Final state shows all 8 layers checked with overall score ring animating in

## Technical Details

**Modified files:**
- `src/lib/mockResearch.ts` -- New `ResearchEvent` interface and richer step emitter with ~4-6 substeps per layer (search, read, think, score). Total ~40 events over ~15-20 seconds.
- `src/components/CreateReportDialog.tsx` -- Simplified to just collect country name and navigate to `/research/[country]`
- `src/App.tsx` -- Add `/research/:countryName` route

**New files:**
- `src/components/AgentResearchView.tsx` -- The main animated research replay component with:
  - `useEffect` that runs `mockResearchCountry()` with the new event callback
  - State arrays for `events[]`, `completedLayers[]`, `currentLayer`
  - Auto-scroll ref on the log container
  - Typing animation hook for thinking messages
  - Elapsed time counter
- `src/pages/ResearchPage.tsx` -- Wrapper page that reads `countryName` from URL params and renders `AgentResearchView`, handling redirect to report on completion

**Animation approach:**
- Each new event fades in (`animate-fade-in`)
- Thinking text uses a `useTypingEffect` custom hook (interval-based character reveal)
- Layer progress pills transition from `opacity-30` to `opacity-100` with a scale pop
- Score numbers count up using `requestAnimationFrame`
- Completion state triggers a brief celebration (score ring + "Research complete" with fade-in)

**Mock data structure per event:**
```text
{ type: "searching", message: "China industrial electricity price 2023", layer: 1 }
{ type: "reading", message: "china-briefing.com", url: "https://china-briefing.com/...", layer: 1 }
{ type: "thinking", message: "China's industrial power rate slightly increased to $0.088/kWh in 2024...", layer: 1 }
{ type: "scoring", message: "Layer 1: Power & Electricity", score: 75, layer: 1 }
```

