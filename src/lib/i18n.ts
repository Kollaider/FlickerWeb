import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Auth
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      'forgot_password': 'Forgot Password?',
      'login_with_telegram': 'Login with Telegram',
      'create_account': 'Create Account',
      'already_have_account': 'Already have an account?',
      'dont_have_account': "Don't have an account?",
      
      // Navigation
      discover: 'Discover',
      matches: 'Matches',
      profile: 'Profile',
      settings: 'Settings',
      chat: 'Chat',
      
      // Profile
      'edit_profile': 'Edit Profile',
      bio: 'Bio',
      age: 'Age',
      interests: 'Interests',
      'looking_for': 'Looking For',
      'add_photo': 'Add Photo',
      'save_changes': 'Save Changes',
      
      // Discover
      like: 'Like',
      pass: 'Pass',
      'its_a_match': "It's a Match!",
      'no_more_profiles': 'No more profiles',
      
      // Chat
      'type_message': 'Type a message...',
      send: 'Send',
      online: 'Online',
      typing: 'Typing...',
      
      // Settings
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      'link_telegram': 'Link Telegram',
      'telegram_linked': 'Telegram Linked',
      logout: 'Logout',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    }
  },
  ru: {
    translation: {
      // Auth
      login: 'Войти',
      register: 'Регистрация',
      email: 'Электронная почта',
      password: 'Пароль',
      name: 'Имя',
      'forgot_password': 'Забыли пароль?',
      'login_with_telegram': 'Войти через Telegram',
      'create_account': 'Создать аккаунт',
      'already_have_account': 'Уже есть аккаунт?',
      'dont_have_account': 'Нет аккаунта?',
      
      // Navigation
      discover: 'Поиск',
      matches: 'Совпадения',
      profile: 'Профиль',
      settings: 'Настройки',
      chat: 'Чат',
      
      // Profile
      'edit_profile': 'Редактировать профиль',
      bio: 'О себе',
      age: 'Возраст',
      interests: 'Интересы',
      'looking_for': 'Ищу',
      'add_photo': 'Добавить фото',
      'save_changes': 'Сохранить изменения',
      
      // Discover
      like: 'Нравится',
      pass: 'Пропустить',
      'its_a_match': 'Совпадение!',
      'no_more_profiles': 'Больше нет профилей',
      
      // Chat
      'type_message': 'Введите сообщение...',
      send: 'Отправить',
      online: 'Онлайн',
      typing: 'Печатает...',
      
      // Settings
      theme: 'Тема',
      language: 'Язык',
      light: 'Светлая',
      dark: 'Тёмная',
      system: 'Системная',
      'link_telegram': 'Привязать Telegram',
      'telegram_linked': 'Telegram привязан',
      logout: 'Выйти',
      
      // Common
      save: 'Сохранить',
      cancel: 'Отмена',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;