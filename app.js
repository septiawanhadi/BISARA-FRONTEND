// BISARA PWA Core Application Engine
// Designed for the Zain & Nunito theme with high fidelity interactions

// Global State
const appState = {
  user: {
    username: "Anya",
    role: "student", // student, teacher
    nickname: "Anya",
    gender: "female",
    avatarId: "timi",
    stars: 38,
    progress: 38, // percentage of daily target
    quizCount: 1, // 1/3 quizzes complete
  },
  dictionary: [
    // Kalimat
    { key: "halo-apa-kabar", word: "Halo, apa kabar?", category: "kalimat", clip: "halo", description: "Lambaikan tangan kanan Anda di depan bahu kanan secara santai dari kiri ke kanan.", learned: true, icon: "👋" },
    { key: "siapa-nama-kamu", word: "Siapa nama kamu?", category: "kalimat", clip: "nama", description: "Arahkan jari telunjuk Anda ke arah lawan bicara, lalu silangkan jari telunjuk dan jari tengah membentuk huruf N.", learned: true, icon: "👤" },
    { key: "boleh-minta-tolong", word: "Boleh minta tolong?", category: "kalimat", clip: "tolong", description: "Satukan kedua telapak tangan Anda di depan dada lalu gerakkan perlahan ke bawah searah ulu hati.", learned: false, icon: "🤝" },
    { key: "aku-mau-makan", word: "Aku mau makan", category: "kalimat", clip: "makan", description: "Bentuk tangan kanan menguncup, sentuh ujung-ujung jari ke mulut beberapa kali berturut-turut.", learned: false, icon: "🍚" },
    { key: "terima-kasih-bantuan", word: "Terima kasih atas bantuannya!", category: "kalimat", clip: "terima-kasih", description: "Letakkan ujung jari tangan kanan di dagu, gerakkan tangan melengkung ke depan dan ke bawah.", learned: true, icon: "❤️" },
    { key: "ada-apa-dengan-dia", word: "Ada apa dengan dia?", category: "kalimat", clip: "tanya", description: "Arahkan tangan kanan dengan telapak menghadap ke atas, lalu gerakkan sedikit ke atas dan bawah dengan ekspresi bingung.", learned: false, icon: "❓" },
    
    // Kata
    { key: "makan", word: "Makan", category: "kata", clip: "makan", description: "Bentuk ujung-ujung jari tangan kanan menyatu lalu arahkan mendekati mulut berulang kali.", learned: false, icon: "🍽️" },
    { key: "minum", word: "Minum", category: "kata", clip: "minum", description: "Bentuk genggaman tangan kanan seperti memegang gelas, lalu gerakkan ibu jari mengarah ke mulut seolah menenggak cairan.", learned: false, icon: "🥤" },
    { key: "tolong", word: "Tolong", category: "kata", clip: "tolong", description: "Katupkan kedua telapak tangan di depan dada seakan memohon bantuan dengan santun.", learned: true, icon: "🙏" },
    { key: "terima-kasih", word: "Terima Kasih", category: "kata", clip: "terima-kasih", description: "Letakkan ujung jari di dekat dagu atau bibir bawah, kemudian gerakkan tangan melengkung ke depan dan bawah secara halus.", learned: false, icon: "💖" },
    { key: "halo", word: "Halo", category: "kata", clip: "halo", description: "Lambaikan telapak tangan kanan terbuka di depan dada atau pelipis melambangkan sapaan hangat.", learned: true, icon: "👋" },
    { key: "belajar", word: "Belajar", category: "kata", clip: "belajar", description: "Buka telapak tangan kiri mendatar di depan dada, lalu ketukkan ujung jari tangan kanan berulang kali di atas telapak tangan kiri.", learned: false, icon: "📖" },
    { key: "rumah", word: "Rumah", category: "kata", clip: "rumah", description: "Satukan ujung-ujung jari kedua tangan di atas membentuk atap segitiga menyiku.", learned: true, icon: "🏠" },
    { key: "sekolah", word: "Sekolah", category: "kata", clip: "sekolah", description: "Gambarkan atap rumah dengan tangan, kemudian ketukkan ujung jari kanan di telapak kiri melambangkan belajar.", learned: false, icon: "🏫" },
    { key: "buku", word: "Buku", category: "kata", clip: "buku", description: "Satukan kedua telapak tangan merapat, lalu buka perlahan seperti membuka lembaran buku.", learned: true, icon: "📚" },
    { key: "saya", word: "Saya", category: "kata", clip: "saya", description: "Ketuk dada tengah Anda perlahan menggunakan ibu jari atau telapak tangan kanan terbuka.", learned: false, icon: "🙋" },
    { key: "kamu", word: "Kamu", category: "kata", clip: "kamu", description: "Arahkan jari telunjuk tangan kanan menunjuk lurus ke depan ke arah lawan bicara.", learned: true, icon: "👉" },
    { key: "guru", word: "Guru", category: "kata", clip: "guru", description: "Sentuhkan ujung jari telunjuk dan jempol kanan di dekat kening kemudian gerakkan ke bawah membentuk gerakan mengajar.", learned: false, icon: "👩‍🏫" },
  ],
  unlockedAvatars: ["timi"], // default Timi is unlocked
  activeDictFilter: {
    type: "all",
    status: "all"
  },
  activeCameraStream: null,
  activeQuizCameraStream: null,
  cameraAnimationId: null,
  quizCameraAnimationId: null,
  cameraActive: false,
  quizCameraActive: false,
  
  // Voice engine states
  voiceSpeechRecognizer: null,
  isRecordingVoice: false,
  activeSpeechGestureWord: null,
  avatarGestureTimer: null,
  avatarGestureFrame: 0,
  
  // Quiz tracking
  activeQuizItem: null,
  quizRounds: [
    { word: "Terima Kasih", expectedKey: "terima-kasih" },
    { word: "Makan", expectedKey: "makan" },
    { word: "Belajar", expectedKey: "belajar" }
  ],
  currentQuizIndex: 0,
  quizStarsEarned: 0,
  quizAcc: 0,
};

