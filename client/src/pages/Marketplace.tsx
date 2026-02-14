
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, Product, SiteConfig } from '../types';
import { UI_STRINGS, CATEGORY_LABELS, LOCATION_LABELS, LOCATIONS, SECTORS } from '../constants';

const Marketplace: React.FC<{ 
  language: 'EN' | 'AR', 
  config: SiteConfig, 
  projects: Project[], 
  hasNewAcademyContent?: boolean,
  onClearAlert?: () => void
}> = ({ language, config, projects, hasNewAcademyContent, onClearAlert }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  const t = UI_STRINGS[language];

  // Slider Logic
  const activeSlides = useMemo(() => config.heroSlider.filter(s => s.active).sort((a,b) => a.order - b.order), [config.heroSlider]);
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => setActiveSlide(s => (s + 1) % activeSlides.length), 5000);
    return () => clearInterval(interval);
  }, [activeSlides]);

  const isSearchActive = search.trim() !== '';
  const isCategoryActive = categoryFilter !== 'All';
  const isLocationActive = locationFilter !== 'All';

  // Strict Home Page Logic:
  // - Search/Category = PRODUCTS ONLY
  // - Location filter = STORES ONLY
  const mode: 'PRODUCTS' | 'BUSINESSES' = (isSearchActive || isCategoryActive) ? 'PRODUCTS' : 'BUSINESSES';

  const filteredProducts = useMemo(() => {
    const allProds = projects.flatMap(proj => 
      proj.products.map(prod => ({ ...prod, businessName: proj.name, businessLocation: proj.location, businessId: proj.id }))
    );
    return allProds.filter(p => {
      const matchesSearch = isSearchActive ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
      const matchesCategory = isCategoryActive ? p.category === categoryFilter : true;
      const matchesLocation = isLocationActive ? p.businessLocation === locationFilter : true;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [projects, search, categoryFilter, locationFilter, isSearchActive, isCategoryActive, isLocationActive]);

  const filteredBusinesses = useMemo(() => {
    return projects.filter(p => {
      const matchesLocation = isLocationActive ? p.location === locationFilter : true;
      const matchesSearch = isSearchActive ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
      return matchesLocation && matchesSearch;
    });
  }, [projects, locationFilter, isLocationActive, isSearchActive, search]);

  const getLocalizedCategory = (cat: string) => CATEGORY_LABELS[cat]?.[language] || cat;
  const getLocalizedLocation = (loc: string) => LOCATION_LABELS[loc]?.[language] || loc;

  return (
    <div className="space-y-12 pb-20 transition-colors">
      {/* Academy Alert Notification */}
      {hasNewAcademyContent && (
        <div className="bg-blue-600 text-white px-4 py-3 rounded-xl flex justify-between items-center shadow-lg animate-in slide-in-from-top duration-500 z-[60] sticky top-20">
           <div className="flex items-center gap-3">
             <span className="text-xl">🎓</span>
             <p className="font-bold text-xs md:text-sm">{t.newAcademyAlert}</p>
           </div>
           <div className="flex gap-3">
             <Link to="/academy" onClick={onClearAlert} className="bg-white text-blue-600 px-3 py-1 rounded-lg font-black text-[10px] hover:bg-gray-100 transition">VIEW</Link>
             <button onClick={onClearAlert} className="text-white">✕</button>
           </div>
        </div>
      )}

      {/* Hero Slider with Dynamic Branding */}
      {config.showHeroSlider && activeSlides.length > 0 && (
        <div className="relative h-[300px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 dark:border-gray-800 transition-colors">
           {activeSlides.map((slide, idx) => (
             <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
               <img src={slide.url} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-20 text-white">
                  <h2 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 tracking-tight leading-tight">{config.headerTitle}</h2>
                  <p className="text-sm md:text-2xl opacity-90 font-medium max-w-2xl line-clamp-2 md:line-clamp-none">{config.subtitle}</p>
               </div>
             </div>
           ))}
           {activeSlides.length > 1 && (
             <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {activeSlides.map((_, i) => (
                  <div key={i} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === activeSlide ? 'bg-white scale-125' : 'bg-white/40'}`}></div>
                ))}
             </div>
           )}
        </div>
      )}

      {/* Modern Search & Filters - HIGH CONTRAST */}
      <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 max-w-5xl mx-auto -mt-6 md:-mt-10 relative z-10 transition-colors">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input 
            type="text" 
            placeholder={t.search} 
            className="w-full pl-14 pr-6 py-3 md:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none text-black dark:text-white font-black placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-colors" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 md:gap-4">
          <select 
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl md:rounded-3xl px-4 md:px-8 py-3 md:py-4 font-black outline-none cursor-pointer text-black dark:text-white shadow-sm text-[10px] md:text-base transition-colors" 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">{t.all} {t.location}</option>
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{getLocalizedLocation(loc)}</option>)}
          </select>
          <select 
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl md:rounded-3xl px-4 md:px-8 py-3 md:py-4 font-black outline-none cursor-pointer text-black dark:text-white shadow-sm text-[10px] md:text-base transition-colors" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">{t.all} {t.sector}</option>
            {SECTORS.map(cat => <option key={cat} value={cat}>{getLocalizedCategory(cat)}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-2 md:px-4 transition-colors">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] md:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {mode === 'PRODUCTS' ? (language === 'EN' ? 'Products Feed' : 'خلاصة المنتجات') : (language === 'EN' ? 'Partner Businesses' : 'المشاريع الشريكة')}
          </h2>
          <div className="h-px flex-grow bg-gray-200 dark:bg-gray-800"></div>
        </div>

        {mode === 'PRODUCTS' ? (
            <div className={`grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8 ${language === 'AR' ? 'rtl' : 'ltr'}`}>
            {filteredProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group bg-white dark:bg-gray-900 rounded-xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-none transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-1 right-1 md:top-4 md:right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-1.5 md:px-4 py-0.5 md:py-2 rounded-md md:rounded-2xl text-[8px] md:text-sm font-black shadow-lg text-blue-600 dark:text-blue-400 border border-blue-50 dark:border-gray-700">
                    {p.price}{p.currency}
                  </div>
                </div>
                <div className="p-2 md:p-8 space-y-0.5 md:space-y-2">
                  <div className="text-[6px] md:text-[10px] font-black uppercase tracking-widest text-blue-400 dark:text-blue-500 line-clamp-1">{getLocalizedCategory(p.category)}</div>
                  <h3 className="text-[10px] md:text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-1">{p.name}</h3>
                  <div className="pt-1 md:pt-4 flex items-center gap-1 md:gap-2 text-[6px] md:text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter line-clamp-1">
                    📍 {getLocalizedLocation(p.businessLocation)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-10 ${language === 'AR' ? 'rtl' : 'ltr'}`}>
            {filteredBusinesses.map(proj => (
              <Link key={proj.id} to={`/project/${proj.id}`} className="group bg-white dark:bg-gray-900 rounded-xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-none transition-all duration-500">
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={proj.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-1 right-1 bg-white/95 dark:bg-gray-900/95 px-1 md:px-4 py-0.5 md:py-2 rounded md:rounded-2xl text-[8px] md:text-sm font-black shadow-lg text-blue-600 dark:text-blue-400 border border-blue-50 dark:border-gray-700">
                    {proj.rating}⭐
                  </div>
                </div>
                <div className="p-2 md:p-8 space-y-0.5 md:space-y-2">
                  <div className="text-[6px] md:text-[10px] font-black uppercase tracking-widest text-blue-400 dark:text-blue-500">{getLocalizedCategory(proj.category)}</div>
                  <h3 className="text-[10px] md:text-2xl font-black text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                  <div className="pt-1 md:pt-4 flex items-center gap-1 md:gap-2 text-[6px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">
                    📍 {getLocalizedLocation(proj.location)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {(mode === 'PRODUCTS' ? filteredProducts : filteredBusinesses).length === 0 && (
          <div className="text-center py-20 md:py-40">
             <div className="text-5xl mb-4">🔍</div>
             <h3 className="text-lg md:text-xl font-bold text-gray-400 dark:text-gray-500">{mode === 'PRODUCTS' ? t.noProducts : t.noBusinesses}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
