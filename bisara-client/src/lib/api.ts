import axios from 'axios';

/**
 * BISARA API & WebSocket Service Layer
 * 
 * Provides unified interface for REST endpoints (Auth, Progress, LMS Dashboard)
 * and real-time AI Sign Language Inference via WebSockets.
 * 
 * Automatically falls back to high-fidelity mock services when backend is offline.
 */

// Configurations via Vite environment variables
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export interface UserResponse {
  username: string;
  role: string;
  nickname: string;
  gender: string;
  avatarId: string;
  stars: number;
  progress: number;
}

export interface InferenceResult {
  gestureKey: string;
  accuracy: number;
  confidence: number;
  latencyMs: number;
  timestamp: string;
}

// ==================== REST API SERVICES ====================

export const ApiService = {
  /**
   * Helper to perform HTTP requests with automatic mock fallback
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      const response = await axios({
        url: `${API_BASE}${endpoint}`,
        method: (options.method || 'GET') as any,
        headers,
        data: options.body ? JSON.parse(options.body as string) : undefined,
      });

      return response.data as T;
    } catch (error) {
      console.warn(`[API] Server offline or request failed for ${endpoint}. Using offline mock storage.`);
      return this.mockHandler<T>(endpoint, options);
    }
  },

  /**
   * Offline mock fallback handlers utilizing localStorage
   */
  mockHandler<T>(endpoint: string, options: RequestInit): T {
    const body = options.body ? JSON.parse(options.body as string) : {};
    
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      const mockUser: UserResponse = {
        username: body.username || 'Anya',
        role: body.role || 'student',
        nickname: body.nickname || 'Anya',
        gender: body.gender || 'female',
        avatarId: body.avatarId || 'timi',
        stars: 38,
        progress: 38,
      };
      localStorage.setItem('bisara_user', JSON.stringify(mockUser));
      return mockUser as unknown as T;
    }

    if (endpoint.includes('/user/stars')) {
      const stored = localStorage.getItem('bisara_user');
      if (stored) {
        const parsed = JSON.parse(stored) as UserResponse;
        parsed.stars = body.stars || parsed.stars;
        localStorage.setItem('bisara_user', JSON.stringify(parsed));
        return parsed as unknown as T;
      }
    }

    if (endpoint.includes('/dictionary/search')) {
      const phrase = (body.phrase || '').toLowerCase();
      const vocabulary: Record<string, { word: string; clip: string }> = {
        'makan': { word: 'Makan', clip: 'makan' },
        'minum': { word: 'Minum', clip: 'minum' },
        'tolong': { word: 'Tolong', clip: 'tolong' },
        'terima kasih': { word: 'Terima Kasih', clip: 'terima-kasih' },
        'halo': { word: 'Halo', clip: 'halo' },
        'belajar': { word: 'Belajar', clip: 'belajar' },
        'rumah': { word: 'Rumah', clip: 'rumah' },
        'sekolah': { word: 'Sekolah', clip: 'sekolah' },
        'buku': { word: 'Buku', clip: 'buku' },
        'saya': { word: 'Saya', clip: 'saya' },
        'kamu': { word: 'Kamu', clip: 'kamu' },
        'guru': { word: 'Guru', clip: 'guru' }
      };

      let bestMatch: any = null;
      let highestScore = 0;

      Object.keys(vocabulary).forEach(key => {
        if (phrase.includes(key) || key.includes(phrase)) {
          const score = Math.min(key.length, phrase.length) / Math.max(key.length, phrase.length);
          if (score > highestScore) {
            highestScore = score;
            bestMatch = vocabulary[key];
          }
        }
      });

      if (highestScore >= 0.7 && bestMatch) {
        return { matched: true, word: bestMatch.word, clip: bestMatch.clip, confidence: highestScore } as unknown as T;
      } else {
        return { matched: false } as unknown as T;
      }
    }

    // Default empty mock objects
    return body as T;
  },

  /**
   * API endpoints
   */
  async login(username: string): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
  },

  async syncUserProgress(user: UserResponse): Promise<UserResponse> {
    return this.request<UserResponse>('/user/sync', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  async searchDictionary(phrase: string): Promise<{ matched: boolean; word?: string; clip?: string; confidence?: number }> {
    return this.request<{ matched: boolean; word?: string; clip?: string; confidence?: number }>('/dictionary/search', {
      method: 'POST',
      body: JSON.stringify({ phrase })
    });
  }
};


// ==================== REAL-TIME WEBSOCKET AI INFERENCE SERVICE ====================

export class InferenceSocketService {
  private socket: WebSocket | null = null;
  private onResultCallback: ((result: InferenceResult) => void) | null = null;
  private onStatusChangeCallback: ((status: string, latencyMs?: number) => void) | null = null;
  private reconnectInterval = 3000;
  private reconnectTimer: any = null;
  private active = false;
  private targetGestureKey: string;

  constructor(targetGestureKey: string) {
    this.targetGestureKey = targetGestureKey;
  }

  /**
   * Connect to AI inference server websocket endpoint
   */
  public connect() {
    this.active = true;
    const url = `${WS_BASE}/inference?gesture=${this.targetGestureKey}`;
    
    this.updateStatus('Mengkoneksikan AI...');

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.updateStatus('Mencari Aktor...', 12);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      };

      this.socket.onmessage = (event) => {
        try {
          const result = JSON.parse(event.data) as InferenceResult;
          if (this.onResultCallback) {
            this.onResultCallback(result);
          }
          this.updateStatus('Mendeteksi...', result.latencyMs);
        } catch (e) {
          console.error('[WS] Failed to parse inference result:', e);
        }
      };

      this.socket.onclose = () => {
        if (this.active) {
          this.updateStatus('Koneksi terputus. Menghubungkan kembali...');
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('[WS] Socket error:', error);
        this.socket?.close();
      };

    } catch (err) {
      console.error('[WS] Connection failed:', err);
      this.scheduleReconnect();
    }
  }

  /**
   * Stream a single canvas video frame to the AI server
   */
  public sendFrame(canvas: HTMLCanvasElement) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return; // Silently skip if socket is still connecting
    }

    // Convert canvas image to JPEG base64 to stream
    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    const base64Data = dataUrl.split(',')[1];

    const message = {
      image: base64Data,
      timestamp: new Date().toISOString()
    };

    this.socket.send(JSON.stringify(message));
  }

  /**
   * Stream hand joint landmarks coordinates instead of full pictures to reduce bandwidth
   */
  public sendJointLandmarks(landmarks: Array<{ x: number; y: number; z: number }>) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const message = {
      landmarks,
      timestamp: new Date().toISOString()
    };
    this.socket.send(JSON.stringify(message));
  }

  /**
   * Callbacks registers
   */
  public onResult(callback: (res: InferenceResult) => void) {
    this.onResultCallback = callback;
  }

  public onStatusChange(callback: (status: string, latency?: number) => void) {
    this.onStatusChangeCallback = callback;
  }

  /**
   * Disconnect socket cleanly
   */
  public disconnect() {
    this.active = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.updateStatus('Kamera Mati');
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.active) this.connect();
    }, this.reconnectInterval);
  }

  private updateStatus(status: string, latencyMs?: number) {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status, latencyMs);
    }
  }
}
