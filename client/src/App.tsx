
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { User, AppState, Project, SiteConfig, InternalOffer, Lesson, Product, ForumPost, ForumComment, Reaction } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_NETWORK, MOCK_LESSONS, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_REACTIONS } from './mockData';
import { UI_STRINGS } from './constants';

// Pages
import Marketplace from './pages/Marketplace';
import ProjectDetail from './pages/ProjectDetail';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Monitoring from './pages/Monitoring';
import AdminDashboard from './pages/AdminDashboard';
import BeneficiaryDashboard from './pages/BeneficiaryDashboard';
import Forum from './pages/Forum';
import ForumModeration from './pages/ForumModeration';
import PublisherProfile from './pages/PublisherProfile';

const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Book: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>,
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Globe: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
};

const Navbar = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const t = UI_STRINGS[state.language];
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setState({ ...state, currentUser: null });
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: state.siteConfig.marketplaceTitle || t.marketplace, icon: <Icons.Home />, public: true },
    { path: '/forum', label: t.forum, icon: <Icons.Users />, public: false },
    { path: '/monitoring', label: t.monitoringPlural, icon: <Icons.Chart />, public: false },
  ];

  const filteredLinks = navLinks.filter(link => link.public || state.currentUser);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 h-16 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center relative">
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-400 p-2 focus:outline-none">
            <Icons.Menu />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold flex items-center gap-2" style={{ color: state.siteConfig.primaryColor }}>
            {state.siteConfig.logoImageUrl ? (
              <img src={state.siteConfig.logoImageUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-white p-1 rounded uppercase tracking-tighter" style={{ backgroundColor: state.siteConfig.primaryColor }}>{state.siteConfig.headerLogo}</span>
            )}
            <span className="hidden sm:inline font-black tracking-tight dark:text-white transition-colors">{state.siteConfig.headerTitle}</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {filteredLinks.map(link => (
            <Link key={link.path} to={link.path} className="text-gray-600 dark:text-gray-300 hover:opacity-80 flex items-center gap-2 font-medium transition-colors">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          
          {state.currentUser ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <Link to={state.currentUser.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-gray-700 dark:text-gray-200 font-semibold hover:underline">
                {state.currentUser.name}
              </Link>
              <button onClick={handleLogout} className="text-red-500 text-sm font-medium">{t.logout}</button>
            </div>
          ) : (
            <Link to="/login" className="text-white px-4 py-2 rounded-lg font-bold transition shadow-sm" style={{ backgroundColor: state.siteConfig.primaryColor }}>
              {t.login}
            </Link>
          )}

          <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setState({ ...state, theme: state.theme === 'light' ? 'dark' : 'light' })}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              {state.theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>

            <button 
              onClick={() => setState({ ...state, language: state.language === 'EN' ? 'AR' : 'EN' })}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors"
            >
              <Icons.Globe />
              {state.language === 'EN' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => setState({ ...state, theme: state.theme === 'light' ? 'dark' : 'light' })}
            className="p-2 text-gray-500 dark:text-gray-400"
          >
            {state.theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
          </button>
          <button 
            onClick={() => setState({ ...state, language: state.language === 'EN' ? 'AR' : 'EN' })}
            className="text-gray-500 dark:text-gray-400 font-bold p-2"
          >
            <Icons.Globe />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className={`relative w-72 bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col p-6 animate-in ${state.language === 'AR' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
             <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-gray-800">
               <span className="font-black text-lg" style={{ color: state.siteConfig.primaryColor }}>{state.siteConfig.headerTitle}</span>
               <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 p-2"><Icons.Close /></button>
             </div>

             <div className="flex-grow space-y-4">
                {filteredLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 font-black text-gray-700 dark:text-gray-200 transition">
                    <span style={{ color: state.siteConfig.primaryColor }}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
             </div>

             <div className="pt-6 border-t dark:border-gray-800 space-y-4">
                {state.currentUser ? (
                  <>
                    <Link to={state.currentUser.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="block p-4 font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                       {state.currentUser.name}
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left p-4 font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition">{t.logout}</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center text-white py-4 rounded-2xl font-black shadow-lg" style={{ backgroundColor: state.siteConfig.primaryColor }}>
                    {t.login}
                  </Link>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Login = ({ state, setState, users }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, users: User[] }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const t = UI_STRINGS[state.language];

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      const adminUser = users.find(u => u.role === 'ADMIN');
      if (adminUser) {
        setState({ ...state, currentUser: adminUser });
      } else {
        const tempAdmin: User = {
          id: 'admin-temp',
          name: 'Admin User',
          email: 'admin@sbg.org',
          role: 'ADMIN',
          adminPermission: 'SUPER_ADMIN',
          banFromForum: false,
          banFromMarket: false
        };
        setState({ ...state, currentUser: tempAdmin });
      }
    } else {
      alert(state.language === 'AR' ? 'بيانات دخول غير صحيحة' : 'Invalid credentials');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md w-full`}>
        <h1 className={`text-2xl font-bold mb-6 text-center ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.login}
        </h1>

        {/* Username Field */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {state.language === 'AR' ? 'اسم المستخدم' : 'Username'}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={state.language === 'AR' ? 'أدخل اسم المستخدم' : 'Enter username'}
            className={`w-full p-3 rounded-lg border ${state.theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {state.language === 'AR' ? 'كلمة المرور' : 'Password'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={state.language === 'AR' ? 'أدخل كلمة المرور' : 'Enter password'}
            className={`w-full p-3 rounded-lg border ${state.theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {t.login}
        </button>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [networkPosts] = useState<InternalOffer[]>(MOCK_NETWORK);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [forumComments, setForumComments] = useState<ForumComment[]>(MOCK_FORUM_COMMENTS);
  const [reactions, setReactions] = useState<Reaction[]>(MOCK_REACTIONS);
  
  const [state, setState] = useState<AppState>(() => {
    const savedTheme = localStorage.getItem('sbg-theme') as 'light' | 'dark' | null;
    return {
      currentUser: null,
      language: 'AR',
      theme: savedTheme || 'light',
      siteConfig: {
        headerTitle: 'SBG Hub',
        headerLogo: 'SBG',
        logoImageUrl: '',
        subtitle: 'Building a Resilient Digital Ecosystem',
        footerText: '© 2024 Small Business Grants Project. All rights reserved.',
        marketplaceTitle: 'السوق الرقمي',
        primaryColor: '#2563eb',
        fontFamily: 'Inter',
        showHeroSlider: true,
        heroSlider: [
          { id: '1', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200', active: true, order: 0 },
          { id: '2', url: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&q=80&w=1200', active: true, order: 1 }
        ]
      },
      hasNewAcademyContent: false
    };
  });

  useEffect(() => {
    localStorage.setItem('sbg-theme', state.theme);
    const root = document.documentElement;
    root.style.setProperty('--primary-color', state.siteConfig.primaryColor);
    const font = state.siteConfig.fontFamily === 'Noto Sans Arabic' ? "'Noto Sans Arabic', sans-serif" :
                 state.siteConfig.fontFamily === 'System' ? 'system-ui, sans-serif' : "'Inter', sans-serif";
    document.body.style.fontFamily = font;

    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.siteConfig.primaryColor, state.siteConfig.fontFamily, state.theme]);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${state.language === 'AR' ? 'rtl' : ''} bg-gray-50 dark:bg-gray-950 transition-colors duration-300`}>
        <Navbar state={state} setState={setState} />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={
              <Marketplace 
                language={state.language} 
                config={state.siteConfig} 
                projects={projects} 
                hasNewAcademyContent={state.hasNewAcademyContent}
                onClearAlert={() => setState(s => ({...s, hasNewAcademyContent: false}))}
              />
            } />
            <Route path="/project/:id" element={<ProjectDetail language={state.language} projects={projects} posts={networkPosts} currentUser={state.currentUser} setProjects={setProjects} setNetworkPosts={() => {}} />} />
            <Route path="/product/:productId" element={<ProductDetailsPage language={state.language} projects={projects} />} />
            <Route path="/login" element={<Login state={state} setState={setState} users={users} />} />
            <Route path="/monitoring" element={state.currentUser ? <Monitoring user={state.currentUser} language={state.language} /> : <Login state={state} setState={setState} users={users} />} />
            
            <Route path="/admin" element={state.currentUser?.role === 'ADMIN' ? (
              <AdminDashboard 
                language={state.language} 
                siteConfig={state.siteConfig} 
                onUpdateConfig={(cfg) => setState(s => ({...s, siteConfig: cfg}))} 
                projects={projects} 
                setProjects={setProjects} 
                lessons={lessons} 
                setLessons={setLessons} 
                onTriggerAlert={() => setState(s => ({...s, hasNewAcademyContent: true}))}
                users={users}
                setUsers={setUsers}
                currentUser={state.currentUser}
              />
            ) : <Login state={state} setState={setState} users={users} />} />
            
            <Route path="/dashboard" element={state.currentUser?.role === 'BENEFICIARY' ? <BeneficiaryDashboard user={state.currentUser} language={state.language} projects={projects} setProjects={setProjects} setNetworkPosts={() => {}} /> : <Login state={state} setState={setState} users={users} />} />
            
            <Route path="/forum" element={state.currentUser ? (
              <Forum 
                state={state} 
                setState={setState} 
                forumPosts={forumPosts} 
                setForumPosts={setForumPosts}
                forumComments={forumComments}
                setForumComments={setForumComments}
              />
            ) : <Login state={state} setState={setState} users={users} />} />
            
            <Route path="/moderation" element={state.currentUser?.adminPermission === 'SUPER_ADMIN' ? (
              <ForumModeration 
                state={state} 
                users={users} 
                setUsers={setUsers}
                forumPosts={forumPosts}
                setForumPosts={setForumPosts}
                forumComments={forumComments}
                setForumComments={setForumComments}
              />
            ) : <Login state={state} setState={setState} users={users} />} />
            
            <Route path="/publisher/:publisherId" element={<PublisherProfile state={state} users={users} projects={projects} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
