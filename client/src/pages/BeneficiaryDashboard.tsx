
import React, { useState, useRef } from 'react';
import { User, Project, Product } from '../types';
import { UI_STRINGS, SECTORS, CATEGORY_LABELS, CURRENCY_LABELS } from '../constants';
import { Link } from 'react-router-dom';

const BeneficiaryDashboard: React.FC<{ 
  user: User, 
  language: 'EN' | 'AR', 
  projects: Project[], 
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setNetworkPosts: any
}> = ({ user, language, projects, setProjects }) => {
  const project = projects.find(p => p.id === user.beneficiaryId);
  const t = UI_STRINGS[language];
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  // Store Profile States
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    name: project?.name || '',
    subtitle: project?.subtitle || '',
    description: project?.description || '',
    category: project?.category || SECTORS[0],
    location: project?.location || '',
    logoUrl: project?.logoUrl || '',
    coverUrl: project?.coverUrl || '',
    storeStatus: project?.storeStatus || 'OPEN',
    operatingHours: project?.operatingHours || { start: '08:00', end: '22:00' },
    contact: project?.contact || { whatsapp: '', phone: '', email: '' },
    detailedLocation: project?.detailedLocation || { province: '', city: '', village: '', neighborhood: '', street: '', landmark: '', coordinates: { lat: 0, lng: 0 } }
  });

  // Product CRUD States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    category: project?.category || SECTORS[0],
    stockStatus: 'IN_STOCK',
    quantity: 0,
    isPublished: true,
    images: [''],
    specifications: []
  });

  if (!project) return <div className="p-20 text-center font-bold text-gray-400 dark:text-gray-500">Project Not Found</div>;

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...detailsForm } : p));
    setIsDetailsModalOpen(false);
    alert(language === 'EN' ? 'Store Branding Updated!' : 'تم تحديث هوية المتجر!');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedForm = { ...productForm, images: productForm.images?.filter(img => img.trim() !== '') || [] };
    
    if (editingProduct) {
      setProjects(prev => prev.map(p => p.id === project.id ? {
        ...p,
        products: p.products.map(pr => pr.id === editingProduct.id ? { ...pr, ...updatedForm } as Product : pr)
      } : p));
    } else {
      const newProd: Product = {
        ...updatedForm,
        id: `pr-${Date.now()}`,
        salesCount: 0,
        features: [],
        stockStatus: productForm.stockStatus || 'IN_STOCK',
        isPublished: productForm.isPublished !== undefined ? productForm.isPublished : true,
        images: updatedForm.images.length > 0 ? updatedForm.images : ['https://picsum.photos/seed/prod/400/400']
      } as Product;
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, products: [...p.products, newProd] } : p));
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(language === 'EN' ? 'Delete this product?' : 'هل تريد حذف هذا المنتج؟')) {
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, products: p.products.filter(pr => pr.id !== id) } : p));
    }
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm(prod);
    setIsProductModalOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDetailsForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDetailsForm(prev => ({ ...prev, coverUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...(productForm.images || [])];
        newImages[index] = reader.result as string;
        setProductForm(prev => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setProductForm(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = (productForm.images || []).filter((_, i) => i !== index);
    setProductForm(prev => ({ ...prev, images: newImages }));
  };

  const addSpec = () => {
    setProductForm(prev => ({ ...prev, specifications: [...(prev.specifications || []), { label: '', value: '' }] }));
  };

  const updateSpec = (index: number, field: 'label' | 'value', val: string) => {
    const newSpecs = [...(productForm.specifications || [])];
    newSpecs[index] = { ...newSpecs[index], [field]: val };
    setProductForm(prev => ({ ...prev, specifications: newSpecs }));
  };

  const inputClass = "w-full border border-gray-200 dark:border-gray-700 p-4 rounded-2xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder-gray-400 dark:placeholder-gray-500 transition-all";
  const labelClass = "block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t.welcome}, {user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{language === 'EN' ? 'Control panel for' : 'لوحة التحكم لـ'} <span className="text-blue-600 dark:text-blue-400 font-bold">{project.name}</span></p>
        </div>
        <div className="flex flex-wrap gap-3">
           <button onClick={() => setIsDetailsModalOpen(true)} className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-2xl font-black border border-blue-100 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 transition shadow-sm">
             {t.editProfile}
           </button>
           <Link to={`/project/${project.id}`} className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100 dark:shadow-none hover:scale-105 transition flex items-center gap-2">
             {t.viewPublic}
           </Link>
        </div>
      </header>

      {/* Product Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
           <h2 className="text-2xl font-black text-gray-900 dark:text-white">{language === 'EN' ? 'Product Catalog' : 'كتالوج المنتجات'}</h2>
           <button 
             onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, currency: 'USD', category: project.category, stockStatus: 'IN_STOCK', quantity: 0, isPublished: true, images: [''], specifications: [] }); setIsProductModalOpen(true); }} 
             className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-50 dark:shadow-none flex items-center gap-2 hover:opacity-90 transition"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
             {t.addNew}
           </button>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-8">
           {project.products.map(pr => (
             <div key={pr.id} className={`bg-white dark:bg-gray-900 rounded-[1.5rem] border ${pr.isPublished ? 'border-gray-100 dark:border-gray-800' : 'border-red-200 dark:border-red-900/50 opacity-80'} shadow-sm overflow-hidden flex flex-col group`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <img src={pr.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  {!pr.isPublished && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <span className="text-white font-black text-[8px] uppercase">{language === 'EN' ? 'Draft' : 'مسودة'}</span>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 bg-white/95 dark:bg-gray-900/95 px-1.5 py-0.5 rounded text-[8px] font-black text-blue-600 dark:text-blue-400 shadow-sm">
                    {pr.price}{pr.currency}
                  </div>
                </div>
                <div className="p-2 space-y-2 flex-grow">
                   <h4 className="font-black text-gray-900 dark:text-white truncate text-[10px] md:text-sm">{pr.name}</h4>
                   <div className="flex gap-1">
                      <button onClick={() => openEditProduct(pr)} className="flex-grow bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white transition">{t.edit}</button>
                      <button onClick={() => handleDeleteProduct(pr.id)} className="px-2 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 py-1.5 rounded-lg text-[8px] font-black hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition">
                         🗑️
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* PRODUCT MODAL - DETAILED FORM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[220] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-2xl animate-in zoom-in duration-200 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-4">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingProduct ? t.edit : t.addNew}</h3>
               <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 text-2xl">✕</button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                      <label className={labelClass} htmlFor="prod-name">{t.productName}</label>
                      <input id="prod-name" required className={inputClass} value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="prod-cat">{t.sector}</label>
                      <select id="prod-cat" className={inputClass} value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                        {SECTORS.map(s => <option key={s} value={s}>{CATEGORY_LABELS[s][language]}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className={labelClass} htmlFor="prod-price">{t.price}</label>
                         <input id="prod-price" type="number" step="any" required className={inputClass} value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                       </div>
                       <div>
                         <label className={labelClass} htmlFor="prod-curr">{t.currency}</label>
                         <select id="prod-curr" className={inputClass} value={productForm.currency} onChange={e => setProductForm({...productForm, currency: e.target.value})}>
                           {Object.keys(CURRENCY_LABELS).map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                      <label className={labelClass} htmlFor="prod-stock">{t.stockStatus}</label>
                      <select id="prod-stock" className={inputClass} value={productForm.stockStatus} onChange={e => setProductForm({...productForm, stockStatus: e.target.value as any})}>
                        <option value="IN_STOCK">{t.inStock}</option>
                        <option value="OUT_OF_STOCK">{t.outOfStock}</option>
                        <option value="LIMITED">{t.limited}</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="prod-qty">{t.quantity}</label>
                      <input id="prod-qty" type="number" className={inputClass} value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: Number(e.target.value)})} />
                    </div>
                    <div className="flex items-center gap-4 py-4">
                       <label className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase cursor-pointer flex items-center gap-3">
                         <input type="checkbox" className="w-6 h-6 rounded-md accent-blue-600" checked={productForm.isPublished} onChange={e => setProductForm({...productForm, isPublished: e.target.checked})} />
                         {t.isPublished}
                       </label>
                    </div>
                 </div>
               </div>

               <div>
                 <label className={labelClass} htmlFor="prod-desc">{t.productDescription}</label>
                 <textarea id="prod-desc" rows={4} className={inputClass} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
               </div>

               <div>
                 <label className={labelClass}>{t.productGallery}</label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {(productForm.images || []).map((img, idx) => (
                     <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 group flex items-center justify-center">
                        {img ? (
                          <>
                            <img src={img} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImageField(idx)} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">✕</button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-2">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              id={`prod-img-${idx}`}
                              onChange={(e) => handleProductImageUpload(e, idx)}
                            />
                            <button type="button" onClick={() => document.getElementById(`prod-img-${idx}`)?.click()} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase text-center">
                              {t.uploadImage}
                            </button>
                          </div>
                        )}
                     </div>
                   ))}
                   <button type="button" onClick={addImageField} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                     <span className="text-2xl text-gray-400">+</span>
                   </button>
                 </div>
               </div>

               <div>
                 <label className={labelClass}>{t.specifications}</label>
                 <div className="space-y-3">
                   {(productForm.specifications || []).map((spec, idx) => (
                     <div key={idx} className="grid grid-cols-2 gap-2 relative">
                        <input className={inputClass} placeholder="Label (e.g. Weight)" value={spec.label} onChange={e => updateSpec(idx, 'label', e.target.value)} />
                        <input className={inputClass} placeholder="Value (e.g. 500g)" value={spec.value} onChange={e => updateSpec(idx, 'value', e.target.value)} />
                     </div>
                   ))}
                   <button type="button" onClick={addSpec} className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase hover:underline">+ {t.addSpec}</button>
                 </div>
               </div>

               <div className="flex gap-4 pt-6 border-t dark:border-gray-800">
                 <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-grow bg-gray-100 dark:bg-gray-800 py-4 rounded-2xl font-black text-gray-700 dark:text-gray-300 transition">Cancel</button>
                 <button type="submit" className="flex-grow bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-2xl hover:bg-blue-700 transition">
                   {t.saveProduct}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* STORE BRANDING MODAL */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-[3rem] p-10 space-y-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t.editProfile}</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleSaveDetails} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-10">
                 <div>
                    <label className={labelClass}>{t.projectLogo}</label>
                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                       <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 border shadow-sm flex items-center justify-center overflow-hidden">
                         {detailsForm.logoUrl ? <img src={detailsForm.logoUrl} className="w-full h-full object-cover" /> : <span className="text-gray-200 text-3xl font-black">?</span>}
                       </div>
                       <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                       <button type="button" onClick={() => logoInputRef.current?.click()} className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-gray-100 dark:hover:bg-gray-600 transition uppercase dark:text-white">{t.uploadImage}</button>
                    </div>
                 </div>
                 <div>
                    <label className={labelClass}>{language === 'EN' ? 'Store Cover' : 'غلاف المتجر'}</label>
                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                       <div className="w-full h-20 rounded-2xl bg-white dark:bg-gray-900 border shadow-sm flex items-center justify-center overflow-hidden">
                         {detailsForm.coverUrl ? <img src={detailsForm.coverUrl} className="w-full h-full object-cover" /> : <span className="text-gray-200 text-3xl">🖼️</span>}
                       </div>
                       <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
                       <button type="button" onClick={() => coverInputRef.current?.click()} className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-gray-100 dark:hover:bg-gray-600 transition uppercase dark:text-white">{t.uploadImage}</button>
                    </div>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass} htmlFor="store-name">{t.businessName}</label>
                    <input id="store-name" required className={inputClass} value={detailsForm.name} onChange={e => setDetailsForm({...detailsForm, name: e.target.value})} />
                 </div>
                 <div>
                    <label className={labelClass} htmlFor="store-sub">{t.projectSubtitle}</label>
                    <input id="store-sub" className={inputClass} value={detailsForm.subtitle} onChange={e => setDetailsForm({...detailsForm, subtitle: e.target.value})} />
                 </div>
               </div>

               <div>
                 <label className={labelClass} htmlFor="store-desc">{t.projectDescription}</label>
                 <textarea id="store-desc" rows={3} className={inputClass} value={detailsForm.description} onChange={e => setDetailsForm({...detailsForm, description: e.target.value})} />
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass} htmlFor="store-wa">WhatsApp</label>
                    <input id="store-wa" className={inputClass} value={detailsForm.contact.whatsapp} onChange={e => setDetailsForm({...detailsForm, contact: {...detailsForm.contact, whatsapp: e.target.value}})} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="store-email">{t.emailAddress}</label>
                    <input id="store-email" className={inputClass} value={detailsForm.contact.email} onChange={e => setDetailsForm({...detailsForm, contact: {...detailsForm.contact, email: e.target.value}})} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="store-phone">{language === 'EN' ? 'Phone' : 'الهاتف'}</label>
                    <input id="store-phone" className={inputClass} value={detailsForm.contact.phone} onChange={e => setDetailsForm({...detailsForm, contact: {...detailsForm.contact, phone: e.target.value}})} />
                  </div>
               </div>

               <div className="flex gap-4 pt-6 border-t dark:border-gray-800">
                 <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="flex-grow bg-gray-100 dark:bg-gray-800 py-4 rounded-2xl font-black text-gray-700 dark:text-gray-300 transition">Cancel</button>
                 <button type="submit" className="flex-grow bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryDashboard;