// Avatar vector assets - programmatically drawn via clean SVGs inside app.js
const avatars = {
  timi: {
    name: "Timi si Kucing",
    color: "#7C3AED",
    accent: "#FF4D9D",
    emoji: "🐱",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100" height="100" fill="#F5F7FF" rx="20"/>
      <circle cx="50" cy="53" r="32" fill="#7C3AED"/>
      <!-- Ears -->
      <polygon points="22,30 40,40 22,50" fill="#6D28D9"/>
      <polygon points="26,34 36,41 26,46" fill="#FF4D9D"/>
      <polygon points="78,30 60,40 78,50" fill="#6D28D9"/>
      <polygon points="74,34 64,41 74,46" fill="#FF4D9D"/>
      <!-- Inner Face -->
      <circle cx="50" cy="56" r="25" fill="#C084FC"/>
      <!-- Eyes -->
      <circle cx="42" cy="52" r="4.5" fill="#111827"/>
      <circle cx="43.5" cy="50.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="58" cy="52" r="4.5" fill="#111827"/>
      <circle cx="59.5" cy="50.5" r="1.5" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <polygon points="50,59 47,56 53,56" fill="#FF4D9D"/>
      <path d="M47,61 C48,63 50,63 50,61 C50,63 52,63 53,61" fill="none" stroke="#111827" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Cheeks -->
      <circle cx="36" cy="58" r="3" fill="#FF4D9D" opacity="0.5"/>
      <circle cx="64" cy="58" r="3" fill="#FF4D9D" opacity="0.5"/>
    </svg>`
  },
  kiko: {
    name: "Kiko si Kelinci",
    color: "#22D3EE",
    accent: "#FF8A00",
    emoji: "🐰",
    starsNeeded: 50,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100" height="100" fill="#F5F7FF" rx="20"/>
      <circle cx="50" cy="55" r="30" fill="#22D3EE"/>
      <!-- Long Ears -->
      <rect x="30" y="8" width="12" height="30" rx="6" fill="#0EA5E9" transform="rotate(-5, 36, 23)"/>
      <rect x="33" y="12" width="6" height="22" rx="3" fill="#FF4D9D" transform="rotate(-5, 36, 23)"/>
      <rect x="58" y="8" width="12" height="30" rx="6" fill="#0EA5E9" transform="rotate(5, 64, 23)"/>
      <rect x="61" y="12" width="6" height="22" rx="3" fill="#FF4D9D" transform="rotate(5, 64, 23)"/>
      <!-- Inner Face -->
      <circle cx="50" cy="58" r="23" fill="#E0F7FA"/>
      <!-- Eyes -->
      <circle cx="42" cy="54" r="4" fill="#111827"/>
      <circle cx="43" cy="52.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="58" cy="54" r="4" fill="#111827"/>
      <circle cx="59" cy="52.5" r="1.2" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <polygon points="50,60 48,58 52,58" fill="#FF4D9D"/>
      <path d="M48,62 C49,63.5 50,63.5 50,62 C50,63.5 51,63.5 52,62" fill="none" stroke="#111827" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Teeth -->
      <rect x="48.5" y="63" width="3" height="3" fill="#FFFFFF" stroke="#111827" stroke-width="1"/>
    </svg>`
  },
  lulu: {
    name: "Lulu si Beruang",
    color: "#FF8A00",
    accent: "#FFD60A",
    emoji: "🐻",
    starsNeeded: 120,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100" height="100" fill="#F5F7FF" rx="20"/>
      <!-- Round Ears -->
      <circle cx="28" cy="36" r="12" fill="#D97706"/>
      <circle cx="28" cy="36" r="7" fill="#FFD60A"/>
      <circle cx="72" cy="36" r="12" fill="#D97706"/>
      <circle cx="72" cy="36" r="7" fill="#FFD60A"/>
      <!-- Bear Head -->
      <circle cx="50" cy="55" r="32" fill="#FF8A00"/>
      <!-- Snout -->
      <circle cx="50" cy="62" r="14" fill="#FFE082"/>
      <!-- Eyes -->
      <circle cx="39" cy="50" r="4" fill="#111827"/>
      <circle cx="40" cy="48.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="61" cy="50" r="4" fill="#111827"/>
      <circle cx="62" cy="48.5" r="1.2" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <ellipse cx="50" cy="57" rx="4" ry="2.5" fill="#111827"/>
      <path d="M47,61 C49,63 50,63 50,61 C50,63 51,63 53,61" fill="none" stroke="#111827" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  koko_hat: {
    name: "Topi Wisuda Emas",
    color: "#F5F7FF",
    accent: "#FFD60A",
    emoji: "🎓",
    starsNeeded: 200,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100" height="100" fill="#F5F7FF" rx="20"/>
      <circle cx="50" cy="56" r="28" fill="#334155"/>
      <!-- Cap -->
      <polygon points="50,15 88,32 50,48 12,32" fill="#1E293B"/>
      <!-- Diamond cap body -->
      <path d="M30,38 L30,48 C30,55 50,58 50,48 L50,38 Z" fill="#0F172A"/>
      <!-- Gold tassel -->
      <line x1="50" y1="32" x2="18" y2="40" stroke="#FFD60A" stroke-width="2.5"/>
      <polygon points="18,40 15,48 21,48" fill="#FFD60A"/>
      <!-- Eyes -->
      <circle cx="40" cy="58" r="4" fill="#FFFFFF"/>
      <circle cx="60" cy="58" r="4" fill="#FFFFFF"/>
      <circle cx="40" cy="58" r="2" fill="#0F172A"/>
      <circle cx="60" cy="58" r="2" fill="#0F172A"/>
      <path d="M46,65 C48,67 52,67 54,65" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  }
};

// Start application
window.addEventListener("DOMContentLoaded", () => {
  // Check browser speech recognition availability
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    appState.voiceSpeechRecognizer = new SpeechRecognition();
    appState.voiceSpeechRecognizer.continuous = false;
    appState.voiceSpeechRecognizer.lang = "id-ID";
    appState.voiceSpeechRecognizer.interimResults = false;
    
    appState.voiceSpeechRecognizer.onstart = () => {
      appState.isRecordingVoice = true;
      document.getElementById("voice-mic-btn").classList.add("recording");
      document.getElementById("voice-detecting-badge").classList.add("active");
      document.getElementById("voice-detecting-dot").style.backgroundColor = "var(--pink-accent)";
      document.getElementById("voice-detecting-label").innerText = "Mendengarkan...";
      document.getElementById("voice-recognition-transcript").innerText = "Sedang mendengarkan suara Anda...";
      document.getElementById("voice-soundwave-bar").classList.add("active");
    };
    
    appState.voiceSpeechRecognizer.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      document.getElementById("voice-recognition-transcript").innerText = `"${speechToText}"`;
      processSpeechInput(speechToText);
    };
    
    appState.voiceSpeechRecognizer.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      document.getElementById("voice-recognition-transcript").innerText = "Maaf, suara kurang terdengar jelas. Ketuk ikon mic dan coba lagi.";
      stopVoiceSpeechRecognition();
    };
    
    appState.voiceSpeechRecognizer.onend = () => {
      stopVoiceSpeechRecognition();
    };
  } else {
    document.getElementById("voice-recognition-transcript").innerText = "Browser Anda tidak mendukung deteksi suara asli. Silakan ketik kata kunci di kolom pencarian di atas!";
  }

  // Populate dynamic UI elements
  renderAvatarThumbnails();
  renderDictionaryList();
  renderActiveTasksList();
  renderUnlockedAvatarShop();
  
  // Set default large avatar preview
  updateLargeAvatarPreview();
  updateHeaderUserDisplay();
  
  // Initialize Voice Canvas Avatar
  drawAvatarCanvas();
});

