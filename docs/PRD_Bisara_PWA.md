# PRD Bisara PWA (Cloud-Based AI Architecture)

**Version:** 1.1  
**Stack Summary:** React.js, Vite, Tailwind CSS, Google MediaPipe Holistic JS (Client-Side), FastAPI (Python Cloud Backend), PyTorch / TensorFlow (Cloud Model Execution), PostgreSQL (Cloud Database), Web Speech API, Axios & WebSockets, Framer Motion.  
**Agent Workflow:** Follow phase-locked build stages. Visual and API connection validation required at the end of each phase.

---

## Section 0: Agent Instructions

You are a Senior Full-Stack and Cloud AI Engineer building **Bisara**—a Progressive Web App (PWA) gamified LMS client coupled with a high-performance **Cloud AI Server** that acts as a real-time translation and inclusive learning tracker system between SIBI Sign Language and Text/Voice, optimized for two roles: Siswa (Student) and Guru (Teacher).

### Core Rules for Construction:
1. **Inference Decoupling**: The client-side PWA is responsible for webcam capture and landmark extraction (MediaPipe Holistic JS). The coordinate sequence must be sent over WebSockets or REST API to the **Cloud AI Server** for LSTM execution.
2. **Never generate placeholder API client logic** — all API routes, WebSocket listeners, and error boundaries must be fully wired and functional.
3. **Network Resilience & Latency Handling**: Since inference is cloud-based, you must implement strict loading, timeout, and reconnect states on the client (ERR-05: Connection Lost / Latency Spike).
4. **Phase-Locked Progress**: Do not build components for Phase N+1 until Phase N is complete and verified. Output: `✅ Phase [N] complete. Ready for review.` at the end of each phase.

---

## Section 1: Brand & Design System

### 1.1 Color Tokens
```ts
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
  'success':            '#38A169',  // green for correct gestures
  'warning':            '#D69E2E',  // warm yellow/gold for low light warnings
  'error':              '#E53E3E',  // red for out-of-frame or network errors
  'info':               '#3182CE',  // light blue for helper tips
}
```

### 1.2 Typography
*   **Display Font**: `Fredoka One` (Google Fonts) - A rounded, bold, and friendly font designed for kids and accessibility.
*   **Body Font**: `Outfit` (Google Fonts) - Clean, round sans-serif for high legibility.
*   **Size Scale**: Standard sizing xs (12px) $\rightarrow$ 4xl (36px).

### 1.3 Motion Tokens
All animations must be imported from `/src/lib/animations.ts` and support `prefers-reduced-motion`:
*   `fadeUp`, `fadeIn`, `scaleIn`, `slideInRight`.

### 1.4 Global Rules
*   **Background alternation**: Use `#EBF8FF` for core page backgrounds, and `#FFFFFF` for internal cards and widgets.
*   **Border Radius**: `sm` (4px), `md` (8px), `lg` (16px), `full` (9999px).
*   **CTAs**: Primary buttons must use `bg-bisara-accent` (`#6B46C1`) with a `border-radius` of `full` (rounded pill style) to maintain a playful, child-friendly appearance.

---

## Section 2: Project Architecture

### 2.1 Folder Structure
Bisara is divided into two distinct repositories/folders: a **React PWA Client** and a **Python FastAPI Server**.

```
/bisara-client (Frontend PWA)
  /src
    /assets
      /models
        avatar.gltf    # 3D cartoon avatar model with rigging clips
    /components
      /ui              # Base design tokens (Button.tsx, Card.tsx, Alert.tsx)
      /shared          # Custom logic blocks (CameraPreview.tsx, AvatarViewer.tsx)
      /screens         # Screen controllers
        Home.tsx
        CameraTranslator.tsx
        VoiceTranslator.tsx
        Dictionary.tsx
        Quiz.tsx
        TeacherDashboard.tsx # LMS monitoring and quiz assignment portal
    /lib
      animations.ts    # framer-motion variants
      tokens.ts        # Color and font tokens
      api.ts           # Axios and WebSocket API client singleton
      fuzzyMatcher.ts  # Client-side spelling checks
    /store
      dictionaryStore.ts # Cache state for local definitions
      quizStore.ts     # Score state and session
    /types
      index.ts         # TS type interfaces
    App.tsx
    index.css
    main.tsx

/bisara-server (Cloud AI API)
  /app
    __init__.py
    main.py            # FastAPI main entry point & routing
    model.py           # PyTorch/TensorFlow LSTM model loader
    schemas.py         # Pydantic request/response schemas
    config.py          # Server configs & variables
  /models
    sibi_lstm_weights.pt # Python PyTorch trained LSTM weights
  Dockerfile           # Deployment container config
  requirements.txt     # Python backend dependencies
```

