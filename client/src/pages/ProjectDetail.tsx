
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UI_STRINGS, SECTORS, CATEGORY_LABELS, CURRENCY_LABELS } from '../constants';
import { Product, Project, InternalOffer, User } from '../types';

const ProjectDetail: React.FC<{ 
  language: 'EN' | 'AR', 
  projects: Project[], 
  posts: InternalOffer[],
  currentUser: User | null,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setNetworkPosts: React.Dispatch<React.SetStateAction<InternalOffer[]>>
}> = ({ language, projects, posts, currentUser, setProjects, setNetworkPosts }) => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const t = UI_STRINGS[language];
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'POSTS'>('PRODUCTS');
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({ currency: 'USD' });

  // Smart Category Inheritance
  useEffect(() => {
    if (isProductModalOpen && project) {
      setProductForm(prev => ({ ...prev, category: project.category }));
    }
  }, [isProductModalOpen, project]);

  if (!project) return <div className="text-center py-20 dark:text-gray-400">Project not found.</div>;

  const isOwner = currentUser?.role === 'BENEFICIARY' && currentUser?.beneficiaryId === project.id;
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `pr-${Date.now()}`,
      name: productForm.name || '',
      description: productForm.description || '',
      price: Number(productForm.price) || 0,
      currency: productForm.currency || 'USD',
      category: productForm.category || project.category,
      features: [],
      images: productForm.images?.length ? productForm.images : ['https://picsum.photos/seed/prod/400/400'],
      salesCount: 0,
      stockStatus: 'IN_STOCK',
      isPublished: true
    };
    
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, products: [...p.products, newProd] } : p));
    setIsProductModalOpen(false);
    alert(language === 'EN' ? 'Product added!' : 'تم إضافة المنتج!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.name,
        text: project.description,
        url: window.location.href,
      }).catch(err => {
        console.error("Sharing failed", err);
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  const getLocalizedCategory = (cat: string) => CATEGORY_LABELS[cat]?.[language] || cat;
  const inputClass = "w-full border p-4 rounded-2xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-700 transition-colors";

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-2 md:px-0 transition-colors">
      <nav className="flex justify-between items-center text-xs md:text-sm">
        <div className="flex gap-2 text-gray-400 dark:text-gray-500 font-bold">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{t.marketplace}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white line-clamp-1">{project.name}</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl font-bold border border-gray-200 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            {t.share}
          </button>
          {isOwner && (
            <button 
              onClick={() => setIsProductModalOpen(true)}
              className="bg-blue-600 dark:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105 transition flex items-center gap-1 md:gap-2 text-xs md:text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg>
              {language === 'EN' ? 'Add Product' : 'إضافة منتج'}
            </button>
          )}
        </div>
      </nav>

      {/* World-Class Share Menu Modal */}
      {isShareMenuOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsShareMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 w-full max-w-md shadow-2xl animate-in zoom-in duration-300 border border-gray-100 dark:border-gray-800 text-center">
            <button onClick={() => setIsShareMenuOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.share}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">{project.name}</p>
            
            {/* Dynamic QR Code Mockup - Modern Styling */}
            <div className="mx-auto w-56 h-56 bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-700 shadow-xl mb-10 flex items-center justify-center relative overflow-hidden group">
              <div className="grid grid-cols-12 gap-0.5 w-full h-full opacity-90 p-2">
                {[...Array(144)].map((_, i) => (
                  <div key={i} className={`${(i * i + i % 5) % 3 === 0 ? 'bg-black dark:bg-blue-400' : 'bg-transparent'} rounded-[1px]`}></div>
                ))}
              </div>
              {/* Logo Badge in center of QR */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 w-16 h-16 flex items-center justify-center overflow-hidden">
                    <img src={project.logoUrl || project.imageUrl} className="w-full h-full object-cover rounded-lg" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button onClick={handleNativeShare} className="w-full bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition flex items-center justify-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                 {language === 'EN' ? 'Share to Apps' : 'مشاركة عبر التطبيقات'}
               </button>
               
               <button onClick={handleCopyLink} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-4 rounded-[1.5rem] font-black text-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center gap-3">
                 {copied ? (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                     <span className="text-green-600 dark:text-green-400">{t.copied}</span>
                   </>
                 ) : (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                     {t.copyLink}
                   </>
                 )}
               </button>
            </div>
            
            <p className="mt-8 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{t.qrCode}</p>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative group rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        {/* Cover Photo Banner */}
        <div className="h-40 md:h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {project.coverUrl ? (
            <img src={project.coverUrl} className="w-full h-full object-cover" alt="Store Cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
               <span className="text-blue-200 dark:text-gray-700 text-6xl">🖼️</span>
            </div>
          )}
        </div>
        
        {/* Profile Info Overlay */}
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end -mt-12 md:-mt-20 relative z-10">
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl flex-shrink-0 bg-white dark:bg-gray-800 transition-transform hover:scale-105 duration-500">
            <img src={project.logoUrl || project.imageUrl} className="w-full h-full object-cover" alt="Store Logo" />
          </div>
          <div className="flex-grow text-center md:text-left space-y-2 pb-2">
            <div className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-2">
              <span className={`px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${project.status === 'ACTIVE' ? 'bg-green-600 dark:bg-green-700' : 'bg-blue-600 dark:bg-blue-700'} text-white`}>{project.status}</span>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-700">{getLocalizedCategory(project.category)}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">{project.name}</h1>
            {project.subtitle && <p className="text-sm md:text-xl text-blue-600 dark:text-blue-400 font-bold italic tracking-tight">{project.subtitle}</p>}
          </div>
        </div>
        
        {/* Description */}
        <div className="px-6 md:px-10 pb-10">
          <p className="text-gray-500 dark:text-gray-400 max-w-3xl text-sm md:text-lg leading-relaxed">{project.description}</p>
        </div>
      </div>

      {/* 3-Column Mobile Grid for Products */}
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
        {project.products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="bg-white dark:bg-gray-900 rounded-xl md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col hover:shadow-xl dark:hover:shadow-none transition-all duration-500 group">
             <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-1 right-1 md:top-4 md:right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-1.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-full font-black text-blue-600 dark:text-blue-400 shadow-xl border border-blue-50 dark:border-gray-700 text-[8px] md:text-sm">
                  {product.price}{product.currency}
                </div>
             </div>
             <div className="p-2 md:p-8 flex-grow space-y-1 md:space-y-4">
                <div className="text-[6px] md:text-[10px] font-black uppercase text-blue-400 dark:text-blue-500 tracking-widest line-clamp-1">{getLocalizedCategory(product.category)}</div>
                <h3 className="text-[10px] md:text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
                <button className="hidden md:block w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-2xl font-black shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 transition">Order Now</button>
             </div>
          </Link>
        ))}
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] p-10 space-y-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white border-b dark:border-gray-800 pb-4">{language === 'EN' ? 'Add New Product' : 'إضافة منتج جديد'}</h3>
            <form onSubmit={handleAddProduct} className="space-y-5">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-gray-400" htmlFor="p-name">{t.productName}</label>
                 <input id="p-name" required className={inputClass} value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="Premium Product..." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-gray-400" htmlFor="p-price">{t.price}</label>
                   <input id="p-price" type="number" step="any" required className={inputClass} value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} placeholder="0.00" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-gray-400" htmlFor="p-curr">{t.currency}</label>
                   <select id="p-curr" className={inputClass} value={productForm.currency} onChange={e => setProductForm({...productForm, currency: e.target.value})}>
                     <option value="USD">USD</option>
                     <option value="SYP">SYP</option>
                     <option value="TRY">TRY</option>
                     <option value="NEW">Add New...</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-gray-400" htmlFor="p-sec">{t.sector}</label>
                 <input id="p-sec" className={inputClass} value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} placeholder={t.categoryInherited} />
               </div>
               <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-grow bg-gray-100 dark:bg-gray-800 py-4 rounded-2xl font-black text-gray-700 dark:text-gray-300">Cancel</button>
                 <button type="submit" className="flex-grow bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg">
                   {t.save}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