// PASSWORD VISIBILITY UTILITY
function togglePasswordVisibility(inputFieldId) {
  const passwordInput = document.getElementById(inputFieldId);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

// ROUTER SYSTEM
function switchView(viewId) {
  // Stop camera tracks if active
  if (appState.cameraActive) {
    stopCameraFeed();
  }
  if (appState.quizCameraActive) {
    stopQuizCameraFeed();
  }

  // Deactivate all sections
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });
  
  // Activate selected section
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
  }

  // Handle header nav tabs highlights
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.classList.remove("active");
  });
  const matchingTab = document.getElementById(`tab-${viewId}`);
  if (matchingTab) {
    matchingTab.classList.add("active");
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Trigger special view initializes
  if (viewId === "dashboard-view") {
    updateDashboardProgress();
  } else if (viewId === "sign-to-text-view") {
    loadCameraGesture(appState.dictionary.find(d => d.key === "terima-kasih"));
  } else if (viewId === "voice-to-sign-view") {
    drawAvatarCanvas();
  } else if (viewId === "tugas-view") {
    loadQuizChallenge();
  }
}

function navigateTo(viewId) {
  switchView(viewId);
}

// AUTH LOGIC
function authLogin() {
  const username = document.getElementById("login-username").value.trim();
  if (username) {
    appState.user.username = username;
    appState.user.nickname = username;
    updateHeaderUserDisplay();
    switchView("role-view");
  }
}

function authRegister() {
  const username = document.getElementById("reg-username").value.trim();
  if (username) {
    appState.user.username = username;
    appState.user.nickname = username;
    updateHeaderUserDisplay();
    switchView("role-view");
  }
}

function selectRole(role, element) {
  appState.user.role = role;
  
  // Handle styling active states
  document.querySelectorAll(".role-card").forEach(c => {
    c.classList.remove("active");
  });
  element.classList.add("active");
}

function proceedFromRole() {
  // If Student, proceed to Avatar Select, else go directly to Dashboard
  if (appState.user.role === "student") {
    switchView("avatar-view");
  } else {
    // Teacher Role Dashboard updates
    document.getElementById("main-app-header").style.display = "flex";
    appState.user.role = "Guru";
    updateHeaderUserDisplay();
    switchView("dashboard-view");
  }
}

// AVATAR PICKER
function renderAvatarThumbnails() {
  const listContainer = document.getElementById("avatar-thumb-list");
  listContainer.innerHTML = "";
  
  Object.keys(avatars).forEach(key => {
    // Only show Timi, Kiko, Lulu as starter picker
    if (key === "koko_hat") return;

    const av = avatars[key];
    const isUnlocked = appState.unlockedAvatars.includes(key);
    
    const thumb = document.createElement("div");
    thumb.className = `avatar-thumbnail ${appState.user.avatarId === key ? "active" : ""}`;
    thumb.onclick = () => selectAvatar(key);
    
    // Draw lock if locked
    if (!isUnlocked) {
      thumb.style.opacity = "0.5";
      thumb.innerHTML = `<div style="position: absolute; font-size: 16px;">🔒</div>${av.svg}`;
    } else {
      thumb.innerHTML = av.svg;
    }
    
    listContainer.appendChild(thumb);
  });
}

function selectAvatar(avatarId) {
  // Check unlock
  const isUnlocked = appState.unlockedAvatars.includes(avatarId);
  if (!isUnlocked) {
    const cost = avatars[avatarId].starsNeeded;
    alert(`Avatar locked! Selesaikan kuis untuk mengumpulkan ${cost} bintang.`);
    return;
  }

  appState.user.avatarId = avatarId;
  
  // Update thumb styles
  document.querySelectorAll(".avatar-thumbnail").forEach(t => t.classList.remove("active"));
  renderAvatarThumbnails();
  updateLargeAvatarPreview();
}

function updateLargeAvatarPreview() {
  const preview = document.getElementById("avatar-large-preview");
  const av = avatars[appState.user.avatarId];
  if (preview && av) {
    preview.innerHTML = av.svg;
  }
}

function selectGender(gender, element) {
  appState.user.gender = gender;
  document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
  element.classList.add("active");
}

function proceedFromAvatar() {
  const name = document.getElementById("avatar-nickname").value.trim();
  if (name) {
    appState.user.nickname = name;
    appState.user.username = name;
  }
  
  // Show Main Navigation Header
  document.getElementById("main-app-header").style.display = "flex";
  updateHeaderUserDisplay();
  
  // Navigate to Dashboard
  switchView("dashboard-view");
  
  // Trigger welcome confetti
  triggerConfettiExplosion();
}

function updateHeaderUserDisplay() {
  document.getElementById("header-user-name").innerText = appState.user.nickname;
  document.getElementById("header-user-role").innerText = `${appState.user.username} (${appState.user.role === "student" ? "Murid" : "Guru"})`;
  
  const headerAvatarBox = document.getElementById("header-user-avatar");
  const av = avatars[appState.user.avatarId];
  if (headerAvatarBox && av) {
    headerAvatarBox.innerHTML = av.svg;
  }
}

function updateDashboardProgress() {
  const bar = document.getElementById("daily-progress-bar");
  const percentText = document.getElementById("daily-progress-percent");
  const footerLabel = document.getElementById("daily-progress-label");
  
  const percent = Math.min(Math.floor((appState.user.quizCount / 3) * 100), 100);
  
  if (bar) bar.style.width = `${percent}%`;
  if (percentText) percentText.innerText = `${percent}%`;
  if (footerLabel) footerLabel.innerText = `${appState.user.quizCount}/3 Kuis Selesai`;
}

