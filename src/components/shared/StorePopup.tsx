import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getPopupActivoFn, type PopupData, type FrecuenciaPopup } from '../../api/popups.api';

// ─── Frecuencia: decide si mostrar según localStorage ────────────────────────

function debesMostrar(popup: PopupData): boolean {
  const { id, frecuencia } = popup;
  if (frecuencia === 'SIEMPRE') return true;

  const storageKey = `popup_${id}`;
  const valor = localStorage.getItem(storageKey);

  if (frecuencia === 'UNA_VEZ_SESION') {
    return valor === null;
  }

  if (frecuencia === 'UNA_VEZ_DIA') {
    if (!valor) return true;
    const hoy = new Date().toDateString();
    return valor !== hoy;
  }

  return true;
}

function marcarVisto(popup: PopupData) {
  const { id, frecuencia } = popup;
  if (frecuencia === 'SIEMPRE') return;
  const storageKey = `popup_${id}`;
  if (frecuencia === 'UNA_VEZ_SESION') localStorage.setItem(storageKey, '1');
  if (frecuencia === 'UNA_VEZ_DIA') localStorage.setItem(storageKey, new Date().toDateString());
}

// ─── Newsletter mini-form ─────────────────────────────────────────────────────

function NewsletterForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) onSubmit(email); }}
      className="flex gap-2 mt-4"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
      />
      <button
        type="submit"
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Suscribirme
      </button>
    </form>
  );
}

// ─── Código de descuento copiable ─────────────────────────────────────────────

function CodigoCopy({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };
  return (
    <button
      onClick={copiar}
      className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-current font-mono font-bold tracking-widest text-lg hover:opacity-80 transition-opacity"
    >
      {copiado ? '✓ ¡Copiado!' : codigo}
    </button>
  );
}

// ─── Popup visual ─────────────────────────────────────────────────────────────

function PopupContent({
  popup,
  onClose,
}: {
  popup: PopupData;
  onClose: () => void;
}) {
  const bg = popup.colorFondo || '#ffffff';
  // Detecta si el fondo es oscuro para usar texto claro
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? '#111111' : '#ffffff';
  const mutedColor = luminance > 0.5 ? '#555555' : '#cccccc';

  return (
    <div
      className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
      style={{ background: bg, color: textColor }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors z-10"
        style={{ color: textColor }}
      >
        ✕
      </button>

      {/* Imagen (IMAGEN_CTA o si tiene imagen) */}
      {popup.imagenUrl && (
        <img
          src={popup.imagenUrl}
          alt={popup.titulo}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-6">
        {/* Badge tipo */}
        {popup.tipo === 'OFERTA' && popup.porcentajeDesc && (
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{ background: textColor, color: bg }}
          >
            {popup.porcentajeDesc}% OFF
          </div>
        )}

        <h2 className="text-xl font-bold leading-tight">{popup.titulo}</h2>

        {popup.mensaje && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: mutedColor }}>
            {popup.mensaje}
          </p>
        )}

        {/* Newsletter */}
        {popup.tipo === 'NEWSLETTER' && (
          <NewsletterForm onSubmit={(email) => { console.log('email:', email); onClose(); }} />
        )}

        {/* Código de descuento */}
        {popup.tipo === 'OFERTA' && popup.codigoDesc && (
          <div style={{ color: textColor }}>
            <p className="text-xs mt-3" style={{ color: mutedColor }}>Usá este código al finalizar tu compra:</p>
            <CodigoCopy codigo={popup.codigoDesc} />
          </div>
        )}

        {/* CTA */}
        {popup.ctaTexto && popup.ctaUrl && (
          <a
            href={popup.ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center w-full py-2.5 rounded-xl font-semibold text-sm hover:opacity-85 transition-opacity"
            style={{ background: textColor, color: bg }}
            onClick={onClose}
          >
            {popup.ctaTexto} →
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Componente raíz ──────────────────────────────────────────────────────────

export default function StorePopup({ tiendaId }: { tiendaId: number }) {
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);

  const { data: popup } = useQuery({
    queryKey: ['popup', tiendaId],
    queryFn: () => getPopupActivoFn(tiendaId),
    enabled: !!tiendaId,
  });

  useEffect(() => {
    if (!popup || fired.current) return;
    if (!debesMostrar(popup)) return;
    fired.current = true;
    const timer = setTimeout(() => setVisible(true), popup.delay * 1000);
    return () => clearTimeout(timer);
  }, [popup]);

  const handleClose = () => {
    setVisible(false);
    if (popup) marcarVisto(popup);
  };

  return (
    <AnimatePresence>
      {visible && popup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm"
          >
            <PopupContent popup={popup} onClose={handleClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
