
import React, { useState } from 'react';
import { User, InternalOffer } from '../types';
import { MOCK_PROJECTS } from '../mockData';
import { UI_STRINGS } from '../constants';

const B2BNetwork: React.FC<{ user: User, language: 'EN' | 'AR', posts: InternalOffer[] }> = ({ user, language, posts }) => {
  const [filter, setFilter] = useState<'ALL' | 'OFFER' | 'REQUEST' | 'EXPERIENCE'>('ALL');
  const t = UI_STRINGS[language];

  const filteredNetwork = posts.filter(item => {
    if (filter === 'ALL') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-8 pb-20 transition-colors">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.networkTitle}</h1>
          <p className="text-gray-500 dark:text-gray-400">{language === 'EN' ? 'Collaborate, share knowledge, and grow together.' : 'تعاون وشارك المعرفة وانمو معنا.'}</p>
        </div>
      </header>

      {/* Quick Action Box */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm flex items-center gap-4 transition-colors">
         <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shrink-0 transition-colors">
           {user.name.charAt(0)}
         </div>
         <div className="flex-grow bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-gray-400 dark:text-gray-500 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900">
           {language === 'EN' ? `What's on your mind, ${user.name}? Share an idea or experience...` : `بماذا تفكر يا ${user.name}؟ شارك فكرة أو خبرة...`}
         </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.filter}</h3>
            <div className="space-y-1">
              {[
                { id: 'ALL', label: language === 'EN' ? 'All Activity' : 'كل النشاطات', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></svg> },
                { id: 'EXPERIENCE', label: language === 'EN' ? 'Experience Shares' : 'مشاركة الخبرات', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/></svg> },
                { id: 'OFFER', label: language === 'EN' ? 'Products & Services' : 'المنتجات والخدمات', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> },
                { id: 'REQUEST', label: language === 'EN' ? 'Collab Requests' : 'طلبات التعاون', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              ].map(btn => (
                <button 
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 ${filter === btn.id ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-100 dark:shadow-none scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-800 p-8 rounded-3xl text-white shadow-xl shadow-green-100 dark:shadow-none transition-colors">
            <h3 className="font-black text-lg mb-2">{language === 'EN' ? 'Knowledge is Power' : 'المعرفة قوة'}</h3>
            <p className="text-sm opacity-90 leading-relaxed">{language === 'EN' ? 'Share your success stories and lessons learned to help other beneficiaries thrive.' : 'شارك قصص نجاحك والدروس المستفادة لمساعدة المستفيدين الآخرين على الازدهار.'}</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {filteredNetwork.length > 0 ? (
            [...filteredNetwork].reverse().map(item => { // Show newest first
              const project = MOCK_PROJECTS.find(p => p.id === item.fromId);
              const isExperience = item.type === 'EXPERIENCE';
              
              return (
                <div key={item.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border dark:border-gray-800 shadow-sm space-y-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl overflow-hidden border dark:border-gray-700 shadow-sm">
                         <img src={project?.imageUrl} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <h4 className="font-black text-gray-900 dark:text-white transition-colors">{project?.name}</h4>
                         <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{item.date} • {project?.location}</p>
                       </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full transition-colors ${
                      item.type === 'EXPERIENCE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border dark:border-green-900/50' : 
                      item.type === 'OFFER' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border dark:border-blue-900/50' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border dark:border-orange-900/50'
                    }`}>
                      {item.type === 'EXPERIENCE' ? (language === 'EN' ? 'KNOWLEDGE' : 'خبرة') : 
                       item.type === 'OFFER' ? (language === 'EN' ? 'OFFER' : 'عرض') : (language === 'EN' ? 'REQUEST' : 'طلب')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{item.title}</h3>
                    <p className={`text-gray-600 dark:text-gray-400 leading-relaxed transition-colors ${isExperience ? 'text-lg italic font-medium' : 'text-sm'}`}>
                      {item.description}
                    </p>
                  </div>

                  {item.media && item.media.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {item.media.map((m, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border dark:border-gray-800 bg-black aspect-video sm:aspect-square">
                          {m.type === 'IMAGE' ? (
                            <img src={m.url} className="w-full h-full object-cover" />
                          ) : (
                            <video src={m.url} controls className="w-full h-full object-contain" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-6 border-t dark:border-gray-800 mt-4 transition-colors">
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                      {language === 'EN' ? 'Helpful' : 'مفيد'}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {language === 'EN' ? 'Comment' : 'تعليق'}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                      {language === 'EN' ? 'Contact' : 'تواصل'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-900 rounded-3xl border border-dashed dark:border-gray-800 transition-colors">
              {language === 'EN' ? 'No activity found in this category.' : 'لم يتم العثور على نشاط في هذه الفئة.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2BNetwork;