### 2.2 Tech Dependencies
#### Client PWA:
*   `axios` - For REST API requests to the cloud server.
*   `socket.io-client` - For real-time WebSocket connection to stream keypoint sequences.
*   `@mediapipe/holistic` - Coordinate extraction for hands/pose.
*   `three` - 3D WebGL renderer for animating SIBI gestures on the avatar.
*   `localforage` - Caching dictionary GLTFs locally.

#### Cloud AI Server (FastAPI Backend):
*   `fastapi` - High-performance Python web framework.
*   `uvicorn` - ASGI server for running FastAPI.
*   `torch` or `tensorflow` - For running the deep LSTM model on the cloud.
*   `numpy` - High-performance numerical sequence arrays processing.
*   `pydantic` - Data validation and settings management.

---

## Section 3: Navigation & Global Shell

*   **Pattern**: Sticky top navigation bar on desktop, switching to bottom navigation tab bar on mobile screens.
*   **Header**: Always displays the logo "Bisara" (using `Fredoka One` typography), accompanied by a cloud connection status pill badge (green "Online/Daring" or red "Offline/Terputus" depending on cloud server heartbeat ping).
*   **Tab Items**: Beranda, Terjemahan Kamera, Terjemahan Suara, Kamus, Kuis.

---

## Section 4: Home Dashboard (`/`)

*   **Background**: `bisara-bg` (`#EBF8FF`)
*   **Layout**: Column-based scrollable layout. Max width `1280px` centered, padding `16px`.
*   **Features**:
    *   **Cloud Status Indicator**: Displays real-time API latency (e.g. "Latency: 45ms") to inform users of network quality.
    *   **Quick Start Cards (Grid 2x2)**: Link to translate-camera, translate-voice, dictionary, and quiz.
    *   **Daily Progress Card**: Displays current quiz stars earned today.

---

## Section 5: Camera Translator Screen (`/translate-camera`)

*   **Background**: `bisara-bg` (`#EBF8FF`)
*   **Layout**: Responsive grid (Desktop: Side-by-side Webcam Preview & Translation Log | Mobile: Stacked Webcam top, Translation Log bottom).
*   **Webcam Preview Container**:
    *   Webcam stream aspect ratio `4:3`.
    *   **Overlay Bounding Box**: Semi-transparent border overlay guiding user's coordinate center.
    *   **Client-Side Tracking Pill**: Green "Kamera Aktif" or grey "Mencari Aktor".
*   **Translation Output Box**:
    *   Bottom card component displaying translated SIBI words returned from the cloud in large print (`Outfit` font, bold, `2xl`).
    *   Contains a Play Button (speaker icon) to vocalise the text instantly using Web Speech Synthesis.
*   **Edge Case Handlers (Physical & Network Constraints)**:
    *   **ERR-01 (Low Light)**: Displays warning overlay if camera frame luminance drops under 100 Lux.
    *   **ERR-02 (Out of Frame)**: If hand coordinates go off boundaries, border turns bright red.
    *   **ERR-05 (Network Timeout/Latency)**: Shows visual alert if WebSocket response takes $> 500$ms or drops completely: *"Koneksi server lambat. Membuka ulang jalur komunikasi..."*.