// DICTIONARY SEARCH ENGINE
function renderDictionaryList() {
  const sentencesGrid = document.getElementById("dict-sentences-grid");
  const wordsGrid = document.getElementById("dict-words-grid");
  
  sentencesGrid.innerHTML = "";
  wordsGrid.innerHTML = "";
  
  appState.dictionary.forEach(item => {
    // Filter matching active filter variables
    const matchesSearch = item.word.toLowerCase().includes(document.getElementById("dictionary-search").value.toLowerCase());
    const matchesType = appState.activeDictFilter.type === "all" || item.category === appState.activeDictFilter.type;
    
    let matchesStatus = true;
    if (appState.activeDictFilter.status === "learned") {
      matchesStatus = item.learned === true;
    } else if (appState.activeDictFilter.status === "unlearned") {
      matchesStatus = item.learned === false;
    }
    
    if (matchesSearch && matchesType && matchesStatus) {
      if (item.category === "kalimat") {
        const card = document.createElement("div");
        card.className = "sentence-card";
        card.onclick = () => loadCameraGesture(item);
        card.innerHTML = `
          <div class="sentence-text">"${item.word}"</div>
          <div class="card-badges-row">
            <span class="badge ${item.learned ? "pink" : "purple"}">${item.learned ? "Sudah" : "Belum"} Dipelajari</span>
            <span class="badge cyan">Kalimat</span>
          </div>
        `;
        sentencesGrid.appendChild(card);
      } else {
        const card = document.createElement("div");
        card.className = "word-card";
        card.onclick = () => loadCameraGesture(item);
        card.innerHTML = `
          <div class="word-icon-circle ${item.learned ? "pink" : "yellow"}">${item.icon}</div>
          <div class="word-text">${item.word}</div>
          <div class="card-badges-row">
            <span class="badge ${item.learned ? "pink" : "purple"}">${item.learned ? "Sudah" : "Belum"}</span>
            <span class="badge orange">Kata</span>
          </div>
        `;
        wordsGrid.appendChild(card);
      }
    }
  });
  
  // Show / Hide sections based on kids grids populations
  document.getElementById("dict-sentences-section").style.display = sentencesGrid.children.length > 0 ? "block" : "none";
  document.getElementById("dict-words-section").style.display = wordsGrid.children.length > 0 ? "block" : "none";
}

function filterDictionary() {
  renderDictionaryList();
}

function setDictFilter(filterGroup, filterValue, buttonElement) {
  // Update state values
  if (filterGroup === "type") {
    appState.activeDictFilter.type = filterValue;
  } else {
    // toggle off if clicked again
    if (appState.activeDictFilter.status === filterValue) {
      appState.activeDictFilter.status = "all";
      buttonElement.classList.remove("active");
      renderDictionaryList();
      return;
    }
    appState.activeDictFilter.status = filterValue;
  }
  
  // Manage active classes
  buttonElement.parentElement.querySelectorAll(".filter-pill").forEach(b => {
    b.classList.remove("active");
  });
  buttonElement.classList.add("active");
  
  renderDictionaryList();
}

// REAL WEBCAM LANDMARK CANVAS SIMULATOR
function loadCameraGesture(dictItem) {
  navigateTo("sign-to-text-view");
  document.getElementById("cam-gesture-title").innerText = dictItem.word;
  document.getElementById("cam-gesture-desc").innerText = dictItem.description;
  
  // Draw custom dynamic SIBI vector drawing illustrations of the active word
  const illustrationContainer = document.getElementById("cam-gesture-illustration");
  illustrationContainer.innerHTML = drawDynamicGestureVector(dictItem.clip);
  
  // Setup Username Tag
  document.getElementById("cam-username-badge").innerText = appState.user.nickname;
}

function drawDynamicGestureVector(clipName) {
  let paths = "";
  if (clipName === "makan") {
    paths = `<!-- Head -->
      <circle cx="50" cy="30" r="14" fill="#FFE0B2"/>
      <path d="M38,30 C38,18 62,18 62,30" fill="#4E342E"/>
      <!-- Body -->
      <path d="M30,70 C30,55 70,55 70,70 L70,95 L30,95 Z" fill="#5C6BC0"/>
      <!-- Hand Gesture: Hand bringing food to mouth -->
      <path d="M50,75 L62,50 L52,38" fill="none" stroke="#FFE0B2" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="52" cy="38" r="6" fill="#FFE0B2"/>
      <path d="M48,38 L45,35" stroke="#E65100" stroke-width="2"/>`;
  } else if (clipName === "terima-kasih") {
    paths = `<!-- Head -->
      <circle cx="50" cy="30" r="14" fill="#FFE0B2"/>
      <path d="M38,30 C38,18 62,18 62,30" fill="#4E342E"/>
      <!-- Body -->
      <path d="M30,70 C30,55 70,55 70,70 L70,95 L30,95 Z" fill="#D81B60"/>
      <!-- Hand Gesture: Hand placing on chin then bowing out -->
      <path d="M50,75 L65,58 L52,32" fill="none" stroke="#FFE0B2" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="52" cy="32" r="6" fill="#FFE0B2"/>
      <path d="M52,32 L58,26" stroke="#4E342E" stroke-width="2" stroke-linecap="round"/>`;
  } else {
    // Default Hello / Sapa isyarat
    paths = `<!-- Head -->
      <circle cx="50" cy="30" r="14" fill="#FFE0B2"/>
      <path d="M38,30 C38,18 62,18 62,30" fill="#4E342E"/>
      <!-- Body -->
      <path d="M30,70 C30,55 70,55 70,70 L70,95 L30,95 Z" fill="#0284C7"/>
      <!-- Hand waving -->
      <path d="M30,75 L20,55 L16,40" fill="none" stroke="#FFE0B2" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="16" cy="40" r="6" fill="#FFE0B2"/>`;
  }
  
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" fill="#FFFDF5" rx="15"/>
    ${paths}
  </svg>`;
}

async function toggleCameraFeed() {
  const video = document.getElementById("camera-stream");
  const btn = document.getElementById("camera-toggle-action");
  
  if (appState.cameraActive) {
    stopCameraFeed();
    btn.style.backgroundColor = "var(--pink-accent)";
    btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      video.srcObject = stream;
      appState.activeCameraStream = stream;
      appState.cameraActive = true;
      
      btn.style.backgroundColor = "var(--primary-blue)";
      btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`;
      
      // Start real-time MediaPipe overlay coordinates simulator on canvas
      startCameraLandmarkSimulation("camera-overlay", false);
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.");
    }
  }
}

function stopCameraFeed() {
  const video = document.getElementById("camera-stream");
  if (appState.activeCameraStream) {
    appState.activeCameraStream.getTracks().forEach(track => track.stop());
    appState.activeCameraStream = null;
  }
  if (video) video.srcObject = null;
  appState.cameraActive = false;
  
  // Stop simulation loop
  if (appState.cameraAnimationId) {
    cancelAnimationFrame(appState.cameraAnimationId);
    appState.cameraAnimationId = null;
  }
  
  // Clear Canvas
  const canvas = document.getElementById("camera-overlay");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  document.getElementById("cam-status-dot").style.backgroundColor = "var(--pink-accent)";
  document.getElementById("cam-status-text").innerText = "Status: Kamera Mati";
  document.getElementById("cam-metrics-text").innerText = "Akurasi: -- | Conf: --";
}

