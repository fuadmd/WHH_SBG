
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, Product } from '../types';
import { UI_STRINGS, CATEGORY_LABELS, LOCATION_LABELS } from '../constants';

const ProductDetailsPage: React.FC<{ language: 'EN' | 'AR', projects: Project[] }> = ({ language, projects }) => {
  const { productId } = useParams();
  const t = UI_STRINGS[language];

  // Flatten ALL products from ALL stores for global interaction
  const allProducts = useMemo(() => {
    return projects.flatMap(proj => 
      proj.products.map(prod => ({ 
        ...prod, 
        businessName: proj.name, 
        businessId: proj.id, 
        businessLocation: proj.location 
      }))
    );
  }, [projects]);

  const product = allProducts.find(p => p.id === productId);

  // Global Related Products (from any store)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.id !== product.id && (p.category === product.category || p.name.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 6);
  }, [product, allProducts]);

  if (!product) return <div className="text-center py-40 font-black text-gray-400 dark:text-gray-500">Product not found.</div>;

  const getLocalizedCategory = (cat: string) => CATEGORY_LABELS[cat]?.[language] || cat;
  const getLocalizedLocation = (loc: string) => LOCATION_LABELS[loc]?.[language] || loc;

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 md:px-0 transition-colors">
      <nav className="flex gap-2 text-gray-400 dark:text-gray-500 font-bold text-xs md:text-sm">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">{t.marketplace}</Link>
        <span>/</span>
        <Link to={`/project/${product.businessId}`} className="hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 transition">{product.businessName}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white line-clamp-1 transition-colors">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 bg-white dark:bg-gray-900 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden transition-colors">
        <div className="space-y-6">
           <div className="aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner bg-gray-50 dark:bg-gray-800">
             <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
           </div>
           {product.images.length > 1 && (
             <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
               {product.images.map((img, i) => (
                 <img key={i} src={img} className="w-20 md:w-24 h-20 md:h-24 rounded-2xl object-cover cursor-pointer border dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition" />
               ))}
             </div>
           )}
        </div>

        <div className="flex flex-col justify-center space-y-6 md:space-y-8">
           <div className="space-y-2">
             <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/50 transition-colors">
               {getLocalizedCategory(product.category)}
             </span>
             <h1 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight transition-colors">{product.name}</h1>
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-bold transition-colors">
               <span className="text-lg md:text-2xl">📍</span>
               <span className="text-sm md:text-lg">{getLocalizedLocation(product.businessLocation)} • {product.businessName}</span>
             </div>
           </div>

           <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t.price}</div>
              <div className="text-4xl md:text-6xl font-black text-blue-600 dark:text-blue-400 transition-colors">{product.price} <span className="text-2xl">{product.currency}</span></div>
           </div>

           <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white transition-colors">{t.details}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg leading-relaxed transition-colors">{product.description}</p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="flex-grow bg-blue-600 dark:bg-blue-700 text-white py-4 md:py-5 rounded-[2rem] font-black text-lg md:text-xl shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition">
                {language === 'EN' ? 'Purchase Now' : 'اطلب الآن'}
              </button>
              <Link to={`/project/${product.businessId}`} className="flex-grow bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 py-4 md:py-5 rounded-[2rem] font-black text-lg md:text-xl text-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                {language === 'EN' ? 'Visit Store' : 'زيارة المتجر'}
              </Link>
           </div>
        </div>
      </div>

      {/* Global Related Products Section - 3 Columns on Mobile */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
           <div className="flex items-center gap-6">
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white transition-colors">{language === 'EN' ? 'Related Products' : 'منتجات مشابهة'}</h2>
              <div className="h-px flex-grow bg-gray-200 dark:bg-gray-800"></div>
           </div>
           
           <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-8">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group bg-white dark:bg-gray-900 rounded-xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-none transition-all duration-500">
                   <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                     <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.name} />
                   </div>
                   <div className="p-2 md:p-6">
                      <h4 className="font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate text-[10px] md:text-base">{p.name}</h4>
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-[8px] md:text-sm mt-1">{p.price}{p.currency}</p>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
