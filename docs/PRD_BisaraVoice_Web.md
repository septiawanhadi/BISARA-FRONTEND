# PRD Bisara Voice-to-Sign Module (Web Platform)

**Version:** 1.0  
**Stack Summary:** React.js, Vite, Tailwind CSS, Three.js (React Three Fiber), Web Speech API (SpeechRecognition), Axios, FastAPI (Python), PostgreSQL, RapidFuzz.  
**Agent Workflow:** Follow phase-locked build stages. Visual and API connection validation required at the end of each phase.

---

## Section 0: Agent Instructions

You are a Senior Full-Stack and AI Engineer building the **Voice-to-Sign (Speech-to-Text to Avatar Animation) module** for **Bisara**—a Progressive Web App (PWA) gamified LMS.

### Core Rules for Construction:
1. **No Placeholders**: Do not generate mock/placeholder UI elements or bypass API integration. Every state (loading, empty, success, error) must be fully functional.
2. **Design Tokens First**: Do not inline raw hex colors or hardcode margins. Import all tokens from `/src/lib/tokens.ts` and motion variants from `/src/lib/animations.ts`.
3. **Robust Voice Error Handling**: Implement explicit handling for browser microphone permissions, network timeout, and low-confidence speech results (ERR-03 Noise Fallback).
4. **Phase-Locked Progress**: Do not build components for Phase N+1 until Phase N is complete, tested, and approved. Output: `✅ Phase [N] complete. Ready for review.` at the end of each phase.

---

## Section 1: Brand & Design System

### 1.1 Color Tokens
```ts
// /src/lib/tokens.ts
export const colors = {
  // Base Palette
  'bisara-bg':          '#EBF8FF',  // soft pastel blue background
  'bisara-surface':     '#FFFFFF',  // clean card and dialog surface
  'bisara-accent':      '#6B46C1',  // primary playful violet
  'bisara-accent-muted':'#805AD5',  // hover/pressed violet state
  'bisara-text':        '#1A202C',  // slate dark gray for readability
  'bisara-text-muted':  '#718096',  // secondary cool gray
  
  // Semantic Mappings
  'bg-primary':         '#EBF8FF',
  'bg-surface':         '#FFFFFF',
  'text-primary':       '#1A202C',
  'text-muted':         '#718096',
  'accent':             '#6B46C1',
  'accent-muted':       '#805AD5',

  // Status Colors
  'success':            '#38A169',  // green for matched words
  'warning':            '#D69E2E',  // warm yellow for microphone permission warnings
  'error':              '#E53E3E',  // red for low-light or server errors
  'info':               '#3182CE',  // light blue for helper tips
}
```

### 1.2 Typography
*   **Display Font**: `Fredoka One` (Google Fonts) - A rounded, bold font for accessible interfaces.
*   **Body Font**: `Outfit` (Google Fonts) - Clean, geometric sans-serif for reading transkrip.
*   **Size Scale**:
    *   `xs`: 12px (line-height: 16px)
    *   `sm`: 14px (line-height: 20px)
    *   `base`: 16px (line-height: 24px)
    *   `lg`: 18px (line-height: 28px)
    *   `xl`: 20px (line-height: 28px)
    *   `2xl`: 24px (line-height: 32px)
    *   `3xl`: 30px (line-height: 36px)

### 1.3 Motion Tokens
All motion variants are exported from `/src/lib/animations.ts` utilizing `framer-motion`:
*   `fadeUp`: Y-axis shift (+20px to 0px), duration 0.4s.
*   `fadeIn`: Opacity transition (0 to 1), duration 0.2s.
*   `scaleIn`: Scale transition (0.95 to 1.0), duration 0.25s.
*   `pulseMic`: Soft pulsing scale loop (1.0 to 1.15) for active listening indicator.

### 1.4 Global Rules
*   **Border Radius Scale**: `sm` (4px), `md` (8px), `lg` (16px), `full` (9999px).
*   **Shadow Scale**: `sm` (0 1px 2px 0 rgba(0, 0, 0, 0.05)), `md` (0 4px 6px -1px rgba(0, 0, 0, 0.1)), `lg` (0 10px 15px -3px rgba(0, 0, 0, 0.1)).
*   **CTAs**: Primary microphone button must be circular, using `bg-bisara-accent` and `border-radius: full` to look like a friendly, tactile interface.

---

## Section 2: Project Architecture

