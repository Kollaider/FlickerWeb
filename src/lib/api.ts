import { z } from 'zod';

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// Zod schemas
export const ProfilePhoto = z.object({
  id: z.string(),
  url: z.string().url(),
  is_primary: z.boolean().default(false),
});

export const Location = z.object({
  lat: z.number(),
  lon: z.number(),
  city: z.string(),
});

export const Preferences = z.object({
  age_min: z.number().min(18).max(100),
  age_max: z.number().min(18).max(100),
  distance_km: z.number().min(1).max(500),
});

export const Profile = z.object({
  id: z.string(),
  name: z.string().min(1),
  age: z.number().min(18).max(100),
  bio: z.string().max(500).optional(),
  photos: z.array(ProfilePhoto).min(1),
  location: Location,
  tags: z.array(z.string()).max(20),
  looking_for: z.array(z.enum(['friendship', 'dating', 'long_term'])),
  preferences: Preferences,
});

export const Message = z.object({
  id: z.string(),
  chat_id: z.string(),
  from_user_id: z.string(),
  text: z.string().max(2000).optional(),
  image_url: z.string().url().optional(),
  created_at: z.string(),
  read: z.boolean().default(false),
});

export const Match = z.object({
  user: Profile,
  chat_id: z.string(),
  last_message: Message.optional(),
});

export type ProfileType = z.infer<typeof Profile>;
export type MessageType = z.infer<typeof Message>;
export type MatchType = z.infer<typeof Match>;

// API Response types
interface LoginResponse {
  access: string;
  user: ProfileType;
}

interface RegisterResponse {
  id: string;
  email: string;
}

interface SwipeResponse {
  match: boolean;
  chat_id?: string;
}

interface TelegramLinkResponse {
  bot_username: string;
  bind_token: string;
}

interface TelegramStatusResponse {
  linked: boolean;
  tg_username?: string;
}

// API Client with interceptors
class ApiClient {
  private accessToken: string | null = null;

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // For httpOnly cookies
      });

      if (response.status === 401 && this.accessToken) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
          return retryResponse.json();
        } else {
          // Redirect to login
          window.location.href = '/auth';
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.access);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  clearToken() {
    this.accessToken = null;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setAccessToken(response.access);
    return response;
  }

  async register(email: string, password: string, name: string) {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getMe() {
    return this.request<ProfileType>('/auth/me');
  }

  // Profile endpoints
  async getProfile() {
    return this.request<ProfileType>('/profiles/me');
  }

  async updateProfile(data: Partial<ProfileType>) {
    return this.request<ProfileType>('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Discover endpoints
  async getDiscoverProfiles(filters?: Record<string, unknown>) {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request<ProfileType[]>(`/discover?${params}`);
  }

  async swipe(toUserId: string, action: 'like' | 'pass') {
    return this.request<SwipeResponse>('/swipe', {
      method: 'POST',
      body: JSON.stringify({ to_user_id: toUserId, action }),
    });
  }

  // Matches and Chat endpoints
  async getMatches() {
    return this.request<MatchType[]>('/matches');
  }

  async getChatMessages(chatId: string, cursor?: string) {
    const params = cursor ? `?cursor=${cursor}` : '';
    return this.request<MessageType[]>(`/chats/${chatId}/messages${params}`);
  }

  async sendMessage(chatId: string, text?: string, imageUrl?: string) {
    return this.request<MessageType>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, image_url: imageUrl }),
    });
  }

  // Telegram endpoints
  async getTelegramLink() {
    return this.request<TelegramLinkResponse>('/tg/link');
  }

  async getTelegramStatus() {
    return this.request<TelegramStatusResponse>('/tg/status');
  }
}

export const apiClient = new ApiClient();

// WebSocket message types
interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

type WebSocketCallback = (data: WebSocketMessage) => void;

// WebSocket client
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<WebSocketCallback>> = new Map();

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(`${WS_URL}?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        const eventType = data.type;
        const listeners = this.listeners.get(eventType);
        if (listeners) {
          listeners.forEach(callback => callback(data));
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connect(token), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(eventType: string, callback: WebSocketCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: string, callback: WebSocketCallback) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }
}

export const wsClient = new WebSocketClient();

// Mock data for development
export const mockProfiles: ProfileType[] = [
  {
    id: '1',
    name: 'Anna',
    age: 26,
    bio: 'Love hiking and coffee ☕',
    photos: [
      { id: 'p1', url: '/images/hiking.jpg', is_primary: true }
    ],
    location: { lat: 55.75, lon: 37.61, city: 'Moscow' },
    tags: ['hiking', 'coffee', 'dogs'],
    looking_for: ['dating', 'friendship'],
    preferences: { age_min: 22, age_max: 32, distance_km: 30 }
  },
  {
    id: '2',
    name: 'Maria',
    age: 24,
    bio: 'Artist and traveler 🎨',
    photos: [
      { id: 'p2', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', is_primary: true }
    ],
    location: { lat: 55.75, lon: 37.61, city: 'Moscow' },
    tags: ['art', 'travel', 'music'],
    looking_for: ['dating'],
    preferences: { age_min: 20, age_max: 30, distance_km: 25 }
  }
];