// MEDIA-PIPE HOLISTIC JOINT SCANNING CANVAS SIMULATION
function startCameraLandmarkSimulation(canvasId, isQuizMode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Match canvas dimensions to container
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  
  let frameCount = 0;
  
  // Coordinates generated as random moving organic skeletons
  const points = {
    nose: { x: canvas.width / 2, y: canvas.height * 0.3 },
    leftEye: { x: canvas.width / 2 - 25, y: canvas.height * 0.28 },
    rightEye: { x: canvas.width / 2 + 25, y: canvas.height * 0.28 },
    leftShoulder: { x: canvas.width / 2 - 90, y: canvas.height * 0.5 },
    rightShoulder: { x: canvas.width / 2 + 90, y: canvas.height * 0.5 },
    leftElbow: { x: canvas.width / 2 - 140, y: canvas.height * 0.65 },
    rightElbow: { x: canvas.width / 2 + 140, y: canvas.height * 0.65 },
    leftWrist: { x: canvas.width / 2 - 80, y: canvas.height * 0.6 },
    rightWrist: { x: canvas.width / 2 + 80, y: canvas.height * 0.6 },
  };

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;
    
    // Add organic wave drift matching user hand/body movements
    const driftX = Math.sin(frameCount * 0.05) * 8;
    const driftY = Math.cos(frameCount * 0.07) * 5;
    
    // Make hands move like they are gesturing SIBI
    const gestureOffsetLeftX = Math.sin(frameCount * 0.1) * 35;
    const gestureOffsetLeftY = Math.cos(frameCount * 0.1) * 20;
    
    // Render face skeleton
    ctx.strokeStyle = "#22D3EE";
    ctx.lineWidth = 2.5;
    
    // Head shape
    ctx.beginPath();
    ctx.arc(points.nose.x + driftX, points.nose.y + driftY, 45, 0, Math.PI * 2);
    ctx.stroke();
    
    // Joint dots
    ctx.fillStyle = "#FF4D9D";
    [points.leftEye, points.rightEye].forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x + driftX, pt.y + driftY, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Shoulders & Body bones
    ctx.strokeStyle = "#34D399"; // green skeleton bones
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points.leftShoulder.x + driftX, points.leftShoulder.y + driftY);
    ctx.lineTo(points.rightShoulder.x + driftX, points.rightShoulder.y + driftY);
    ctx.stroke();
    
    // Left Arm
    ctx.beginPath();
    ctx.moveTo(points.leftShoulder.x + driftX, points.leftShoulder.y + driftY);
    ctx.lineTo(points.leftElbow.x + driftX, points.leftElbow.y + driftY);
    ctx.lineTo(points.leftWrist.x + gestureOffsetLeftX, points.leftWrist.y + gestureOffsetLeftY);
    ctx.stroke();
    
    // Right Arm
    ctx.beginPath();
    ctx.moveTo(points.rightShoulder.x + driftX, points.rightShoulder.y + driftY);
    ctx.lineTo(points.rightElbow.x + driftX, points.rightElbow.y + driftY);
    ctx.lineTo(points.rightWrist.x + driftX, points.rightWrist.y + driftY);
    ctx.stroke();
    
    // Render hand mesh keypoints details (MediaPipe Hand Landmarks mesh)
    drawHandMesh(ctx, points.leftWrist.x + gestureOffsetLeftX, points.leftWrist.y + gestureOffsetLeftY, frameCount);
    drawHandMesh(ctx, points.rightWrist.x + driftX, points.rightWrist.y + driftY, frameCount);
    
    // Update live indicators
    if (frameCount % 30 === 0) {
      const liveAcc = Math.floor(60 + Math.sin(frameCount) * 15);
      const liveConf = (0.7 + Math.sin(frameCount) * 0.15).toFixed(2);
      
      if (isQuizMode) {
        appState.quizAcc = liveAcc;
        document.getElementById("quiz-acc-label").innerText = `${liveAcc}%`;
      } else {
        document.getElementById("cam-status-dot").style.backgroundColor = "#34D399";
        document.getElementById("cam-status-text").innerText = "Status: Mendeteksi...";
        document.getElementById("cam-metrics-text").innerText = `Akurasi: ${liveAcc}% | Conf: ${liveConf}`;
      }
    }
    
    if (isQuizMode && appState.quizCameraActive) {
      appState.quizCameraAnimationId = requestAnimationFrame(drawFrame);
    } else if (!isQuizMode && appState.cameraActive) {
      appState.cameraAnimationId = requestAnimationFrame(drawFrame);
    }
  }
  
  drawFrame();
}