### 2.1 Folder Structure
```
/bisara-client (React PWA)
  /public
    /models
      lencana_prestasi.gltf  # Rigged 3D avatar model file
  /src
    /components
      /ui
        Button.tsx           # Playful primary/secondary button components
        Card.tsx             # Card container utilizing bisara-surface
      /shared
        ThreeCanvas.tsx      # WebGL Three.js wrapper component
        Avatar.tsx           # Loads and plays GLTF skeletal clips
      /screens
        VoiceTranslator.tsx  # Main voice translation module view
    /lib
      tokens.ts              # Color and font tokens
      animations.ts          # Framer Motion animation variants
      api.ts                 # Axios API client singleton
      localCache.ts          # IndexedDB wrapper (localForage) for model loading
    /types
      index.ts               # TypeScript interfaces
    App.tsx                  # Main router setup
    index.css                # Global Tailwind setup with fonts
    main.tsx                 # App mount entry point
```

### 2.2 Tech Dependencies
```bash
# Core & Build
npm install react react-dom vite @vitejs/plugin-react

# Styling & Animation
npm install tailwindcss postcss autoprefixer framer-motion

# WebGL 3D Rendering
npm install three @types/three @react-three/fiber @react-three/drei

# Storage & HTTP
npm install axios localforage
```

---

## Section 3: Navigation & Global Shell

*   **Header Bar**: Sticky top navigation on desktop, hiding on scroll. Displays the brand name "Bisara" (Fredoka One font) and a connection pill badge representing network heartbeat status ("Daring" / "Terputus").
*   **Route Setup**: This module resides on the route `/translate-voice`.

---

## Section 4: Voice Translator Screen (`/translate-voice`)

### 4.1 Interface Layout
*   **Desktop Layout**: 2-Column Split Screen (Max-width: 1280px, centered).
    *   **Left Column (Controls & Transcript Log)**: Microphone control panel, real-time transcript output box.
    *   **Right Column (WebGL Render Box)**: Three.js canvas displaying the 3D Avatar and an overlaying speech bubble.
*   **Mobile Layout**: Stacked vertically. WebGL Render Box on top (fixed aspect-ratio 4:3), Control Panel below.

### 4.2 UI Regions & Components

#### 4.2.1 Microphone Control Panel
*   **BACKGROUND**: `bisara-surface` (`#FFFFFF`) card.
*   **SECTIONS**:
    *   *Title*: "Penerjemah Suara ke Isyarat" (Outfit bold, `lg`, `bisara-text`).
    *   *Mic Button*: Large circular button (width/height: 96px). Uses `pulseMic` animation when listening state is true.
    *   *Instruction Label*: Changes dynamically depending on state.
*   **CTAs**:
    *   *Start Listening Button*: Circular CTA. Default state: purple accent background, microphone icon. Listening state: red background (`#E53E3E`), pulse animation.

#### 4.2.2 Live Transcription Box
*   **BACKGROUND**: Soft blue box (`#EBF8FF`).
*   **BEHAVIOR**: Renders the raw Speech-to-Text output in italics. If empty, displays placeholder: *"Kata yang Anda ucapkan akan muncul di sini..."*.

#### 4.2.3 WebGL Avatar Visualizer
*   **BACKGROUND**: `bisara-surface` with soft shadow.
*   **AVATAR CANVAS**:
    *   Renders `lencana_prestasi.gltf` centered in WebGL space.
    *   *Three.js AmbientLight* intensity: 0.7. *DirectionalLight* position: `[2, 2, 2]`.
    *   Supports orbit control rotation (constrained to horizontal orbit, Y-axis rotation only).
*   **SPEECH BUBBLE**: Floating card on top of the canvas. Displays current translated word or warning notifications.

### 4.3 Error, Loading, and Empty States

#### 4.3.1 Empty State (Initial)
*   **Label**: *"Klik tombol mikrofon di sebelah kiri untuk mulai berbicara."*
*   **Avatar**: Plays standard breathing idle animation (`anim_idle`).

#### 4.3.2 Loading State (Matching)
*   **Trigger**: Once speech recognition ends, while Axios is fetching the API.
*   **UI Indicator**: Micro-spinner appears in the transcription box. Speech bubble text: *"Mencari isyarat yang cocok..."*.

#### 4.3.3 ERR-03 (Noise Fallback / No Match)
*   **Trigger**: REST API returns `{ "match": false }` (Jaro-Winkler similarity score $< 70\%$).
*   **UI Indicator**: Speech bubble turns warning yellow (`#D69E2E`) with text: *"Maaf, suara kurang jelas atau kata belum ada di kamus. Bisa diulangi?"*.
*   **Avatar**: Plays `anim_bingung` (avatar scratching head/looking confused) for 2.5 seconds before returning to `anim_idle`.

#### 4.3.4 Permission Denied State
*   **Trigger**: User denies microphone permissions.
*   **UI Indicator**: Modal card warning overlays screen: *"Akses mikrofon ditolak. Mohon aktifkan izin mikrofon pada peramban Anda untuk menggunakan fitur ini."*.

