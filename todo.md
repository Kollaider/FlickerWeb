# Dating Website MVP - Implementation Plan

## Core Features to Implement

### 1. Project Setup & Dependencies
- Add required dependencies: zustand, react-hook-form, zod, react-i18next, @tanstack/react-query
- Configure i18n with ru/en support
- Set up API client with interceptors
- WebSocket client setup

### 2. Authentication System
- Login/Register pages with form validation
- JWT token management (access in memory, refresh handling)
- Protected routes
- Telegram OAuth integration

### 3. Profile Management
- Profile creation/editing forms
- Photo upload with drag&drop and compression
- Interest tags selection
- Privacy settings

### 4. Discover/Swipe Feature
- Card-based profile display
- Swipe functionality (Like/Pass buttons)
- Filters (age, location, interests)
- Infinite scroll

### 5. Matches & Chat System
- Matches list
- Chat interface with real-time messaging
- WebSocket integration for live updates
- Typing indicators and online status

### 6. Settings & Notifications
- Theme switching (light/dark/system)
- Language selection
- Notification preferences
- Telegram integration

### 7. Basic Admin Panel
- User management
- Report handling
- Basic statistics

## File Structure (Max 8 files limit)
1. `src/App.tsx` - Main app with routing and providers
2. `src/pages/Auth.tsx` - Combined login/register page
3. `src/pages/Profile.tsx` - Profile management
4. `src/pages/Discover.tsx` - Main swipe interface
5. `src/pages/Matches.tsx` - Matches and chat interface
6. `src/pages/Settings.tsx` - Settings and admin panel
7. `src/lib/store.ts` - Zustand store with all state management
8. `src/lib/api.ts` - API client and WebSocket setup

## Implementation Priority
1. Basic routing and auth flow
2. Profile creation and editing
3. Discover page with mock data
4. Basic chat interface
5. Settings and theme switching
6. Real-time features (WebSocket)
7. Telegram integration
8. Admin features