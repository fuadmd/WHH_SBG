
import React, { useState } from 'react';
import { Lesson } from '../types';
import { UI_STRINGS } from '../constants';

const Academy: React.FC<{ language: 'EN' | 'AR', lessons: Lesson[] }> = ({ language, lessons }) => {
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const t = UI_STRINGS[language];

  if (!activeLesson && lessons.length > 0) setActiveLesson(lessons[0]);

  const renderContent = () => {
    if (!activeLesson) return null;
    switch (activeLesson.type) {
      case 'VIDEO':
        return (
          <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl relative">
             <iframe 
               className="w-full h-full"
               src={activeLesson.content} 
               title={activeLesson.title} 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
             ></iframe>
          </div>
        );
      case 'IMAGE':
        return (
          <div className="rounded-2xl overflow-hidden shadow-lg border dark:border-gray-800">
            <img src={activeLesson.content} alt={activeLesson.title} className="w-full h-auto" />
          </div>
        );
      case 'TEXT':
        return (
          <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl border dark:border-gray-800 shadow-sm prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{activeLesson.content}</div>
          </div>
        );
      case 'FILE':
        return (
          <div className="bg-blue-50 dark:bg-blue-900/10 p-12 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center gap-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-blue-400 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{language === 'EN' ? 'Attached Document' : 'ملف مرفق'}</h4>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{language === 'EN' ? 'Click below to view or download the material.' : 'اضغط أدناه لعرض أو تحميل المادة التعليمية.'}</p>
            </div>
            <a href={activeLesson.content} target="_blank" rel="noopener noreferrer" className="bg-blue-600 dark:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition">
              {language === 'EN' ? 'View Document' : 'عرض المستند'}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 transition-colors">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.academy}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {language === 'EN' ? 'Enhance your business skills with bitesize lessons.' : 'عزز مهاراتك في العمل مع دروس مصغرة.'}
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border dark:border-gray-800 text-center shadow-sm">
            <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">{language === 'EN' ? 'Progress' : 'التقدم'}</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 transition-colors">65%</div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {renderContent()}
          {activeLesson && (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border dark:border-gray-800 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeLesson.title}</h2>
              <div className="flex gap-4 mt-2 mb-4">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-100 dark:border-blue-900/50">{activeLesson.category}</span>
                <span className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-100 dark:border-gray-700">{activeLesson.type}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">{activeLesson.description}</p>
              <div className="mt-8 pt-8 border-t dark:border-gray-800 flex justify-between items-center">
                <button className="bg-gray-100 dark:bg-gray-800 px-6 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">{language === 'EN' ? 'Completed' : 'مكتمل'}</button>
                <button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-lg shadow-blue-100 dark:shadow-none">{language === 'EN' ? 'Next' : 'التالي'}</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest pl-1">{language === 'EN' ? 'Lessons' : 'الدروس'}</h3>
          <div className="space-y-3">
            {lessons.map(lesson => (
              <button 
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex gap-3 p-3 rounded-xl border transition-all ${activeLesson?.id === lesson.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm'}`}
              >
                <div className="w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {lesson.thumbnail ? (
                    <img src={lesson.thumbnail} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-blue-200 dark:text-gray-700 font-black text-2xl uppercase">{lesson.type.charAt(0)}</div>
                  )}
                </div>
                <div className="overflow-hidden flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors">{lesson.title}</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase font-black">{lesson.type}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academy;