*   **Data Pipeline**: Camera stream $\rightarrow$ Client MediaPipe Holistic $\rightarrow$ Extract Keypoints $\rightarrow$ Normalise relative to mid-shoulder $\rightarrow$ Push sequence (30 frames) via WebSocket to **Cloud AI Server** $\rightarrow$ Python PyTorch LSTM Model Inference $\rightarrow$ Return JSON string payload to Client $\rightarrow$ Display Text.

---

## Section 6: Voice Translator Screen (`/translate-voice`)

*   **Background**: `bisara-bg` (`#EBF8FF`)
*   **Layout**: Side-by-side (Left: Voice controls and input log | Right: Interactive 3D Canvas rendering the cartoon avatar).
*   **3D Canvas Viewer**:
    *   Meshes and materials loaded locally from `avatar.gltf` inside IndexedDB to save bandwidth.
*   **Voice Control Panel**:
    *   Large, pulsing circular microphone button.
    *   Displays real-time Speech-to-Text transcript in a visual speech bubble above the 3D avatar.
*   **Fuzzy Search & Noise Fallback (ERR-03)**:
    *   Sends transcribed text to Cloud API `POST /api/v1/dictionary/search`.
    *   The cloud server performs fuzzy matching (using Jaro-Winkler) against the PostgreSQL dictionary database.
    *   If confidence match $\ge 70\%$, returns corrected word and triggers avatar animation.
    *   If confidence match $< 70\%$, the avatar plays a "confused" animation (`scratch_head_anim`) with a warning bubble: *"Maaf, suara kurang jelas. Bisa diulangi?"*.

---

## Section 7: Dictionary Screen (`/dictionary`)

*   **Background**: `bisara-bg` (`#EBF8FF`)
*   **Layout**: Category filter buttons at the top, and a grid of 20 SIBI vocabulary cards below.
*   **Offline Cache**: Card information and paths to local GLTF visuals are cached in IndexedDB. If online, checks for content updates from Cloud database `GET /api/v1/dictionary/updates`.
*   **On Tap**: Card expands to full-screen drawer. The 3D avatar centers and performs the SIBI hand movement sequence at half-speed (0.5x speed) with a text guide description.

---

## Section 8: Quiz & Achievement System (`/quiz` & `/achievements`)

*   **Background**: `bisara-bg` (`#EBF8FF`)
*   **Concept**: Quizzes are structured as **Learning Tasks** (e.g. *Task Kata Santun*, *Task Anggota Keluarga*). Completing these tasks unlocks **3D Avatar rewards** (Characters & Accessories), gamifying Budi's learning.

### 8.1 Quiz Execution Loop (Siswa):
1.  **Task Selection**: Siswa chooses an active **Tugas Kuis** assigned by their Guru.
2.  **Challenge Phase**: System presents a SIBI word challenge from the assigned task (e.g. *"Terima Kasih"*).
3.  **Detection Phase**: Camera activates, tracking coordinate landmarks via MediaPipe Holistic JS on the client.
4.  **Assessment Phase**: The client-side WebSocket streams coordinate sequences to **Cloud AI Server** `/ws/quiz/validate`.
5.  **Cloud Return & Scoring**:
    *   **High Match ($\ge 85\%$ accuracy)**: Awards **3 Stars** + plays avatar victory jump animation + confetti burst.
    *   **Medium Match ($70\% - 84\%$)**: Awards **2 Stars** + displays corrective visual guide.
    *   **Low Match ($< 70\%$)**: Awards **1 Star** + prompts to review in Kamus.
6.  **Task Completion**: Once all words in the assigned task achieve $\ge 2$ stars, the Task is marked as **"Selesai" (Completed)**, saving records to the database.

### 8.2 Avatar Achievement Reward System (Gamification):
*   Completing Tasks accumulates **Stars** in the Siswa's profile.
*   **Achievement Room**: When the Siswa accumulates specific star counts, the system automatically unlocks a new Avatar character or accessory in their inventory:
    *   *Default*: Timi si Kucing (Unlocked).
    *   *50 Stars*: Unlock Character **"Kiko si Kelinci"** (Tugas Kata Dasar Selesai).
    *   *120 Stars*: Unlock Character **"Lulu si Beruang"** (Tugas Kata Santun Selesai).
    *   *200 Stars*: Unlock Accessory **"Topi Wisuda Emas"** (Seluruh Tugas Selesai).
