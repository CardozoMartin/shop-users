import { useEffect, useState } from 'react';
import { useStorefrontCategorias, useStorefrontNormales } from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { CategoriaProducto, Producto } from './Types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tiendaId: number;
  onSelect: (p: Producto) => void;
  onCart?: (p: Producto) => void;
  accent?: string;
  theme: any;
}

export default function FullProductCatalog({ tiendaId, onSelect, onCart, accent, theme }: Props) {
  const [catId, setCatId] = useState<number | 'Todo'>('Todo');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Producto[]>([]);

  const { data: categorias } = useStorefrontCategorias(tiendaId);
  const { data: pageData, isLoading } = useStorefrontNormales(tiendaId, {
    categoriaId: catId !== 'Todo' ? catId : undefined,
    busqueda: appliedSearch.trim() !== '' ? appliedSearch : undefined,
    page,
    limit: 12,
  });

  // Reset y carga inicial
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [catId, appliedSearch]);

  // Acumular productos
  useEffect(() => {
    if (pageData?.datos) {
      if (page === 1) {
        setAllProducts(pageData.datos);
      } else {
        setAllProducts((prev) => [...prev, ...pageData.datos]);
      }
    }
  }, [pageData, page]);

  const categoriasPrincipales = categorias?.filter((c: CategoriaProducto) => !c.padreId) || [];
  const activeParentId = typeof catId === 'number' 
    ? (categorias?.find((c: CategoriaProducto) => c.id === catId)?.padreId || (categorias?.some((c: CategoriaProducto) => c.padreId === catId) ? catId : null))
    : null;

  const subCats = activeParentId 
    ? categorias?.filter((c: CategoriaProducto) => c.padreId === activeParentId) 
    : [];

  return (
    <section className="px-6 py-12 min-h-screen" style={{ background: theme.bg }}>
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[280px] shrink-0">
          <div className="sticky top-24 space-y-10">
            {/* Buscador */}
            <div>
              <h3 className="text-[.7rem] font-black uppercase tracking-[.2em] mb-4 opacity-50" style={{ color: theme.txt }}>Buscar</h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setAppliedSearch(search)}
                  placeholder="Ej: Gorra plana..."
                  className="w-full bg-transparent border-b-2 py-2 outline-none text-sm transition-all focus:border-current"
                  style={{ borderBottomColor: theme.border, color: theme.txt }}
                />
                <button 
                  onClick={() => setAppliedSearch(search)}
                  className="absolute right-0 bottom-2 opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: theme.txt }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
              </div>
            </div>

            {/* Categorías */}
            <div>
              <h3 className="text-[.7rem] font-black uppercase tracking-[.2em] mb-5 opacity-50" style={{ color: theme.txt }}>Categorías</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setCatId('Todo')}
                  className={`block w-full text-left py-2 px-3 rounded-xl text-sm font-bold transition-all ${catId === 'Todo' ? 'bg-current/10' : 'hover:bg-current/5 opacity-60'}`}
                  style={{ color: catId === 'Todo' ? accent : theme.txt }}
                >
                  Ver Todo
                </button>
                {categoriasPrincipales.map((c: CategoriaProducto) => {
                  const isActive = catId === c.id || activeParentId === c.id;
                  return (
                    <div key={c.id}>
                      <button 
                        onClick={() => setCatId(c.id)}
                        className={`block w-full text-left py-2 px-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-current/10' : 'hover:bg-current/5 opacity-60'}`}
                        style={{ color: isActive ? accent : theme.txt }}
                      >
                        {c.nombre}
                      </button>
                      
                      <AnimatePresence>
                        {isActive && subCats.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-4 mt-1 border-l-2 pl-3 space-y-1"
                            style={{ borderColor: theme.border }}
                          >
                            {subCats.map((sc: CategoriaProducto) => (
                              <button 
                                key={sc.id}
                                onClick={() => setCatId(sc.id)}
                                className={`block w-full text-left py-1.5 text-xs font-semibold transition-all ${catId === sc.id ? 'opacity-100' : 'opacity-40 hover:opacity-75'}`}
                                style={{ color: catId === sc.id ? accent : theme.txt }}
                              >
                                {sc.nombre}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black tracking-tight" style={{ color: theme.txt, fontFamily: "'Playfair Display', serif" }}>
              {catId === 'Todo' ? 'Todos los Productos' : categorias?.find((c: CategoriaProducto) => c.id === catId)?.nombre}
            </h1>
            <span className="text-xs font-bold opacity-40 uppercase tracking-widest">{allProducts.length} resultados</span>
          </div>

          {!allProducts.length && !isLoading ? (
            <div className="py-20 text-center opacity-40 italic">No encontramos productos en esta sección.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {allProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    producto={p} 
                    onSelect={onSelect} 
                    onAddToCart={onCart}
                    showCategoria 
                  />
                ))}
              </div>

              {/* Paginación */}
              {pageData?.paginacion && pageData.paginacion.pagina < pageData.paginacion.totalPaginas && (
                <div className="mt-20 text-center">
                  <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLoading}
                    className="px-10 py-4 rounded-full font-black uppercase text-[.7rem] tracking-[.3em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{ background: accent, color: 'white' }}
                  >
                    {isLoading ? 'Cargando...' : 'Cargar más productos'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