function drawHandMesh(ctx, wristX, wristY, tick) {
  // Generate 5 fingers
  ctx.fillStyle = "#FFD60A";
  ctx.strokeStyle = "#FF8A00";
  ctx.lineWidth = 1.5;
  
  for (let f = 0; f < 5; f++) {
    const angle = -Math.PI / 2 + (f - 2) * 0.25;
    ctx.beginPath();
    ctx.moveTo(wristX, wristY);
    
    let curX = wristX;
    let curY = wristY;
    
    // 3 joints per finger
    for (let j = 0; j < 3; j++) {
      const len = 15;
      curX += Math.cos(angle + Math.sin(tick * 0.05 + f) * 0.05) * len;
      curY += Math.sin(angle + Math.sin(tick * 0.05 + f) * 0.05) * len;
      
      ctx.lineTo(curX, curY);
      ctx.arc(curX, curY, 3, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
  
  // Wrist dot
  ctx.fillStyle = "#FF4D9D";
  ctx.beginPath();
  ctx.arc(wristX, wristY, 6, 0, Math.PI * 2);
  ctx.fill();
}

// SPEECH RECOGNITION AND DYNAMIC 2D CANVAS AVATAR ANIMATOR
function toggleVoiceSpeechRecognition() {
  if (appState.isRecordingVoice) {
    stopVoiceSpeechRecognition();
  } else {
    if (appState.voiceSpeechRecognizer) {
      appState.voiceSpeechRecognizer.start();
    } else {
      alert("Deteksi suara tidak didukung pada browser ini.");
    }
  }
}

function stopVoiceSpeechRecognition() {
  if (appState.voiceSpeechRecognizer && appState.isRecordingVoice) {
    appState.voiceSpeechRecognizer.stop();
  }
  appState.isRecordingVoice = false;
  document.getElementById("voice-mic-btn").classList.remove("recording");
  document.getElementById("voice-detecting-badge").classList.remove("active");
  document.getElementById("voice-detecting-dot").style.backgroundColor = "var(--primary-blue)";
  document.getElementById("voice-detecting-label").innerText = "Siap Menerima";
  document.getElementById("voice-soundwave-bar").classList.remove("active");
}

function handleVoiceTextKeydown(event) {
  if (event.key === "Enter") {
    const txt = event.target.value.trim();
    if (txt) {
      document.getElementById("voice-recognition-transcript").innerText = `"${txt}"`;
      processSpeechInput(txt);
      event.target.value = "";
    }
  }
}

function processSpeechInput(text) {
  const cleanTxt = text.toLowerCase();
  
  // Fuzzy match against our dictionary
  let matchedItem = null;
  let bestScore = 0;
  
  appState.dictionary.forEach(item => {
    // simple includes score for demo resilience
    if (cleanTxt.includes(item.word.toLowerCase()) || item.word.toLowerCase().includes(cleanTxt)) {
      matchedItem = item;
    }
  });
  
  if (matchedItem) {
    // Correct word found! Play SIBI animation on tutor model
    document.getElementById("voice-detecting-label").innerText = "Mendeteksi: " + matchedItem.word;
    triggerAvatarSpeechGesture(matchedItem.clip);
  } else {
    // Maaf, kurang jelas (confidence < 70%) - trigger scratch head anim
    document.getElementById("voice-detecting-label").innerText = "Gagal Mengartikan";
    document.getElementById("voice-recognition-transcript").innerText = `Maaf, kata kunci untuk "${text}" belum tersedia. Coba ucapkan "Makan", "Minum", "Tolong", atau "Terima Kasih".`;
    triggerAvatarSpeechGesture("scratch_head");
  }
}

function triggerAvatarSpeechGesture(clipName) {
  appState.activeSpeechGestureWord = clipName;
  appState.avatarGestureFrame = 0;
  
  if (appState.avatarGestureTimer) {
    clearInterval(appState.avatarGestureTimer);
  }
  
  // Soundwave and duration timer starts
  document.getElementById("voice-soundwave-bar").classList.add("active");
  let sec = 0;
  const timer = document.getElementById("voice-duration-timer");
  timer.innerText = "00:00";
  
  const audioInterval = setInterval(() => {
    sec++;
    timer.innerText = `00:${sec < 10 ? '0' + sec : sec}`;
    if (sec >= 3) {
      clearInterval(audioInterval);
      timer.innerText = "00:03";
    }
  }, 1000);
  
  appState.avatarGestureTimer = setInterval(() => {
    appState.avatarGestureFrame++;
    drawAvatarCanvas();
    
    // Stop after 90 ticks (3 seconds)
    if (appState.avatarGestureFrame >= 90) {
      clearInterval(appState.avatarGestureTimer);
      appState.avatarGestureTimer = null;
      appState.activeSpeechGestureWord = null;
      document.getElementById("voice-soundwave-bar").classList.remove("active");
      drawAvatarCanvas(); // back to idle
    }
  }, 33); // 30 FPS
}

function replayAvatarSpeechGesture() {
  if (appState.activeSpeechGestureWord) {
    triggerAvatarSpeechGesture(appState.activeSpeechGestureWord);
  } else {
    // Wave hello if empty
    triggerAvatarSpeechGesture("halo");
  }
}

// 2D CANVAS AVATAR DRAWER (Adheres to premium Zain & Nunito styling)
function drawAvatarCanvas() {
  const canvas = document.getElementById("avatar-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  
  const midX = canvas.width / 2;
  const midY = canvas.height / 2;
  
  // Get active avatar characteristics
  const av = avatars[appState.user.avatarId] || avatars.timi;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw premium gradient background
  const grad = ctx.createRadialGradient(midX, midY, 10, midX, midY, canvas.width / 1.5);
  grad.addColorStop(0, "#FFFFFF");
  grad.addColorStop(1, "#E2E8F0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Animation metrics
  const frame = appState.avatarGestureFrame;
  const clip = appState.activeSpeechGestureWord;
  
  // Idle breathing variables
  let breatheY = Math.sin(Date.now() * 0.003) * 3;
  let handOffsetLeftY = 0;
  let handOffsetRightY = 0;
  let handOffsetLeftX = 0;
  let handOffsetRightX = 0;
  let isScratching = false;
  let expression = "happy";
  
  // CALCULATE KEYFRAME ANIMATIONS MATHEMATICALLY
  if (clip === "makan") {
    // Right hand moves to mouth and back 3 times
    const cycle = (frame % 30) / 30; // 0 to 1
    const pull = Math.sin(cycle * Math.PI); // 0 -> 1 -> 0
    handOffsetRightX = -50 * pull;
    handOffsetRightY = -70 * pull - 30;
    expression = pull > 0.5 ? "chewing" : "happy";
  } else if (clip === "terima-kasih") {
    // Right hand starts near chest/dagu then moves down and bow out
    if (frame < 45) {
      const pull = Math.sin((frame / 45) * Math.PI / 2); // 0 -> 1
      handOffsetRightX = -30 * pull;
      handOffsetRightY = -80 * pull;
    } else {
      const pull = Math.cos(((frame - 45) / 45) * Math.PI / 2); // 1 -> 0
      handOffsetRightX = -30 * pull + 40 * (1 - pull);
      handOffsetRightY = -80 * pull + 10 * (1 - pull);
    }
    expression = "thankful";
  } else if (clip === "tolong") {
    // Both hands clasped in center moving up and down gently
    const pull = Math.sin((frame / 90) * Math.PI * 3);
    handOffsetLeftX = 35;
    handOffsetRightX = -35;
    handOffsetLeftY = -40 + pull * 10;
    handOffsetRightY = -40 + pull * 10;
    expression = "please";
  } else if (clip === "belajar") {
    // Right finger tapping left hand
    const tap = Math.sin(frame * 0.5) > 0 ? 1 : 0;
    handOffsetLeftX = 30;
    handOffsetLeftY = -25;
    handOffsetRightX = -25;
    handOffsetRightY = -28 - tap * 12;
    expression = "focused";
  } else if (clip === "scratch_head") {
    // Right hand scratches head, body shakes slightly
    isScratching = true;
    breatheY += Math.sin(frame * 0.5) * 2;
    handOffsetRightX = -15 + Math.sin(frame * 0.8) * 8;
    handOffsetRightY = -120;
    expression = "confused";
  } else if (clip === "halo" || (!clip && frame === 0)) {
    // Idle hello waving
    if (clip === "halo") {
      const wave = Math.sin(frame * 0.4) * 15;
      handOffsetLeftX = -45;
      handOffsetLeftY = -70 + wave;
    }
  }

  // Draw Avatar Body
  ctx.fillStyle = av.color;
  
  // Shoulders & Body
  ctx.beginPath();
  ctx.ellipse(midX, midY + 120 + breatheY, 70, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.beginPath();
  ctx.arc(midX, midY - 20 + breatheY, 52, 0, Math.PI * 2);
  ctx.fill();
  
  // Head features: Ears based on Character
  if (appState.user.avatarId === "timi") {
    // Cat ears
    ctx.fillStyle = "#6D28D9";
    ctx.beginPath();
    ctx.moveTo(midX - 45, midY - 45 + breatheY);
    ctx.lineTo(midX - 45, midY - 80 + breatheY);
    ctx.lineTo(midX - 15, midY - 50 + breatheY);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(midX + 45, midY - 45 + breatheY);
    ctx.lineTo(midX + 45, midY - 80 + breatheY);
    ctx.lineTo(midX + 15, midY - 50 + breatheY);
    ctx.fill();
  } else if (appState.user.avatarId === "kiko") {
    // Rabbit long ears
    ctx.fillStyle = "#0EA5E9";
    ctx.beginPath();
    ctx.ellipse(midX - 20, midY - 85 + breatheY, 10, 32, -0.08, 0, Math.PI * 2);
    ctx.ellipse(midX + 20, midY - 85 + breatheY, 10, 32, 0.08, 0, Math.PI * 2);
    ctx.fill();
    // Inner Pink
    ctx.fillStyle = "#FF4D9D";
    ctx.beginPath();
    ctx.ellipse(midX - 20, midY - 82 + breatheY, 5, 23, -0.08, 0, Math.PI * 2);
    ctx.ellipse(midX + 20, midY - 82 + breatheY, 5, 23, 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else if (appState.user.avatarId === "lulu") {
    // Bear round ears
    ctx.fillStyle = "#D97706";
    ctx.beginPath();
    ctx.arc(midX - 42, midY - 60 + breatheY, 16, 0, Math.PI * 2);
    ctx.arc(midX + 42, midY - 60 + breatheY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFD60A";
    ctx.beginPath();
    ctx.arc(midX - 42, midY - 60 + breatheY, 9, 0, Math.PI * 2);
    ctx.arc(midX + 42, midY - 60 + breatheY, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Face details
  ctx.fillStyle = "#FFE0B2"; // soft face skin overlay
  ctx.beginPath();
  ctx.arc(midX, midY - 14 + breatheY, 40, 0, Math.PI * 2);
  ctx.fill();
  
  // EYES
  ctx.fillStyle = "#1E293B";
  if (expression === "thankful") {
    // Cute curved arches for smiling eyes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1E293B";
    ctx.beginPath();
    ctx.arc(midX - 16, midY - 18 + breatheY, 6, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(midX + 16, midY - 18 + breatheY, 6, Math.PI, 0);
    ctx.stroke();
  } else if (expression === "confused") {
    // Confused unequal sizes
    ctx.beginPath();
    ctx.arc(midX - 16, midY - 16 + breatheY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(midX + 16, midY - 14 + breatheY, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Standard happy glowing eyes with pupils
    ctx.beginPath();
    ctx.arc(midX - 16, midY - 16 + breatheY, 6, 0, Math.PI * 2);
    ctx.arc(midX + 16, midY - 16 + breatheY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(midX - 14, midY - 18 + breatheY, 2, 0, Math.PI * 2);
    ctx.arc(midX + 18, midY - 18 + breatheY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // NOSE & MOUTH
  ctx.fillStyle = "#FF4D9D";
  ctx.beginPath();
  ctx.arc(midX, midY - 6 + breatheY, 3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  
  ctx.beginPath();
  if (expression === "chewing") {
    // simple oval for chewing
    ctx.strokeRect(midX - 4, midY + 4 + breatheY, 8, 4);
  } else if (expression === "thankful" || expression === "happy") {
    // happy wide curve
    ctx.arc(midX, midY + breatheY, 6, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } else {
    // small surprise curve
    ctx.arc(midX, midY + 2 + breatheY, 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rosy cheeks
  ctx.fillStyle = "#FF4D9D";
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(midX - 26, midY - 4 + breatheY, 6, 0, Math.PI * 2);
  ctx.arc(midX + 26, midY - 4 + breatheY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // HANDS & ARMS KEYFRAME DRAW
  ctx.fillStyle = av.color;
  ctx.strokeStyle = av.color;
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  // Left Hand default / wave
  ctx.beginPath();
  ctx.moveTo(midX - 60, midY + 110 + breatheY);
  ctx.lineTo(midX - 90 + handOffsetLeftX, midY + 80 + handOffsetLeftY + breatheY);
  ctx.stroke();
  
  ctx.fillStyle = "#FFE0B2";
  ctx.beginPath();
  ctx.arc(midX - 90 + handOffsetLeftX, midY + 80 + handOffsetLeftY + breatheY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Right Hand default / wave / sign SIBI
  ctx.strokeStyle = av.color;
  ctx.beginPath();
  ctx.moveTo(midX + 60, midY + 110 + breatheY);
  ctx.lineTo(midX + 90 + handOffsetRightX, midY + 80 + handOffsetRightY + breatheY);
  ctx.stroke();
  
  ctx.fillStyle = "#FFE0B2";
  ctx.beginPath();
  ctx.arc(midX + 90 + handOffsetRightX, midY + 80 + handOffsetRightY + breatheY, 10, 0, Math.PI * 2);
  ctx.fill();
}

// GAMIFIED TASKS & QUIZZES PORTAL (Section 8)
function renderActiveTasksList() {
  const container = document.getElementById("active-tasks-list");
  container.innerHTML = "";
  
  const tasks = [
    { key: "kata-dasar", title: "Kata Dasar SIBI", count: "10 Kuis", status: "Selesai" },
    { key: "kata-santun", title: "Kata Santun Terpandu", count: "5 Kuis", status: "Sedang Berjalan", active: true },
    { key: "anggota-keluarga", title: "Anggota Keluarga", count: "8 Kuis", status: "Terkunci" }
  ];
  
  tasks.forEach(t => {
    const item = document.createElement("div");
    item.className = `tugas-item ${t.active ? "active" : ""}`;
    item.onclick = () => {
      if (t.status === "Terkunci") {
        alert("Tugas terkunci! Selesaikan kuis 'Kata Santun Terpandu' terlebih dahulu.");
        return;
      }
      alert(`Memulai kuis ${t.title}`);
    };
    
    let labelColor = "var(--text-muted)";
    if (t.status === "Selesai") labelColor = "var(--pink-accent)";
    if (t.status === "Sedang Berjalan") labelColor = "var(--primary-blue)";
    
    item.innerHTML = `
      <div>
        <div class="tugas-item-name">${t.title}</div>
        <div class="tugas-item-meta">${t.count} • Pre-syarat: SIBI</div>
      </div>
      <div style="font-weight: 800; font-size: var(--font-body-3); color: ${labelColor};">${t.status}</div>
    `;
    container.appendChild(item);
  });
}

function renderUnlockedAvatarShop() {
  const grid = document.getElementById("avatar-unlocks-grid");
  grid.innerHTML = "";
  
  Object.keys(avatars).forEach(key => {
    const av = avatars[key];
    const isUnlocked = appState.unlockedAvatars.includes(key);
    
    const box = document.createElement("div");
    box.className = `achievement-trophy-box ${isUnlocked ? "unlocked" : ""}`;
    
    box.innerHTML = `
      <div class="achievement-icon">${av.emoji}</div>
      <div class="achievement-name">${av.name}</div>
      <div style="font-size: 9px; font-weight: 700; color: var(--text-muted); margin-top: 4px;">
        ${isUnlocked ? "Unlocked" : `${av.starsNeeded} 🌟`}
      </div>
    `;
    grid.appendChild(box);
  });
}

async function loadQuizChallenge() {
  const item = appState.quizRounds[appState.currentQuizIndex];
  appState.activeQuizItem = item;
  
  document.getElementById("quiz-current-word").innerText = item.word;
  document.getElementById("quiz-rounds-badge").innerText = `SOAL ${appState.currentQuizIndex + 1} DARI ${appState.quizRounds.length}`;
  document.getElementById("quiz-acc-label").innerText = "--%";
  
  // reset stars
  document.getElementById("quiz-star-1").classList.remove("earned");
  document.getElementById("quiz-star-2").classList.remove("earned");
  document.getElementById("quiz-star-3").classList.remove("earned");
  
  document.getElementById("quiz-next-btn").disabled = true;

  // Toggle quiz stream camera
  const video = document.getElementById("quiz-camera-stream");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    video.srcObject = stream;
    appState.activeQuizCameraStream = stream;
    appState.quizCameraActive = true;
    startCameraLandmarkSimulation("quiz-camera-overlay", true);
  } catch (err) {
    console.error("Quiz camera failed:", err);
  }
}

function runQuizCheck() {
  if (!appState.quizCameraActive) {
    alert("Nyalakan deteksi AI dengan menempatkan wajah di kamera.");
    return;
  }
  
  // Simulate AI evaluation pipeline result
  const acc = appState.quizAcc || Math.floor(75 + Math.random() * 20);
  appState.quizAcc = acc;
  
  document.getElementById("quiz-acc-label").innerText = `${acc}%`;
  
  // Award stars based on Gold Standard threshold (Section 8.2)
  let stars = 1;
  if (acc >= 85) {
    stars = 3;
    document.getElementById("quiz-star-1").classList.add("earned");
    document.getElementById("quiz-star-2").classList.add("earned");
    document.getElementById("quiz-star-3").classList.add("earned");
    
    // Confetti celebration
    triggerConfettiExplosion();
  } else if (acc >= 70) {
    stars = 2;
    document.getElementById("quiz-star-1").classList.add("earned");
    document.getElementById("quiz-star-2").classList.add("earned");
  } else {
    stars = 1;
    document.getElementById("quiz-star-1").classList.add("earned");
  }
  
  appState.quizStarsEarned += stars;
  document.getElementById("quiz-next-btn").disabled = false;
}

function quizNextRound() {
  // Stop active quiz camera
  stopQuizCameraFeed();
  
  appState.currentQuizIndex++;
  if (appState.currentQuizIndex < appState.quizRounds.length) {
    loadQuizChallenge();
  } else {
    // Quiz completed! Save history and unlock rewards
    alert(`Selamat! Anda menyelesaikan tugas dengan ${appState.quizStarsEarned} Bintang.`);
    
    // Add stars to wallet
    appState.user.stars += appState.quizStarsEarned;
    appState.user.quizCount++;
    if (appState.user.quizCount > 3) appState.user.quizCount = 3;
    
    // Check avatar unlocks
    checkNewAchievementsUnlocked();
    
    // Back to dashboard
    appState.currentQuizIndex = 0;
    appState.quizStarsEarned = 0;
    
    updateDashboardProgress();
    renderUnlockedAvatarShop();
    renderAvatarThumbnails();
    
    switchView("dashboard-view");
  }
}

function stopQuizCameraFeed() {
  const video = document.getElementById("quiz-camera-stream");
  if (appState.activeQuizCameraStream) {
    appState.activeQuizCameraStream.getTracks().forEach(track => track.stop());
    appState.activeQuizCameraStream = null;
  }
  if (video) video.srcObject = null;
  appState.quizCameraActive = false;
  
  if (appState.quizCameraAnimationId) {
    cancelAnimationFrame(appState.quizCameraAnimationId);
    appState.quizCameraAnimationId = null;
  }
  
  const canvas = document.getElementById("quiz-camera-overlay");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function checkNewAchievementsUnlocked() {
  Object.keys(avatars).forEach(key => {
    const av = avatars[key];
    if (key === "timi") return;
    
    if (appState.user.stars >= av.starsNeeded && !appState.unlockedAvatars.includes(key)) {
      appState.unlockedAvatars.push(key);
      alert(`🎉 Keren! Anda berhasil membuka kunci karakter "${av.name}"!`);
    }
  });
}

// DYNAMIC CONFETTI ENGINE (Pure HTML5 Canvas particles)
function triggerConfettiExplosion() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colorsList = ["#2563FF", "#22D3EE", "#FFD60A", "#FF8A00", "#FF4D9D", "#7C3AED"];
  
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 50,
      y: canvas.height / 2 + (Math.random() - 0.5) * 50,
      size: 6 + Math.random() * 8,
      color: colorsList[Math.floor(Math.random() * colorsList.length)],
      vx: (Math.random() - 0.5) * 15,
      vy: -10 - Math.random() * 15,
      gravity: 0.45,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }
  
  let ticks = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ticks++;
    
    let active = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      
      if (p.y < canvas.height) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    
    if (active && ticks < 180) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.display = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  animate();
}