*   Unlocked avatars/accessories are immediately usable as the tutor model in Kamus and Voice Translator.

### 8.3 Quiz Management & Progress View (Guru):
*   **Task Assignment**: Guru views which learning tasks have already been completed by students, and assigns *new advanced quizzes* based only on those completed tasks (e.g., Guru only unlocks "Kuis Level 2" once "Tugas Kata Santun" is completed).
*   **Progress Dashboard**: Guru views student profiles showing star totals, average SIBI accuracy rates, and task completion checklists.

### 8.4 Perbandingan Teknis: Kuis vs. Pembelajaran Biasa

Untuk memberikan pemahaman terperinci mengenai mekanisme sistem di sisi pengembang AI, berikut adalah matriks kontras teknis yang membedakan **Metode Pembelajaran Biasa (Kamus & Sandbox Kamera)** dengan **Sistem Kuis (Asesmen Psiko-Motorik Terpandu)**:

| Parameter Teknis | Metode Pembelajaran Biasa (Kamus & Sandbox) | Sistem Kuis (Asesmen Terpandu Guru) |
| :--- | :--- | :--- |
| **Sifat Aliran Kerja** | *Unconstrained & Exploratory* (Eksplorasi bebas tanpa sekuens waktu ketat). Siswa bebas memilih kosakata dan berlatih secara mandiri. | *Constrained & Task-Oriented* (Terikat tugas terstruktur yang ditugaskan oleh Guru). Siswa dipandu menyelesaikan kosakata tertentu. |
| **Mekanisme Inferensi AI** | *Local Sandbox Inference* (Deteksi kamera bersifat lokal untuk umpan balik teks real-time sederhana tanpa penyimpanan). | *Cloud AI Sequence Validation* (Sequence koordinat `[30, 126]` dikirim via WebSocket ke Cloud PyTorch LSTM untuk penilaian ketat). |
| **Tingkat Akurasi Penilaian** | *Low-to-Medium (Confidence threshold > 80%*). Fokus pada keberhasilan deteksi kasar agar siswa tidak frustrasi berlatih bebas. | *High (Strict Gold Standard validation)*. Server membandingkan akurasi rentetan gerakan secara spasial dan temporal $\ge 85\%$ untuk bintang 3. |
| **Pencatatan Database (State)** | Tidak ada pencatatan ke database riwayat kuis atau penyelesaian tugas. State murni di memori RAM runtime klien. | Menyimpan data pengerjaan ke tabel `riwayat_kuis` dan memperbarui status tabel `tugas_selesai` di PostgreSQL Cloud. |
| **Pemicu Reward (Gamifikasi)** | Tidak memicu penambahan bintang atau pembukaan kunci (*unlock*) avatar baru di `avatar_achievements`. | Mengakumulasikan bintang di dompet siswa dan secara otomatis memicu pembukaan kunci karakter/aksesoris avatar baru. |
| **Aksesibilitas Peran** | Diakses sepenuhnya secara mandiri oleh Siswa kapan saja. | Dikontrol dan ditugaskan oleh Guru berdasarkan riwayat tugas yang sudah diselesaikan siswa sebelumnya. |



---

## Section 9: Global Features & Backend API Specification

### 9.1 Client-Side Preprocessing Pipeline
To reduce network bandwidth and server computation overhead, the client PWA extracts and normalises the coordinates BEFORE transmitting them to the cloud.

