import { useState, useEffect } from 'react';
import Splash from './components/Splash';
import LanguagePicker from './components/LanguagePicker';
import SOSButton from './components/SOSButton';
import { OfflineBanner, InstallBanner, UpdateBanner } from './components/PWABanners';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import CategoryPage from './pages/CategoryPage';
import DocumentAnalyzer from './pages/DocumentAnalyzer';
import DraftPage from './pages/DraftPage';
import VoiceOnlyPage from './pages/VoiceOnlyPage';
import AdminDashboard from './pages/AdminDashboard';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages';
import ProfilePage from './pages/ProfilePage';
import { useSpeech } from './hooks/useSpeech';
import { useBookmarks } from './hooks/useBookmarks';
import { useChatHistory } from './hooks/useChatHistory';
import { usePWA } from './hooks/usePWA';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState('home');
  const [selCat, setSelCat] = useState(null);
  const [lang, setLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem('ks_theme') || 'dark');
  const [fontSize, setFontSize] = useState(localStorage.getItem('ks_fontsize') || 'normal');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ks_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('ks_fontsize', fontSize);
  }, [fontSize]);

  const speech = useSpeech(lang);
  const bookmarkHook = useBookmarks();
  const chatHistory = useChatHistory();
  const pwa = usePWA();
  const auth = useAuth();

  // Track page views
  useEffect(() => {
    auth.trackPage(screen, lang);
  }, [screen]);

  const goHome = () => { setScreen('home'); setChatQuery(null); };
  const doLogin = (u) => { setScreen('home'); };
  const doLogout = () => { auth.logout(); setScreen('home'); };
  const goChat = (query) => { setChatQuery(query); setScreen('chat'); };
  const goCategory = (id) => { setSelCat(id); setScreen('category'); };

  const commonProps = {
    loggedIn: auth.isLoggedIn, user: auth.user, lang, theme, fontSize,
    setTheme, setFontSize,
    onLangPick: () => setLangOpen(true),
    onLogin: () => setScreen('login'),
    onSignup: () => setScreen('signup'),
    onLogout: doLogout,
    onHome: goHome,
    onProfile: () => setScreen('profile'),
    onAdmin: auth.isAdmin ? () => setScreen('admin') : null,
    auth,
  };

  if (!loaded) return <Splash onDone={() => setLoaded(true)} />;

  let content;
  switch (screen) {
    case 'login':
      content = <LoginPage auth={auth} onLogin={doLogin} onGoSignup={() => setScreen('signup')} onGuest={goHome} onForgot={() => setScreen('forgot')} />;
      break;
    case 'signup':
      content = <SignupPage auth={auth} onSignup={doLogin} onGoLogin={() => setScreen('login')} />;
      break;
    case 'forgot':
      content = <ForgotPasswordPage auth={auth} onGoLogin={() => setScreen('login')} />;
      break;
    case 'profile':
      content = <ProfilePage user={auth.user} auth={auth} onSave={() => {}} onBack={goHome} />;
      break;
    case 'category':
      content = <CategoryPage catId={selCat} {...commonProps} onChat={goChat} bookmarkHook={bookmarkHook} />;
      break;
    case 'chat':
      content = <ChatPage {...commonProps} speech={speech} initialQuery={chatQuery} chatHistory={chatHistory} />;
      break;
    case 'analyzer':
      content = <DocumentAnalyzer {...commonProps} />;
      break;
    case 'drafts':
      content = <DraftPage {...commonProps} auth={auth} />;
      break;
    case 'voiceonly':
      content = <VoiceOnlyPage lang={lang} speech={speech} onHome={goHome} />;
      break;
    case 'admin':
      content = <AdminDashboard token={auth.token} onBack={goHome} />;
      break;
    default:
      content = <HomePage {...commonProps} onChat={goChat} onCategory={goCategory} speech={speech} bookmarkHook={bookmarkHook} onAnalyzer={() => setScreen('analyzer')} onDrafts={() => setScreen('drafts')} onVoiceOnly={() => setScreen('voiceonly')} onAdmin={auth.isAdmin ? () => setScreen('admin') : null} />;
  }

  return (
    <>
      {content}
      {langOpen && <LanguagePicker lang={lang} onSelect={setLang} onClose={() => setLangOpen(false)} />}
      {screen !== 'voiceonly' && <SOSButton />}
      <OfflineBanner isOnline={pwa.isOnline} />
      {pwa.isInstallable && <InstallBanner onInstall={pwa.promptInstall} onDismiss={pwa.dismissInstall} />}
      {pwa.updateAvailable && <UpdateBanner onUpdate={pwa.applyUpdate} />}
    </>
  );
}
