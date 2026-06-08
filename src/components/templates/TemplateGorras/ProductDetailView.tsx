import { useEffect, useMemo, useState } from "react";
import { MetodoChip } from "../../shared/MetodoIcons";
import ReviewSection from "./ReviewSection";
import type { Producto, ThemeProps, Tienda } from "./Types";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ProductDetailViewProps {
  product: Producto;
  onBack: () => void;
  onCart: (product: Producto, quantity: number, variantId?: number) => void;
  tienda?: Tienda;
  theme?: ThemeProps;
  onLogin?: () => void;
}

// Representa una variante tipada (product.variantes viene como `any` del backend)
interface Variante {
  id: number;
  nombre: string;
  precioExtra?: number | string;
  imagenUrl?: string;
  disponible?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

//Parsea el nombre de una variante (ej: "Color: Rojo - Talle: M") y devuelve un objeto con los atributos (ej: { Color: "Rojo", Talle: "M" }). Si el formato no es el esperado, devuelve un objeto con una clave genérica "Opciones".
function parsearNombreVariante(nombre: string): Record<string, string> {
  const atributos: Record<string, string> = {};
  nombre.split(" - ").forEach((parte) => {
    if (parte.includes(":")) {
      const [clave, valor] = parte.split(":").map((s) => s.trim());
      atributos[clave] = valor;
    } else {
      atributos["Opciones"] = parte.trim();
    }
  });
  return atributos;
}

// Construye un mapa de grupos de atributos a sus posibles valores a partir de la lista de variantes.
function construirGruposAtributos(
  variantes: Variante[],
): Record<string, string[]> {
  const grupos: Record<string, Set<string>> = {};

  variantes.forEach((variante) => {
    const atributos = parsearNombreVariante(variante.nombre);
    Object.entries(atributos).forEach(([clave, valor]) => {
      if (!grupos[clave]) grupos[clave] = new Set();
      grupos[clave].add(valor);
    });
  });

  return Object.fromEntries(
    Object.entries(grupos).map(([clave, set]) => [clave, Array.from(set)]),
  );
}

//Encuentra la variante que coincide exactamente con la selección actual de atributos. Si no encuentra ninguna, devuelve undefined.
function encontrarVarianteSeleccionada(
  variantes: Variante[],
  seleccion: Record<string, string>,
): Variante | undefined {
  return variantes.find((variante) => {
    const atributosVariante = parsearNombreVariante(variante.nombre);
    return Object.keys(seleccion).every(
      (clave) => atributosVariante[clave] === seleccion[clave],
    );
  });
}

//Si hay una variante disponible, devuelve la selección de atributos correspondiente a esa variante. Si no, devuelve la primera opción de cada grupo de atributos.
function obtenerSeleccionInicial(
  variantes: Variante[],
  gruposAtributos: Record<string, string[]>,
): Record<string, string> {
  const primeraDisponible = variantes.find((v) => v.disponible);

  if (primeraDisponible) {
    return parsearNombreVariante(primeraDisponible.nombre);
  }

  return Object.fromEntries(
    Object.entries(gruposAtributos).map(([clave, valores]) => [
      clave,
      valores[0],
    ]),
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const ProductDetailView = ({
  product,
  onBack,
  onCart,
  tienda,
  theme,
  onLogin,
}: ProductDetailViewProps) => {
  // ─── Estado ───────────────────────────────────────────────────────────────

  const [cantidad, setCantidad] = useState(1);
  const [varianteSeleccionadaId, setVarianteSeleccionadaId] = useState<
    number | null
  >(null);
  const [imagenActiva, setImagenActiva] = useState(
    product.imagenPrincipalUrl || "",
  );
  const [atributosSeleccionados, setAtributosSeleccionados] = useState<
    Record<string, string>
  >({});
  const [imagenZoom, setImagenZoom] = useState(false);

  // ─── Datos derivados ──────────────────────────────────────────────────────

  const variantes: Variante[] = (product as any).variantes || [];
  const tieneVariantes = variantes.length > 0;

  const gruposAtributos = useMemo(
    () => construirGruposAtributos(variantes),
    [variantes],
  );

  const todasLasImagenes = [
    ...(product.imagenPrincipalUrl
      ? [{ url: product.imagenPrincipalUrl }]
      : []),
    ...(product.imagenes || []),
  ];

  const imagenMostrada =
    imagenActiva ||
    product.imagenPrincipalUrl ||
    "https://via.placeholder.com/600";

  const varianteActual = varianteSeleccionadaId
    ? variantes.find((v) => v.id === varianteSeleccionadaId)
    : undefined;

  const precioExtra = Number(varianteActual?.precioExtra || 0);
  const tieneOferta =
    product.precioOferta &&
    Number(product.precioOferta) > 0 &&
    Number(product.precioOferta) < Number(product.precio);

  const precioBase = Number(product.precio) + precioExtra;
  const precioFinal = tieneOferta
    ? Number(product.precioOferta) + precioExtra
    : precioBase;

  const botonAgregaDeshabilitado = tieneVariantes && !varianteSeleccionadaId;

  // ─── Efectos ──────────────────────────────────────────────────────────────

  // Sincronizar imagen principal cuando cambia el producto
  useEffect(() => {
    setImagenActiva(product.imagenPrincipalUrl || "");
  }, [product.imagenPrincipalUrl]);

  // Al cambiar de producto: scroll al top + inicializar selección de atributos
  useEffect(() => {
    window.scrollTo(0, 0);

    if (Object.keys(gruposAtributos).length > 0) {
      setAtributosSeleccionados(
        obtenerSeleccionInicial(variantes, gruposAtributos),
      );
    } else {
      setVarianteSeleccionadaId(null);
    }
  }, [product.id]);

  // Cuando cambia la selección de atributos, buscar la variante correspondiente
  useEffect(() => {
    if (Object.keys(gruposAtributos).length === 0) return;

    const variante = encontrarVarianteSeleccionada(
      variantes,
      atributosSeleccionados,
    );

    if (variante) {
      setVarianteSeleccionadaId(variante.id);
      if (variante.imagenUrl) setImagenActiva(variante.imagenUrl);
    } else {
      setVarianteSeleccionadaId(null);
    }
  }, [atributosSeleccionados, product]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSeleccionarAtributo = (grupo: string, valor: string) => {
    setAtributosSeleccionados((prev) => ({ ...prev, [grupo]: valor }));
  };

  const handleAgregarAlCarrito = () => {
    onCart(product, cantidad, varianteSeleccionadaId || undefined);
  };

  const handleZoomMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imagenZoom) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const posX = ((e.clientX - left) / width) * 100;
    const posY = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.transformOrigin = `${posX}% ${posY}%`;
  };

  // ─── Tokens de tema ──────────────────────────────────────────────────────

  const {
    surface = "var(--gor-surface)",
    surface2 = "var(--gor-surface2)",
    txt = "var(--gor-txt)",
    muted = "var(--gor-muted)",
    subtle = "var(--gor-subtle)",
    border = "var(--gor-border)",
    acento = "var(--gor-acento)",
    btnTxt = "var(--gor-btn-txt)",
  } = theme || {};

  // ─── Guard ────────────────────────────────────────────────────────────────

  if (!product) return null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="px-6 py-12 min-h-[80vh] flex flex-col"
      style={{ background: "var(--gor-bg)" }}
    >
      <div className="max-w-[1060px] mx-auto w-full flex-1">
        {/* Botón volver */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-[.85rem] font-medium mb-8 p-0 transition-colors duration-200"
          style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = String(txt))}
          onMouseLeave={(e) => (e.currentTarget.style.color = String(muted))}
        >
          <span className="text-xl">←</span> Volver al catálogo
        </button>

        <div className="flex gap-12 flex-wrap items-start">
          {/* ── Columna izquierda: galería de imágenes ── */}
          <div className="flex-[1_1_400px] flex flex-col gap-4">
            {/* Imagen principal con zoom */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              style={{ background: surface2 }}
            >
              <img
                src={imagenMostrada}
                alt={product.nombre}
                className="w-full h-full object-cover"
                onMouseMove={handleZoomMouseMove}
                onMouseEnter={() => setImagenZoom(true)}
                onMouseLeave={() => setImagenZoom(false)}
                style={{
                  transform: imagenZoom ? "scale(2)" : "scale(1)",
                  transition: "transform 0.3s ease",
                  cursor: imagenZoom ? "zoom-out" : "zoom-in",
                }}
              />
            </div>

            {/* Miniaturas (solo si hay más de una imagen) */}
            {todasLasImagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {todasLasImagenes.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImagenActiva(img.url)}
                    className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
                    style={{
                      borderColor:
                        (imagenActiva || product.imagenPrincipalUrl) === img.url
                          ? String(acento)
                          : String(border),
                      opacity:
                        (imagenActiva || product.imagenPrincipalUrl) === img.url
                          ? 1
                          : 0.65,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Columna derecha: info y acciones ── */}
          <div className="flex-[1_1_400px] flex flex-col">
            {/* Categoría */}
            <span
              className="text-[.75rem] font-semibold uppercase tracking-[.1em] mb-3"
              style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
            >
              {product.categoria?.nombre || "Producto"}
            </span>

            {/* Nombre del producto */}
            <h1
              className="font-bold leading-[1.15] mb-5"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                color: txt,
              }}
            >
              {product.nombre}
            </h1>

            {/* Precios */}
            <div className="flex items-center gap-3 mb-8">
              {tieneOferta ? (
                <>
                  <span
                    className="text-[1.2rem] line-through"
                    style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    ${precioBase.toLocaleString()}
                  </span>
                  <span
                    className="text-[2.4rem] font-bold"
                    style={{
                      color: acento,
                      fontFamily: "'Playfair Display',serif",
                    }}
                  >
                    ${precioFinal.toLocaleString()}
                  </span>
                  <span
                    className="text-[.8rem] font-bold px-3.5 py-1.5 rounded-full ml-1"
                    style={{ background: `${acento}14`, color: acento }}
                  >
                    Oferta Especial
                  </span>
                </>
              ) : (
                <span
                  className="text-[2.4rem] font-bold"
                  style={{
                    color: acento,
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  ${precioBase.toLocaleString()}
                </span>
              )}
            </div>

            {/* Descripción */}
            <p
              className="text-base leading-[1.7] mb-8"
              style={{ color: subtle, fontFamily: "'DM Sans',sans-serif" }}
            >
              {product.descripcion ||
                "Diseño exclusivo pensado para vos. Calidad superior y detalles que marcan la diferencia en cada uso."}
            </p>

            {/* ── Selector de variantes ── */}
            {Object.keys(gruposAtributos).length > 0 && (
              <div className="mb-10 space-y-6">
                {Object.entries(gruposAtributos).map(
                  ([nombreGrupo, valores]) => (
                    <div key={nombreGrupo}>
                      <h4
                        className="text-[.85rem] font-bold mb-3 uppercase tracking-wider"
                        style={{
                          color: muted,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {nombreGrupo}
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {valores.map((valor) => {
                          const estaSeleccionado =
                            atributosSeleccionados[nombreGrupo] === valor;
                          return (
                            <button
                              key={valor}
                              onClick={() =>
                                handleSeleccionarAtributo(nombreGrupo, valor)
                              }
                              className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                              style={{
                                border: `2px solid ${estaSeleccionado ? acento : border}`,
                                background: estaSeleccionado ? acento : surface,
                                color: estaSeleccionado
                                  ? "var(--gor-btn-txt)"
                                  : txt,
                                fontWeight: estaSeleccionado ? 600 : 400,
                                fontFamily: "'DM Sans',sans-serif",
                              }}
                            >
                              {valor}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}

                {/* Indicador de disponibilidad de la combinación seleccionada */}
                {varianteSeleccionadaId ? (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p
                      className="text-[.8rem] font-medium"
                      style={{ color: txt }}
                    >
                      Variante disponible
                      {precioExtra > 0 && ` (+$${precioExtra})`}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <p className="text-[.8rem] font-medium text-red-500">
                      Esta combinación no está disponible.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Control de cantidad + botón agregar ── */}
            <div className="flex gap-4 mb-12 flex-wrap">
              <div
                className="flex rounded-full overflow-hidden w-[140px]"
                style={{ border: `1.5px solid ${border}`, background: surface }}
              >
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="flex-1 bg-transparent border-none cursor-pointer text-[1.2rem] pt-0.5"
                  style={{ color: txt }}
                >
                  −
                </button>
                <span
                  className="flex-1 flex items-center justify-center text-base font-semibold"
                  style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
                >
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="flex-1 bg-transparent border-none cursor-pointer text-[1.2rem] pt-0.5"
                  style={{ color: txt }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAgregarAlCarrito}
                disabled={botonAgregaDeshabilitado}
                className="flex-1 rounded-full text-[.95rem] font-semibold border-none cursor-pointer px-8 min-h-[52px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: acento,
                  color: btnTxt,
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: `0 8px 20px ${acento}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = ".9";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Agregar al Carrito
              </button>
            </div>

            {/* ── Métodos de entrega y pago ── */}
            <div
              className="mt-6 pt-10 flex flex-col gap-10"
              style={{ borderTop: `1.5px solid ${border}` }}
            >
              <MetodosSection
                titulo="Envío y Entregas"
                metodos={tienda?.metodosEntrega ?? []}
                getKey={(m) => m.metodoEntrega.id}
                getNombre={(m) => m.metodoEntrega.nombre}
                mensajeVacio="No hay métodos de entrega configurados."
                surface2={surface2}
                border={border}
                txt={txt}
                muted={muted}
                theme={theme}
              />

              <MetodosSection
                titulo="Formas de Pago"
                metodos={tienda?.metodosPago ?? []}
                getKey={(m) => m.metodoPago.id}
                getNombre={(m) => m.metodoPago.nombre}
                mensajeVacio="No hay métodos de pago configurados."
                surface2={surface2}
                border={border}
                txt={txt}
                muted={muted}
                theme={theme}
              />
            </div>
          </div>
        </div>

        {/* Sección de reseñas */}
        <ReviewSection
          productoId={product.id}
          onLogin={onLogin ?? (() => {})}
          theme={theme}
        />
      </div>
    </div>
  );
};

// ─── Sub-componente: sección de métodos (entrega / pago) ──────────────────────

interface MetodosSectionProps<T> {
  titulo: string;
  metodos: T[];
  getKey: (m: T) => number | string;
  getNombre: (m: T) => string;
  mensajeVacio: string;
  surface2: string;
  border: string;
  txt: string;
  muted: string;
  theme?: ThemeProps;
}

function MetodosSection<T>({
  titulo,
  metodos,
  getKey,
  getNombre,
  mensajeVacio,
  surface2,
  border,
  txt,
  muted,
  theme,
}: MetodosSectionProps<T>) {
  return (
    <div className="flex flex-col gap-5">
      <h4
        className="text-[.85rem] font-bold uppercase tracking-widest"
        style={{ color: txt, fontFamily: "'DM Sans',sans-serif" }}
      >
        {titulo}
      </h4>

      {metodos.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {metodos.map((metodo) => (
            <div
              key={getKey(metodo)}
              className="group flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: surface2, border: `1px solid ${border}` }}
            >
              <MetodoChip
                nombre={getNombre(metodo)}
                borderColor="transparent"
                backgroundColor="transparent"
                textColor={txt}
                preferSVG={true}
                isDarkMode={theme?.modoOscuro}
                iconSize={28}
                style={{ padding: 0, border: "none" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p
          className="text-[.8rem] opacity-60"
          style={{ color: muted, fontFamily: "'DM Sans',sans-serif" }}
        >
          {mensajeVacio}
        </p>
      )}
    </div>
  );
}

export default ProductDetailView;
