// import { useEffect } from 'react';
// import { Toaster } from '@/components/ui/sonner';
// import { TooltipProvider } from '@/components/ui/tooltip';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import './lib/i18n';

// import { useAuthStore } from '@/lib/store';
// import { useSettingsStore } from '@/lib/store';

// import Auth from './pages/Auth';
// import Profile from './pages/Profile';
// import Discover from './pages/Discover';
// import Matches from './pages/Matches';
// import Settings from './pages/Settings';

// const queryClient = new QueryClient();

// // Protected Route Component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, isLoading } = useAuthStore();
  
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
//       </div>
//     );
//   }
  
//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }
  
//   return <>{children}</>;
// };

// // Main Layout Component
// const Layout = ({ children }: { children: React.ReactNode }) => {
//   const { t } = useTranslation();
  
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Bottom Navigation */}
//       <div className="pb-16 md:pb-0">
//         {children}
//       </div>
      
//       {/* Bottom Navigation Bar */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden">
//         <div className="flex justify-around items-center h-16">
//           <a href="/discover" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <span className="text-xs mt-1">{t('discover')}</span>
//           </a>
          
//           <a href="/matches" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//             </svg>
//             <span className="text-xs mt-1">{t('matches')}</span>
//           </a>
          
//           <a href="/profile" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//             <span className="text-xs mt-1">{t('profile')}</span>
//           </a>
          
//           <a href="/settings" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             <span className="text-xs mt-1">{t('settings')}</span>
//           </a>
//         </div>
//       </nav>
//     </div>
//   );
// };

// const App = () => {
//   const { loadUser } = useAuthStore();
//   const { setTheme, theme } = useSettingsStore();

//   useEffect(() => {
//     // Initialize theme
//     setTheme(theme);
    
//     // Try to load user on app start
//     loadUser();
//   }, []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/" element={<Navigate to="/discover" replace />} />
//             <Route
//               path="/discover"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Discover />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/matches"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Matches />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Profile />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/settings"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Settings />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;


import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './lib/i18n';

import { useAuthStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/store';

import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

// Layout вынесен прямо тут, можно вынести в отдельный файл
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16 md:pb-0">{children}</div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden">
        <div className="flex justify-around items-center h-16">
          <a href="/discover" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs mt-1">{t('discover')}</span>
          </a>

          <a href="/matches" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs mt-1">{t('matches')}</span>
          </a>

          <a href="/profile" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">{t('profile')}</span>
          </a>

          <a href="/settings" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">{t('settings')}</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

const App = () => {
  const { loadUser } = useAuthStore();
  const { setTheme, theme } = useSettingsStore();

  useEffect(() => {
    setTheme(theme);
    loadUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route path="/discover" element={<Layout><Discover /></Layout>} />
            <Route path="/matches" element={<Layout><Matches /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
