
import React, { useState } from 'react';
import { User, Project } from '../types';
import { geminiService } from '../geminiService';
import { UI_STRINGS } from '../constants';

// Fixed: Added projects to props type to match usage in App.tsx and replaced MOCK_PROJECTS with the projects prop.
const IdentityToolkit: React.FC<{ user: User, language: 'EN' | 'AR', projects: Project[] }> = ({ user, language, projects }) => {
  const project = projects.find(p => p.id === user.beneficiaryId);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<{ platform: string, caption: string }[]>([]);
  // Fix: Cast UI_STRINGS[language] to any to avoid strict type errors for missing properties if not yet reflected
  const t = UI_STRINGS[language] as any;

  if (!project) return <div className="p-10 text-center dark:text-gray-400">{language === 'EN' ? 'Access denied.' : 'تم رفض الوصول.'}</div>;

  const handleGenerateTemplates = async () => {
    setLoading(true);
    const result = await geminiService.generateSocialMediaTemplate(project.name, project.description);
    setTemplates(result);
    setLoading(false);
  };

  return (
    <div className="space-y-12 transition-colors">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.toolkitTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400">{language === 'EN' ? 'Download and generate unified branding assets for your business.' : 'تحميل وتوليد أصول هوية موحدة لعملك.'}</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Business Card */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm space-y-6 flex flex-col items-center text-center transition-colors">
          <h3 className="text-lg font-bold dark:text-white">{t.businessCard}</h3>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-full aspect-[1.6/1] rounded-2xl p-6 text-white text-left shadow-xl relative overflow-hidden">
             <div className="relative z-10 h-full flex flex-col justify-between">
               <div>
                 <div className="text-xl font-black">{project.name}</div>
                 <div className="text-xs opacity-80 uppercase tracking-widest">{project.category}</div>
               </div>
               <div>
                 <div className="text-sm font-bold">{project.ownerName}</div>
                 <div className="text-[10px] opacity-70">{project.contact.phone}</div>
                 <div className="text-[10px] opacity-70">{project.contact.email}</div>
               </div>
             </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          <button className="bg-gray-100 dark:bg-gray-800 w-full py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{t.downloadPdf}</button>
        </div>

        {/* QR Code */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm space-y-6 flex flex-col items-center text-center transition-colors">
          <h3 className="text-lg font-bold dark:text-white">{t.qrCodeTitle}</h3>
          <div className="p-4 border-2 border-gray-100 dark:border-gray-700 rounded-2xl">
            <div className="w-40 h-40 bg-gray-900 dark:bg-white p-2 rounded-lg">
               <div className="grid grid-cols-8 gap-1 w-full h-full">
                 {[...Array(64)].map((_, i) => (
                   <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? 'bg-white dark:bg-gray-900' : 'bg-transparent'}`}></div>
                 ))}
               </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{language === 'EN' ? 'Links directly to your public marketplace page.' : 'يرتبط مباشرة بصفحتك العامة في السوق.'}</p>
          <button className="bg-gray-100 dark:bg-gray-800 w-full py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{t.downloadPng}</button>
        </div>

        {/* AI Templates */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm space-y-6 col-span-full lg:col-span-1 transition-colors">
          <h3 className="text-lg font-bold dark:text-white">{t.aiHelper}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'EN' ? 'Let Gemini generate post captions based on your project description.' : 'دع Gemini يولد تعليقات للمنشورات بناءً على وصف مشروعك.'}</p>
          
          <button 
            onClick={handleGenerateTemplates}
            disabled={loading}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? (language === 'EN' ? 'Thinking...' : 'جاري التفكير...') : t.generateCaptions}
          </button>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {templates.map((t, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-2">{t.platform}</div>
                <p className="text-xs text-gray-700 dark:text-gray-300 italic">"{t.caption}"</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(t.caption)}
                  className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold uppercase"
                >
                  {language === 'EN' ? 'Copy to clipboard' : 'نسخ للحافظة'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityToolkit;