```ts
// /src/lib/preprocessing.ts
export function getNormalizedSequence(handLandmarks: any[], poseLandmarks: any[]): number[] {
  const leftShoulder = poseLandmarks[11];
  const rightShoulder = poseLandmarks[12];
  
  const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
  const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
  const midShoulderZ = (leftShoulder.z + rightShoulder.z) / 2;
  
  const shoulderWidth = Math.sqrt(
    Math.pow(leftShoulder.x - rightShoulder.x, 2) +
    Math.pow(leftShoulder.y - rightShoulder.y, 2)
  );

  let normalized: number[] = [];
  
  handLandmarks.forEach(pt => {
    normalized.push((pt.x - midShoulderX) / shoulderWidth);
    normalized.push((pt.y - midShoulderY) / shoulderWidth);
    normalized.push((pt.z - midShoulderZ) / shoulderWidth);
  });
  
  return normalized; // Returns array of 126 coordinate floats
}
```

### 9.2 Cloud AI API Specifications (FastAPI)
The backend python server provides the following endpoints:

#### 1. Real-time Inference WebSocket:
*   **Route**: `WS /ws/v1/predict`
*   **Payload**: Streams 3D arrays of shape `[30, 126]` representing 30 frames of normalized keypoints.
*   **Response**:
    ```json
    {
      "word": "terima-kasih",
      "probability": 0.94,
      "inference_time_ms": 12.5
    }
    ```

#### 2. REST API Predict (Fallback):
*   **Route**: `POST /api/v1/predict`
*   **Request Schema**:
    ```json
    {
      "sequence": [[0.45, 0.62, -0.012, "... 126 values per frame"], "... repeated for 30 frames"]
    }
    ```
*   **Response Schema**:
    ```json
    {
      "predicted_word": "tolong",
      "confidence": 0.89
    }
    ```

#### 3. Save Quiz History & Task Completion:
*   **Route**: `POST /api/v1/quiz/history`
*   **Request**:
    ```json
    {
      "siswa_id": "budi123",
      "word_challenged": "belajar",
      "stars_earned": 3,
      "confidence": 0.91,
      "task_key": "kata-santun"
    }
    ```

#### 4. Guru Class Management:
*   **Create Class**: `POST /api/v1/classes` (Payload: `{ "nama_kelas": "Kelas Inklusi 3-A" }`)
*   **Get Student Progress**: `GET /api/v1/classes/{class_id}/students` (Returns list of students with task completion checklist and total stars).
*   **Assign Quiz by Completed Tasks**: `POST /api/v1/quizzes/assign` (Payload: `{ "class_id": "uuid", "quiz_id": "uuid", "prerequisite_task": "kata-santun" }`)

#### 5. Siswa Achievements:
*   **Get Unlocked Avatars**: `GET /api/v1/students/{siswa_id}/achievements` (Returns unlocked list of avatar characters/accessories).

---

## Section 10: Data Schemas & Database Models (PostgreSQL)

```typescript
// Unified Type Interfaces (Client-Side)
export interface KamusSibiItem {
  key: string;              // Primary key (e.g. 'makan')
  word: string;             // Bahasa Indonesia word
  category: string;         // 'Kata Kerja', 'Kata Benda', 'Kata Santun'
  animationClipName: string;// Corresponding GLTF clip name
  visualGuidePath: string;  // Local path or IndexedDB key to GLTF
  description: string;      // Manual description of the SIBI gesture
  lastUpdated: number;      // Unix timestamp
}

export interface RiwayatKuisItem {
  kuisId: string;           // Random UUID
  wordChallenge: string;    // Vocab tested
  starScore: number;        // Earned stars (1 - 3)
  timestamp: number;        // Unix timestamp of completion
  confidenceScore: number;  // Probability float returned by TensorFlow.js
}
```

