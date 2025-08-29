import { create } from 'zustand';
import { apiClient, wsClient, ProfileType, MessageType, MatchType, mockProfiles } from './api';

// Auth Store
interface AuthState {
  user: ProfileType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login(email, password);
      set({ user: response.user, isAuthenticated: true });
      wsClient.connect(response.access);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      await apiClient.register(email, password, name);
      // Auto-login after registration
      await get().login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.logout();
      wsClient.disconnect();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const user = await apiClient.getMe();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Load user failed:', error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Profile Store
interface ProfileState {
  profile: ProfileType | null;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileType>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await apiClient.getProfile();
      set({ profile });
    } catch (error) {
      console.error('Load profile failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: Partial<ProfileType>) => {
    set({ isLoading: true });
    try {
      const updatedProfile = await apiClient.updateProfile(data);
      set({ profile: updatedProfile });
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Discover Store
interface DiscoverFilters {
  age_min?: number;
  age_max?: number;
  distance_km?: number;
  tags?: string[];
}

interface DiscoverState {
  profiles: ProfileType[];
  currentIndex: number;
  isLoading: boolean;
  filters: DiscoverFilters;
  loadProfiles: () => Promise<void>;
  swipeProfile: (action: 'like' | 'pass') => Promise<{ match: boolean; chat_id?: string }>;
  setFilters: (filters: DiscoverFilters) => void;
  nextProfile: () => void;
}

export const useDiscoverStore = create<DiscoverState>((set, get) => ({
  profiles: mockProfiles, // Start with mock data
  currentIndex: 0,
  isLoading: false,
  filters: {},

  loadProfiles: async () => {
    set({ isLoading: true });
    try {
      // Use mock data for now
      set({ profiles: mockProfiles, currentIndex: 0 });
      // const profiles = await apiClient.getDiscoverProfiles(get().filters);
      // set({ profiles, currentIndex: 0 });
    } catch (error) {
      console.error('Load profiles failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  swipeProfile: async (action: 'like' | 'pass') => {
    const { profiles, currentIndex } = get();
    const currentProfile = profiles[currentIndex];
    
    if (!currentProfile) {
      throw new Error('No profile to swipe');
    }

    try {
      // Mock response for now
      const result = { match: action === 'like' && Math.random() > 0.7, chat_id: 'mock-chat-id' };
      // const result = await apiClient.swipe(currentProfile.id, action);
      
      get().nextProfile();
      return result;
    } catch (error) {
      console.error('Swipe failed:', error);
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().loadProfiles();
  },

  nextProfile: () => {
    const { profiles, currentIndex } = get();
    if (currentIndex < profiles.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      // Load more profiles or show "no more profiles" message
      set({ currentIndex: 0 });
    }
  },
}));

// Chat Store
interface ChatState {
  matches: MatchType[];
  currentChat: string | null;
  messages: Record<string, MessageType[]>;
  isLoading: boolean;
  typingUsers: Record<string, string[]>;
  onlineUsers: Set<string>;
  loadMatches: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  setCurrentChat: (chatId: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  matches: [],
  currentChat: null,
  messages: {},
  isLoading: false,
  typingUsers: {},
  onlineUsers: new Set(),

  loadMatches: async () => {
    set({ isLoading: true });
    try {
      // Mock matches for now
      const mockMatches: MatchType[] = [
        {
          user: mockProfiles[0],
          chat_id: 'chat-1',
          last_message: {
            id: 'msg-1',
            chat_id: 'chat-1',
            from_user_id: '1',
            text: 'Hi! How are you?',
            created_at: new Date().toISOString(),
            read: false,
          },
        },
      ];
      set({ matches: mockMatches });
      // const matches = await apiClient.getMatches();
      // set({ matches });
    } catch (error) {
      console.error('Load matches failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadMessages: async (chatId: string) => {
    set({ isLoading: true });
    try {
      // Mock messages for now
      const mockMessages: MessageType[] = [
        {
          id: 'msg-1',
          chat_id: chatId,
          from_user_id: '1',
          text: 'Hi! How are you?',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: 'msg-2',
          chat_id: chatId,
          from_user_id: 'current-user',
          text: 'Hello! I\'m doing great, thanks for asking!',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          read: true,
        },
      ];
      set((state) => ({
        messages: { ...state.messages, [chatId]: mockMessages },
      }));
      // const messages = await apiClient.getChatMessages(chatId);
      // set((state) => ({ messages: { ...state.messages, [chatId]: messages } }));
    } catch (error) {
      console.error('Load messages failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (chatId: string, text: string) => {
    try {
      // Mock message sending for now
      const newMessage: MessageType = {
        id: `msg-${Date.now()}`,
        chat_id: chatId,
        from_user_id: 'current-user',
        text,
        created_at: new Date().toISOString(),
        read: false,
      };
      
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage],
        },
      }));
      
      // const message = await apiClient.sendMessage(chatId, text);
      // Update local state with the response
    } catch (error) {
      console.error('Send message failed:', error);
      throw error;
    }
  },

  setCurrentChat: (chatId: string | null) => {
    set({ currentChat: chatId });
    if (chatId) {
      get().loadMessages(chatId);
    }
  },
}));

// Settings Store
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ru';
  telegramLinked: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'en' | 'ru') => void;
  checkTelegramStatus: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
  language: (localStorage.getItem('language') as 'en' | 'ru') || 'en',
  telegramLinked: false,

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },

  checkTelegramStatus: async () => {
    try {
      const status = await apiClient.getTelegramStatus();
      set({ telegramLinked: status.linked });
    } catch (error) {
      console.error('Check Telegram status failed:', error);
    }
  },
}));