import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {useStorefrontCategorias,useStorefrontNormales,} from '../../../hooks/useStorefrontProducts';
import ProductCard from './ProductCard';
import type { CategoriaProducto, Producto } from './Types';

// ─── Tokens de tema ───────────────────────────────────────────────────────────
// Variables CSS del tema de la tienda, definidas como constantes para evitar
// strings hardcodeados dispersos en el JSX.

const tema = {
  bg:      'var(--gor-bg)',
  acento:  'var(--gor-acento)',
  border:  'var(--gor-border)',
  surface: 'var(--gor-surface)',
  txt:     'var(--gor-txt)',
  muted:   'var(--gor-muted)',
  subtle:  'var(--gor-subtle)',
} as const;

//Tipos────────────────────────────────────────────────────────────────────

interface Props {
  onSelect: (producto: Producto) => void;
  onCart?: (producto: Producto) => void;
  onViewAll?: () => void;
  tiendaId?: number;
}

// Filtro de categoría: puede ser "Todo" o el id de una categoría específica
type FiltroCategoriaId = number | 'Todo';

// Helper──────────────────────────────────────────────────────────────────

function resolverCategoriaPadreActiva(
  categoriaSeleccionadaId: FiltroCategoriaId,
  categorias: CategoriaProducto[]
): number | null {
  if (categoriaSeleccionadaId === 'Todo') return null;

  const categoriaSeleccionada = categorias.find((c) => c.id === categoriaSeleccionadaId);
  if (!categoriaSeleccionada) return null;

  return categoriaSeleccionada.padreId ?? categoriaSeleccionada.id;
}
//Componente principal─────────────────────────────────────────────────────