---

## Section 5: Global Features

### 5.1 Web Speech API Integration
*   The module initializes a local wrapper around `window.SpeechRecognition` or `window.webkitSpeechRecognition`.
*   **Configuration**:
    *   `recognition.continuous = false` (stops recording after brief silence to process single sentence/phrase).
    *   `recognition.interimResults = false`.
    *   `recognition.lang = 'id-ID'` (forced Indonesian language model).
*   **Event Listeners**:
    *   `onstart`: Set `isListening = true`.
    *   `onend`: Set `isListening = false`.
    *   `onresult`: Captures transcript string $\rightarrow$ triggers REST API search pipeline.

### 5.2 API Integration
All network calls go through `/src/lib/api.ts`.
```typescript
export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  match: boolean;
  word: string;
  clip_name: string;
  confidence: number;
}
```
*   **Route**: `POST /api/v1/dictionary/search`
*   **Payload**: `SearchRequest`
*   **Response**: `SearchResponse`

### 5.3 Local Caching
*   The 3D model asset `lencana_prestasi.gltf` (approx. 3.2MB) must be loaded using localForage and saved in IndexedDB during the first visit.
*   Subsequent requests retrieve the model from IndexedDB rather than executing network fetches, keeping page load under 100ms.

---

## Section 6: Data Schemas & Mock Data

### 6.1 Database Schema (PostgreSQL)
```sql
CREATE TABLE kamus_bisindo (
    key VARCHAR(50) PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    video_guide_path VARCHAR(255) NOT NULL,
    animation_clip_name VARCHAR(100) NOT NULL, -- GLTF skeletal track name
    description TEXT,
    last_updated BIGINT NOT NULL,
    unsur_spok VARCHAR(2) CHECK (unsur_spok IN ('S', 'P', 'O', 'K', 'L'))
);
```

### 6.2 Mock Data Seeds (Kamus)
| key | word | category | video_guide_path | animation_clip_name | unsur_spok |
| :--- | :--- | :--- | :--- | :--- | :--- |
| halo | halo | Kata Santun | /assets/video/halo.mp4 | anim_halo | L |
| terima-kasih | terima kasih | Kata Santun | /assets/video/terima_kasih.mp4 | anim_terima_kasih | L |
| makan | makan | Kata Kerja | /assets/video/makan.mp4 | anim_makan | P |
| minum | minum | Kata Kerja | /assets/video/minum.mp4 | anim_minum | P |
| belajar | belajar | Kata Kerja | /assets/video/belajar.mp4 | anim_belajar | P |
| saya | saya | Kata Benda | /assets/video/saya.mp4 | anim_saya | S |
| kiko | kiko | Kata Benda | /assets/video/kiko.mp4 | anim_kiko | S |

---

## Section 7: Environment Variables

```
VITE_CLOUD_API_URL = https://api.bisara.com/v1   # API Gateway for REST requests
```

---

## Section 8: Build Order (Phase-Locked)

```
Phase 1:  Design tokens & theme configuration (tokens.ts, index.css)
Phase 2:  Scaffold folder directories & import Three.js libraries
Phase 3:  Implement Web Speech API Speech-to-Text hooks & Microphone control UI
Phase 4:  Set up WebGL Canvas & skeletal GLTF loader (Avatar.tsx)
Phase 5:  Integrate localForage IndexedDB caching for 3D GLTF asset
Phase 6:  Write and test API search requests via Axios (Fuzzy search matching)
Phase 7:  Implement Animation Mixer transitions & ERR-03 confused bubble logic
Phase 8:  Perform responsive UI audit and test microphone network resiliency

⛔ RULE: Do NOT start Phase N+1 until Phase N is complete and verified.
⛔ RULE: Always check browser permission state before starting SpeechRecognition.
⛔ RULE: Do not import Three.js components globally. Lazy-load WebGL Canvas to improve FCP.
```

---

## Section 9: Open Questions

| # | Question | Status | Impact if Unresolved |
|---|----------|--------|----------------------|
| 1 | Apakah model GLTF avatar menyertakan shape keys untuk ekspresi wajah? | ⏳ PENDING | Mempengaruhi visualisasi ekspresi emosi avatar saat animasi bingung (ERR-03). Jika tidak ada, hanya menggunakan skeletal rigging tangan. |
| 2 | Apakah browser bawaan iOS (Safari) mendukung penuh SpeechRecognition tanpa batasan? | ✅ RESOLVED | Safari iOS memerlukan trigger gestur klik eksplisit dari pengguna sebelum microphone stream dapat dibuka, ini telah diselesaikan dengan memicu `recognition.start()` murni di dalam event handler `onClick`. |
