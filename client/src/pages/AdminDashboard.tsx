
import React, { useState, useMemo, useRef } from 'react';
import { UI_STRINGS, SECTORS, LOCATIONS, CATEGORY_LABELS, LOCATION_LABELS } from '../constants';
import { Project, SiteConfig, User, AdminPermission, Lesson, LessonType, SliderImage } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';

const AdminDashboard: React.FC<{ 
  language: 'EN' | 'AR', 
  siteConfig: SiteConfig, 
  onUpdateConfig: (config: SiteConfig) => void,
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  lessons: Lesson[],
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,
  onTriggerAlert: () => void,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  currentUser: User
}> = ({ language, siteConfig, onUpdateConfig, projects, setProjects, lessons, setLessons, onTriggerAlert, users, setUsers, currentUser }) => {
  const t = UI_STRINGS[language];
  const [activeTab, setActiveTab] = useState<'MONITORING' | 'DIRECTORY' | 'USERS' | 'ACADEMY' | 'SETTINGS' | 'SLIDER'>('MONITORING');
  
  const isSuperAdmin = currentUser.adminPermission === 'SUPER_ADMIN';
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  // Statistics calculation for Analytics dashboard
  const stats = useMemo(() => {
    const totalSales = projects.reduce((acc, p) => acc + (p.totalSales || 0), 0);
    const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);
    
    const categoryDist = SECTORS.map(s => ({
      name: CATEGORY_LABELS[s]?.[language] || s,
      value: projects.filter(p => p.category === s).length
    }));

    const locationDist = LOCATIONS.map(loc => ({
      name: LOCATION_LABELS[loc]?.[language] || loc,
      value: projects.filter(p => p.location === loc).length,
      sales: projects.filter(p => p.location === loc).reduce((acc, p) => acc + (p.totalSales || 0), 0)
    }));

    const genderDist = [
      { name: t.male, value: projects.filter(p => p.ownerGender === 'MALE').length },
      { name: t.female, value: projects.filter(p => p.ownerGender === 'FEMALE').length }
    ];

    const statusDist = [
      { name: t.active, value: projects.filter(p => p.status === 'ACTIVE').length },
      { name: t.emerging, value: projects.filter(p => p.status === 'EMERGING').length }
    ];

    const salesTimeline = [
      { name: 'Jan', sales: 400 },
      { name: 'Feb', sales: 1200 },
      { name: 'Mar', sales: 900 },
      { name: 'Apr', sales: 2300 },
      { name: 'Today', sales: totalSales }
    ];

    const topProjects = [...projects].sort((a,b) => (b.totalSales || 0) - (a.totalSales || 0)).slice(0, 5);
    const bestSellingProducts = projects.flatMap(p => p.products.map(pr => ({ ...pr, business: p.name })))
      .sort((a,b) => b.salesCount - a.salesCount).slice(0, 5);

    return { totalSales, totalViews, categoryDist, locationDist, genderDist, statusDist, salesTimeline, topProjects, bestSellingProducts };
  }, [projects, language, t]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Form States
  const [configForm, setConfigForm] = useState<SiteConfig>(siteConfig);
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({ type: 'TEXT', category: 'MARKETING' });
  const [userForm, setUserForm] = useState<Partial<User>>({ role: 'VIEWER' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // UI Helper: High Contrast Contrast Classes
  const inputClass = "w-full border p-4 rounded-2xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 transition-colors";
  const labelClass = "block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2";

  // User Handlers (Full CRUD)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userForm } as User : u));
    } else {
      setUsers([...users, { ...userForm, id: `u${Date.now()}`, role: userForm.role || 'VIEWER' } as User]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserForm({ role: 'VIEWER' });
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm(language === 'EN' ? 'Are you sure you want to delete this user?' : 'هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: lessonForm.title || '',
      category: lessonForm.category || 'MARKETING',
      type: lessonForm.type as LessonType,
      content: lessonForm.content || '',
      description: lessonForm.description || '',
      createdAt: new Date().toISOString(),
      thumbnail: `https://picsum.photos/seed/${Date.now()}/400/225`
    };
    setLessons([...lessons, newLesson]);
    setLessonForm({ type: 'TEXT', category: 'MARKETING' });
    onTriggerAlert();
    alert(language === 'EN' ? 'Educational material published!' : 'تم نشر المادة التعليمية!');
  };

  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(configForm);
    alert(language === 'EN' ? 'Settings updated!' : 'تم تحديث الإعدادات!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setConfigForm({ ...configForm, logoImageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImg: SliderImage = { id: `sl-${Date.now()}`, url: reader.result as string, active: true, order: configForm.heroSlider.length };
        setConfigForm({ ...configForm, heroSlider: [...configForm.heroSlider, newImg] });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteSliderImg = (id: string) => {
    setConfigForm(prev => ({ ...prev, heroSlider: prev.heroSlider.filter(img => img.id !== id) }));
  };

  return (
    <div className="space-y-10 pb-20 transition-colors">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t.monitoringPlural}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{language === 'EN' ? 'Global Command Center' : 'مركز التحكم الشامل'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'MONITORING', label: t.analytics, icon: '📊' },
            { id: 'DIRECTORY', label: t.directory, icon: '📂' },
            { id: 'USERS', label: t.userManagement, icon: '👥', hidden: !isSuperAdmin },
            { id: 'ACADEMY', label: t.academyManagement, icon: '🎓' },
            { id: 'SETTINGS', label: t.websiteSettings, icon: '🎨', hidden: !isSuperAdmin },
            { id: 'SLIDER', label: t.sliderManager, icon: '🖼️', hidden: !isSuperAdmin }
          ].filter(tab => !tab.hidden).map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-5 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'text-white shadow-xl scale-105' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'}`}
              style={activeTab === tab.id ? { backgroundColor: siteConfig.primaryColor } : {}}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* MONITORING TAB */}
      {activeTab === 'MONITORING' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.analytics}</h2>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-black dark:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition">
                🔄 {t.refreshData}
              </button>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: t.totalSales, val: `$${stats.totalSales.toLocaleString()}`, color: 'text-blue-600 dark:text-blue-400' },
                { label: language === 'EN' ? 'Active Projects' : 'المشاريع النشطة', val: projects.length, color: 'text-green-600 dark:text-green-400' },
                { label: t.conversionRate, val: `${((stats.totalSales / (stats.totalViews || 1)) * 10).toFixed(1)}%`, color: 'text-indigo-600 dark:text-indigo-400' },
                { label: t.status + ' (Active)', val: stats.statusDist[0].value, color: 'text-orange-500 dark:text-orange-400' }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                  <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{card.label}</div>
                  <div className={`text-3xl font-black mt-2 ${card.color}`}>{card.val}</div>
                </div>
              ))}
           </div>

           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
                <h3 className="font-black text-gray-900 dark:text-white">{t.monitoringPlural} Trends</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesTimeline}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={siteConfig.primaryColor} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={siteConfig.primaryColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="sales" stroke={siteConfig.primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name={t.sales} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-center transition-colors">
                 <h3 className="font-black text-gray-900 dark:text-white">{t.gender} Distribution</h3>
                 <div className="h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={stats.genderDist} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                         {stats.genderDist.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex flex-col gap-2">
                    {stats.genderDist.map((g, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                          <span>{g.name}</span>
                        </div>
                        <span>{g.value}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* DIRECTORY TAB */}
      {activeTab === 'DIRECTORY' && (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 transition-colors">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
             <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">{t.directory}</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800/30 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">
                 <tr>
                   <th className="px-6 py-4">Project</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Sales</th>
                   <th className="px-6 py-4">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                 {projects.map(p => (
                   <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                     <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                           <img src={p.logoUrl || p.imageUrl} className="w-full h-full object-cover" />
                         </div>
                         <div>
                           <div>{p.name}</div>
                           <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{p.ownerName} • {p.location}</div>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-xs">
                        <span className={`px-2 py-1 rounded-lg border font-black uppercase ${p.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50'}`}>{p.status}</span>
                     </td>
                     <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400">${(p.totalSales || 0).toLocaleString()}</td>
                     <td className="px-6 py-4">
                        <button onClick={() => { setEditingProject(p); setIsProjectModalOpen(true); }} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-lg font-black text-xs hover:bg-blue-600 hover:text-white transition">Edit</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'USERS' && isSuperAdmin && (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 transition-colors">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
             <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">{t.userManagement}</h3>
             <button onClick={() => { setEditingUser(null); setUserForm({ role: 'VIEWER' }); setIsUserModalOpen(true); }} className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition">
                {t.addNew}
             </button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800/30 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">
                 <tr>
                   <th className="px-6 py-4">Name</th>
                   <th className="px-6 py-4">Email</th>
                   <th className="px-6 py-4">Role</th>
                   <th className="px-6 py-4">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                 {users.map(u => (
                   <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                     <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{u.name}</td>
                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                     <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase border border-blue-100 dark:border-blue-900/50">{u.role}</span>
                     </td>
                     <td className="px-6 py-4 flex gap-4">
                        <button onClick={() => { setEditingUser(u); setUserForm(u); setIsUserModalOpen(true); }} className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">{t.edit}</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 dark:text-red-400 font-bold text-sm hover:underline">{t.delete}</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* ACADEMY TAB */}
      {activeTab === 'ACADEMY' && (
        <div className="grid lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4">
           <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t.addMaterial}</h3>
              <form onSubmit={handleAddLesson} className="space-y-4">
                 <div>
                   <label className={labelClass} htmlFor="les-title">{t.lessonTitle}</label>
                   <input id="les-title" placeholder="Material Title" className={inputClass} value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className={labelClass} htmlFor="les-sec">{t.sector}</label>
                     <input id="les-sec" placeholder="Category" className={inputClass} value={lessonForm.category} onChange={e => setLessonForm({...lessonForm, category: e.target.value})} />
                   </div>
                   <div>
                     <label className={labelClass} htmlFor="les-type">Type</label>
                     <select id="les-type" className={inputClass} value={lessonForm.type} onChange={e => setLessonForm({...lessonForm, type: e.target.value as any})}>
                       <option value="TEXT">Text Article</option>
                       <option value="VIDEO">Video Link</option>
                       <option value="IMAGE">Image / Graphic</option>
                       <option value="FILE">File / PDF</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className={labelClass} htmlFor="les-content">URL / Raw Content</label>
                   <textarea id="les-content" placeholder="Content or URL" rows={4} className={inputClass} value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})} required />
                 </div>
                 <div>
                   <label className={labelClass} htmlFor="les-desc">Short Description</label>
                   <textarea id="les-desc" placeholder="Short Description" rows={2} className={inputClass} value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full py-4 text-white font-black rounded-2xl shadow-xl hover:opacity-90 transition" style={{ backgroundColor: siteConfig.primaryColor }}>{t.save}</button>
              </form>
           </div>
           <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm h-fit transition-colors">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800 font-black text-xs uppercase text-gray-400">Current Materials</div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
                 {lessons.map(l => (
                   <div key={l.id} className="p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                     <div>
                        <div className="font-bold text-gray-900 dark:text-white">{l.title}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">{l.type} • {l.category}</div>
                     </div>
                     <button onClick={() => setLessons(lessons.filter(x => x.id !== l.id))} className="text-red-500 dark:text-red-400 font-bold text-xs hover:underline">Delete</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'SETTINGS' && isSuperAdmin && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10 animate-in slide-in-from-bottom-4 transition-colors">
           <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.websiteSettings}</h2>
           <form onSubmit={handleApplyConfig} className="space-y-8">
              <div>
                <label className={labelClass}>Logo & Branding</label>
                <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                   <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border dark:border-gray-700 flex items-center justify-center">
                      {configForm.logoImageUrl ? <img src={configForm.logoImageUrl} className="w-full h-full object-contain" /> : <span className="text-3xl font-black text-gray-200 dark:text-gray-700">🎨</span>}
                   </div>
                   <div className="space-y-2">
                      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-black shadow-sm text-black dark:text-white uppercase tracking-widest">Change Logo</button>
                   </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass} htmlFor="main-title">{t.mainTitle}</label>
                    <input id="main-title" className={inputClass} value={configForm.headerTitle} onChange={e => setConfigForm({...configForm, headerTitle: e.target.value})} />
                 </div>
                 <div>
                    <label className={labelClass} htmlFor="main-sub">{t.mainSubtitle}</label>
                    <input id="main-sub" className={inputClass} value={configForm.subtitle} onChange={e => setConfigForm({...configForm, subtitle: e.target.value})} />
                 </div>
              </div>
              <div>
                 <label className={labelClass} htmlFor="main-footer">{t.footerText}</label>
                 <textarea id="main-footer" className={inputClass} rows={2} value={configForm.footerText} onChange={e => setConfigForm({...configForm, footerText: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                 <div>
                    <label className={labelClass} htmlFor="main-color">{t.primaryColor}</label>
                    <div className="flex gap-3">
                       <input id="main-color" type="color" className="w-12 h-12 rounded-lg cursor-pointer border-none bg-transparent" value={configForm.primaryColor} onChange={e => setConfigForm({...configForm, primaryColor: e.target.value})} />
                       <input className={inputClass} value={configForm.primaryColor} onChange={e => setConfigForm({...configForm, primaryColor: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className={labelClass} htmlFor="main-font">{t.fontFamily}</label>
                    <select id="main-font" className={inputClass} value={configForm.fontFamily} onChange={e => setConfigForm({...configForm, fontFamily: e.target.value as any})}>
                       <option value="Inter">Modern (Inter)</option>
                       <option value="Noto Sans Arabic">Arabic (Noto Sans)</option>
                       <option value="System">System</option>
                    </select>
                 </div>
              </div>
              <button type="submit" className="w-full py-5 text-white font-black rounded-[2rem] shadow-2xl hover:opacity-90 transition active:scale-95" style={{ backgroundColor: siteConfig.primaryColor }}>Save Branding</button>
           </form>
        </div>
      )}

      {/* SLIDER TAB */}
      {activeTab === 'SLIDER' && isSuperAdmin && (
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 transition-colors">
           <div className="flex justify-between items-center border-b dark:border-gray-800 pb-6">
             <h3 className="text-xl font-black text-gray-900 dark:text-white">Hero Slider Manager</h3>
             <button onClick={() => setConfigForm({...configForm, showHeroSlider: !configForm.showHeroSlider})} className={`w-14 h-8 rounded-full relative transition-colors ${configForm.showHeroSlider ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${configForm.showHeroSlider ? (language === 'AR' ? 'left-1' : 'right-1') : (language === 'AR' ? 'right-1' : 'left-1')}`}></div>
             </button>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div onClick={() => sliderInputRef.current?.click()} className="aspect-video bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 dark:text-gray-500 font-black uppercase text-xs">
                 <span>➕ Upload Image</span>
                 <input type="file" ref={sliderInputRef} className="hidden" accept="image/*" onChange={handleSliderUpload} />
              </div>
              {configForm.heroSlider.sort((a,b) => a.order - b.order).map((img, idx) => (
                <div key={img.id} className="relative group aspect-video rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                   <img src={img.url} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button onClick={() => deleteSliderImg(img.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">Delete</button>
                   </div>
                </div>
              ))}
           </div>
           <button onClick={() => onUpdateConfig(configForm)} className="px-8 py-3 text-white font-black rounded-xl shadow-lg hover:opacity-90" style={{ backgroundColor: siteConfig.primaryColor }}>Save Slider Changes</button>
        </div>
      )}

      {/* MODALS */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] p-10 space-y-6 shadow-2xl animate-in zoom-in duration-200 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
             <h3 className="text-2xl font-black text-gray-900 dark:text-white border-b dark:border-gray-800 pb-4">Edit Project Entry</h3>
             <form onSubmit={handleSaveProject} className="space-y-6">
                <div>
                   <label className={labelClass} htmlFor="proj-name">{language === 'EN' ? 'Project Name' : 'اسم المشروع'}</label>
                   <input id="proj-name" className={inputClass} value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className={labelClass} htmlFor="proj-status">{t.status}</label>
                      <select id="proj-status" className={inputClass} value={editingProject.status} onChange={e => setEditingProject({...editingProject, status: e.target.value as any})}>
                        <option value="ACTIVE">Active</option>
                        <option value="EMERGING">Emerging</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                      </select>
                   </div>
                   <div>
                      <label className={labelClass} htmlFor="proj-sales">{t.totalSales}</label>
                      <input id="proj-sales" type="number" className={inputClass} value={editingProject.totalSales} onChange={e => setEditingProject({...editingProject, totalSales: Number(e.target.value)})} />
                   </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="proj-desc">{t.projectDescription}</label>
                  <textarea id="proj-desc" rows={5} className={inputClass} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} />
                </div>
                <div className="flex gap-4">
                   <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-grow bg-gray-100 dark:bg-gray-800 py-4 rounded-2xl font-black text-gray-700 dark:text-gray-300">Cancel</button>
                   <button type="submit" className="flex-grow bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg">Save Project</button>
                </div>
             </form>
           </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[210] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-10 space-y-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-200 transition-colors">
             <h3 className="text-xl font-black text-gray-900 dark:text-white border-b dark:border-gray-800 pb-4">{editingUser ? 'Edit User' : 'New User Account'}</h3>
             <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="u-name">Full Name</label>
                  <input id="u-name" placeholder="Full Name" className={inputClass} value={userForm.name || ''} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="u-email">{t.emailAddress}</label>
                  <input id="u-email" placeholder="Email Address" type="email" className={inputClass} value={userForm.email || ''} onChange={e => setUserForm({...userForm, email: e.target.value})} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="u-role">{t.role}</label>
                  <select id="u-role" className={inputClass} value={userForm.role || 'VIEWER'} onChange={e => setUserForm({...userForm, role: e.target.value as any})}>
                    <option value="VIEWER">Viewer Access</option>
                    <option value="BENEFICIARY">Beneficiary Owner</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
                {userForm.role === 'ADMIN' && (
                  <div>
                    <label className={labelClass} htmlFor="u-perm">{t.permissions}</label>
                    <select id="u-perm" className={inputClass} value={userForm.adminPermission || 'MODERATOR'} onChange={e => setUserForm({...userForm, adminPermission: e.target.value as any})}>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="MODERATOR">Moderator</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-grow bg-gray-100 dark:bg-gray-800 py-3 rounded-xl font-bold dark:text-white">Cancel</button>
                  <button type="submit" className="flex-grow bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl font-black shadow-lg">Confirm</button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
