# LoveConnect - Dating Website UI

A modern, feature-rich dating website built with React, TypeScript, and shadcn/ui components.

## 🚀 Features

### Authentication & Onboarding
- Email/password registration and login
- JWT token management (access tokens in memory, refresh tokens in httpOnly cookies)
- Telegram OAuth integration (ready for backend implementation)
- Form validation with React Hook Form + Zod

### Profile Management
- Complete profile creation and editing
- Photo upload with drag & drop support
- Interest tags and preferences
- Location and bio management
- Privacy settings

### Discovery & Matching
- Tinder-style card swiping interface
- Like/Pass functionality with smooth animations
- Advanced filtering (age, location, interests)
- Match notifications and celebrations

### Real-time Chat System
- Live messaging with WebSocket support
- Typing indicators and online status
- Message history and read receipts
- Match-based chat initiation

### Settings & Customization
- Multi-language support (English/Russian)
- Theme switching (Light/Dark/System)
- Notification preferences
- Telegram integration settings

### Admin Panel (Basic)
- User management interface
- Report handling system
- Basic analytics and statistics

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form + Zod
- **Routing**: React Router DOM
- **Internationalization**: react-i18next
- **API Client**: Custom fetch wrapper with interceptors
- **Real-time**: WebSocket client
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library (configured)

## 📦 Installation

1. **Clone and install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your API endpoints
```

3. **Start development server**:
```bash
pnpm run dev
```

4. **Build for production**:
```bash
pnpm run build
```

## 🔧 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run test` - Run tests (when implemented)

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_WS_URL` | WebSocket server URL | `ws://localhost:8000/ws` |
| `VITE_TG_BOT_USERNAME` | Telegram bot username | - |

## 📱 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/auth` | Auth | Login/Register page |
| `/discover` | Discover | Main swiping interface |
| `/matches` | Matches | Matches and chat interface |
| `/profile` | Profile | Profile management |
| `/settings` | Settings | App settings and preferences |

## 🔌 API Integration

The app is designed to work with a FastAPI backend. Key integration points:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user

### Profile Management
- `GET /profiles/me` - Get user profile
- `PATCH /profiles/me` - Update profile
- `POST /profiles/me/photos` - Upload photos

### Discovery & Matching
- `GET /discover` - Get potential matches
- `POST /swipe` - Like/pass on profiles
- `GET /matches` - Get user matches

### Chat System
- `GET /chats` - Get chat list
- `GET /chats/{id}/messages` - Get chat messages
- `POST /chats/{id}/messages` - Send message
- WebSocket `/ws` - Real-time updates

### Telegram Integration
- `GET /tg/link` - Get Telegram bot link
- `GET /tg/status` - Check Telegram connection status

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Theme**: System preference detection with manual override
- **Smooth Animations**: Framer Motion for card swiping and transitions
- **Accessibility**: ARIA labels, keyboard navigation, proper contrast
- **Modern Gradients**: Beautiful gradient backgrounds and glassmorphism effects
- **Interactive Elements**: Hover effects, loading states, and micro-interactions

## 🔒 Security Features

- JWT token management with automatic refresh
- XSS protection through proper sanitization
- CSRF protection via httpOnly cookies
- Input validation on all forms
- Secure API communication

## 🚧 Development Notes

### Mock Data
The app currently uses mock data for development. Real API integration points are commented and ready for backend connection.

### WebSocket Integration
WebSocket client is implemented and ready for real-time features like:
- Live messaging
- Typing indicators
- Online status updates
- Match notifications

### Telegram Integration
Deep linking structure is prepared for Telegram bot integration:
- Bot username configuration
- Bind token generation
- Status checking endpoints

## 🎯 Future Enhancements

- [ ] Photo upload with compression and cropping
- [ ] Video chat integration
- [ ] Advanced matching algorithms
- [ ] Push notifications (Web Push API)
- [ ] Social media sharing
- [ ] Location-based matching
- [ ] Premium features and subscriptions
- [ ] Advanced admin dashboard
- [ ] Content moderation tools
- [ ] Analytics and insights

## 📄 License

This project is built for demonstration purposes using the MGX platform.

## 🤝 Contributing

This is a demonstration project. For production use, ensure proper backend integration and security auditing.

---

Built with ❤️ using React, TypeScript, and shadcn/ui