```sql
-- PostgreSQL Database Schema (Cloud Server)
CREATE TABLE kamus_sibi (
    key VARCHAR(50) PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    animation_clip_name VARCHAR(100) NOT NULL,
    visual_guide_path VARCHAR(255) NOT NULL,
    description TEXT,
    last_updated BIGINT NOT NULL
);

CREATE TABLE riwayat_kuis (
    kuis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id VARCHAR(50) NOT NULL,
    word_challenge VARCHAR(50) REFERENCES kamus_sibi(key),
    star_score INT CHECK (star_score BETWEEN 1 AND 3),
    confidence_score REAL NOT NULL,
    timestamp BIGINT NOT NULL
);

CREATE TABLE kelas (
    kelas_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_kelas VARCHAR(100) NOT NULL,
    kode_kelas VARCHAR(10) UNIQUE NOT NULL,
    guru_id VARCHAR(50) NOT NULL,
    created_at BIGINT NOT NULL
);

CREATE TABLE siswa_membership (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kelas_id UUID REFERENCES kelas(kelas_id) ON DELETE CASCADE,
    siswa_id VARCHAR(50) NOT NULL,
    nama_siswa VARCHAR(100) NOT NULL,
    joined_at BIGINT NOT NULL
);

CREATE TABLE tugas_selesai (
    tugas_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id VARCHAR(50) NOT NULL,
    task_key VARCHAR(50) NOT NULL, -- e.g. 'kata-santun'
    completed_at BIGINT NOT NULL
);

CREATE TABLE avatar_achievements (
    achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id VARCHAR(50) NOT NULL,
    item_unlocked VARCHAR(100) NOT NULL, -- e.g. 'kiko_rabbit', 'graduate_hat'
    stars_required INT NOT NULL,
    unlocked_at BIGINT NOT NULL
);
```

---



---

## Section 11: Environment Variables

#### Client PWA:
```
VITE_CLOUD_API_URL           = https://api.bisara.com/v1   # Base URL for cloud API
VITE_WS_API_URL              = wss://api.bisara.com/ws     # Real-time WebSocket url
```

#### Cloud AI Server (FastAPI):
```
DATABASE_URL                 = postgresql://user:pass@host:5432/bisaradb # Cloud Database URI
MODEL_PATH                   = ./models/sibi_lstm_weights.pt             # Path to PyTorch model
ALLOWED_ORIGINS              = https://bisara.com,http://localhost:5173  # CORS configurations
```

---

## Section 12: Build Order (Phase-Locked)

```
Phase 1:  Design tokens & Global Styles mapping (Fredoka One, colors.ts)
Phase 2:  Scaffold directories (client-side React & server-side FastAPI structure)
Phase 3:  Cloud Database (PostgreSQL) installation & setup models migration
Phase 4:  FastAPI server boilerplate, PyTorch LSTM model loader, and /predict endpoints
Phase 5:  Client Camera Translator UI & MediaPipe keypoints coordinate extraction
Phase 6:  WebSocket communication layer establishment & sequence streaming logic
Phase 7:  Three.js GLTF Avatar Viewer & Animation Clip triggers
Phase 8:  Kamus, Kuis database persistence, and gamified logic integration
Phase 9:  Network resilience, reconnect layers auditing, and system performance audit

⛔ RULE: Do NOT start Phase N+1 until Phase N is complete, tested, and verified.
⛔ RULE: Never inline color values. Use tokens.ts constants only.
⛔ RULE: Every coordinate sequence sent to the cloud MUST pass through the shoulder normalisation function first.
⛔ RULE: Strict connection error boundaries must be implemented. If cloud goes offline, fall back to warning alerts.
```

---

## Section 13: Open Questions Table

| # | Question | Status | Impact if Unresolved |
|---|----------|--------|----------------------|
| 1 | Server Hosting: Apakah server hosting cloud menyertakan GPU? | ⏳ PENDING | Mempengaruhi latensi inferensi. LSTM ringan (64-128 units) dapat berjalan cepat di CPU, namun GPU diperlukan jika trafik concurrent tinggi. |
| 2 | Biaya Server: Bagaimana strategi pendanaan untuk menutupi biaya cloud hosting bulanan? | ⏳ PENDING | Proyek Bisara dirancang gratis untuk juri LIDM, memerlukan alokasi server tier gratis atau dana hibah perguruan tinggi. |
| 3 | Latensi Jaringan: Apakah server stabil memproses data jika koneksi 3G? | ✅ RESOLVED | Menambahkan kompresi float koordinat (mengurangi desimal) untuk memperkecil ukuran payload WebSocket klien-ke-server. |