export default function Productos({ onSelect, onCart, onViewAll, tiendaId }: Props) {
  //Estado───────────────────────────────────────────────────────────────

  const [categoriaFiltro, setCategoriaFiltro] = useState<FiltroCategoriaId>('Todo');
  const [busquedaInput, setBusquedaInput]     = useState('');   
  const [busquedaAplicada, setBusquedaAplicada] = useState(''); 
  const [productosVisibles, setProductosVisibles] = useState(12);

  //Datos de categorías──────────────────────────────────────────────────

  const { data: categoriasData } = useStorefrontCategorias(tiendaId ?? 0);
  const categorias: CategoriaProducto[] = categoriasData || [];

  const categoriasPrincipales = categorias.filter((c) => !c.padreId);

  const categoriaPadreActivaId = resolverCategoriaPadreActiva(categoriaFiltro, categorias);

  // Subcategorías del padre activo, para mostrar como chips secundarios
  const subcategoriasDePadreActivo = categoriaPadreActivaId
    ? categorias.filter((c) => c.padreId === categoriaPadreActivaId)
    : [];

  //Datos de productos───────────────────────────────────────────────────

  const { data: productosData, isLoading } = useStorefrontNormales(tiendaId ?? 0, {
    categoriaId: categoriaFiltro !== 'Todo' ? categoriaFiltro : undefined,
    busqueda: busquedaAplicada.trim() !== '' ? busquedaAplicada : undefined,
  });

  const todosLosProductos: Producto[] = productosData?.datos || [];
  const productosPaginados = todosLosProductos.slice(0, productosVisibles);
  const hayMasProductos = todosLosProductos.length > productosVisibles;

  //Handlers────────────────────────────────────────────────────────────

  const handleCambiarCategoria = (id: FiltroCategoriaId) => {
    setCategoriaFiltro(id);
    // resetear paginación al cambiar categoría
    setProductosVisibles(12); 
  };

  const handleSubmitBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    setBusquedaAplicada(busquedaInput);
    setProductosVisibles(12);
  };

  //Render───────────────────────────────────────────────────────────────

  return (
    <section className="px-6 py-[4.5rem]" style={{ background: tema.bg }}>
      <div className="max-w-[1060px] mx-auto">

        {/* ── Encabezado ── */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2
            className="font-bold"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
              color: tema.txt,
            }}
          >
            Toda la{' '}
            <em className="italic font-normal" style={{ color: tema.acento }}>
              Colección
            </em>
          </h2>
          <span
            className="text-[.72rem]"
            style={{ color: tema.subtle, fontFamily: "'DM Sans',sans-serif" }}
          >
            {productosPaginados.length} productos
          </span>
        </div>

        {/*Filtros*/}
        <div className="flex flex-col gap-4 mb-8">

          {/* Buscador */}
          <form onSubmit={handleSubmitBusqueda} className="flex gap-2 w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full text-[.85rem] outline-none transition-colors duration-300"
              style={{
                border: `1.5px solid ${tema.border}`,
                background: tema.surface,
                color: tema.txt,
                fontFamily: "'DM Sans',sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = tema.acento)}
              onBlur={(e)  => (e.target.style.borderColor = tema.border)}
            />
            <button
              type="submit"
              className="px-5 rounded-full text-[.85rem] font-semibold border-none cursor-pointer text-white transition-opacity duration-200 hover:opacity-85"
              style={{ background: tema.acento, fontFamily: "'DM Sans',sans-serif" }}
            >
              Buscar
            </button>
          </form>

          {/* Chips de categorías principales */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {(['Todo', ...categoriasPrincipales] as Array<'Todo' | CategoriaProducto>).map((item) => {
                const id    = item === 'Todo' ? 'Todo' : item.id;
                const label = item === 'Todo' ? 'Todo' : item.nombre;

                // Un chip de categoría principal se marca activo si:
                // - es el ítem directamente seleccionado, o
                // - es el padre de la subcategoría actualmente seleccionada
                const estaActivo = id === categoriaFiltro || id === categoriaPadreActivaId;

                return (
                  <button
                    key={id}
                    onClick={() => handleCambiarCategoria(id)}
                    className="px-4 py-1.5 rounded-full text-[.72rem] cursor-pointer transition-all duration-200 border-none"
                    style={{
                      border:      `1.5px solid ${estaActivo ? tema.acento : tema.border}`,
                      background:  estaActivo ? `${tema.acento}14` : 'transparent',
                      color:       estaActivo ? tema.acento : tema.muted,
                      fontWeight:  estaActivo ? 600 : 400,
                      fontFamily:  "'DM Sans',sans-serif",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Chips de subcategorías (solo cuando hay padre activo) */}
            <AnimatePresence>
              {subcategoriasDePadreActivo.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex gap-2 flex-wrap"
                >
                  {/* Opción "Todos" = seleccionar la categoría padre directamente */}
                  <button
                    onClick={() => handleCambiarCategoria(categoriaPadreActivaId!)}
                    className="px-4 py-1.5 rounded-full text-[.72rem] cursor-pointer transition-all duration-200 border-none"
                    style={{
                      border:     `1.5px solid ${categoriaFiltro === categoriaPadreActivaId ? tema.acento : tema.border}`,
                      background: categoriaFiltro === categoriaPadreActivaId ? `${tema.acento}14` : tema.surface,
                      color:      categoriaFiltro === categoriaPadreActivaId ? tema.acento : tema.txt,
                      fontFamily: "'DM Sans',sans-serif",
                      opacity: 0.9,
                    }}
                  >
                    Todos
                  </button>

                  {subcategoriasDePadreActivo.map((subcategoria) => {
                    const estaActiva = categoriaFiltro === subcategoria.id;
                    return (
                      <button
                        key={subcategoria.id}
                        onClick={() => handleCambiarCategoria(subcategoria.id)}
                        className="px-4 py-1.5 rounded-full text-[.72rem] cursor-pointer transition-all duration-200 border-none"
                        style={{
                          border:     `1.5px dashed ${estaActiva ? tema.acento : tema.border}`,
                          background: estaActiva ? `${tema.acento}14` : 'transparent',
                          color:      estaActiva ? tema.acento : tema.muted,
                          fontWeight: estaActiva ? 600 : 400,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {subcategoria.nombre}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid de productos*/}
        {isLoading && !productosPaginados.length ? (
          <div
            className="py-16 text-center"
            style={{ color: tema.muted, fontFamily: "'DM Sans',sans-serif" }}
          >
            Cargando catálogo...
          </div>
        ) : !isLoading && productosPaginados.length === 0 ? (
          <div
            className="py-16 text-center"
            style={{ color: tema.muted, fontFamily: "'DM Sans',sans-serif" }}
          >
            Todavía no hay productos cargados en esta tienda.
          </div>
        ) : (
          <div
            className="grid gap-x-7 gap-y-10"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}
          >
            {productosPaginados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onSelect={onSelect}
                onAddToCart={onCart}
                showCategoria
              />
            ))}
          </div>
        )}

        {/*Botón "ver más" (paginación manual)*/}
        {hayMasProductos && (
          <div className="mt-14 text-center">
            <button
              onClick={onViewAll}
              className="px-8 py-3 rounded-full text-[.75rem] font-bold tracking-widest uppercase cursor-pointer transition-all duration-200"
              style={{
                background:  tema.surface,
                color:       tema.txt,
                border:      `1.5px solid ${tema.border}`,
                fontFamily:  "'DM Sans',sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tema.acento;
                e.currentTarget.style.color = tema.acento;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tema.border;
                e.currentTarget.style.color = tema.txt;
              }}
            >
              Ver todos los productos
            </button>
          </div>
        )}

      </div>
    </section>
  );
}