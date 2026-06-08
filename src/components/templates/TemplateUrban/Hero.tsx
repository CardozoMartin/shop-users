import type { IHeroProps } from './Types';

export const Hero = ({ titulo, descripcion, imagenCarrusel, tituloDos, acento }: IHeroProps) => {
  const primaryImg =
    imagenCarrusel?.[0]?.url ||
    imagenCarrusel?.[0]?.img ||
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=1600';

  return (
    <header
      className="relative flex flex-col items-center justify-center text-center overflow-hidden bg-[#0a0a0a]"
      style={{ height: '80vh' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${primaryImg})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, #000 100%)' }}
      />

      <div className="relative z-10 px-4">
        <p className="text-red-600 tracking-[0.4em] mb-3 text-sm font-black uppercase font-barlow">
          {descripcion || 'COLECCIÓN EXCLUSIVA'}
        </p>
        <h1
          className="text-white leading-none mb-6 uppercase font-bebas"
          style={{ fontSize: 'clamp(60px, 14vw, 160px)' }}
        >
          {tituloDos?.primera || titulo || 'ESTILO SIN'}
          <br />
          <span style={{ color: acento || '#dc2626' }}>{tituloDos?.segunda || 'LÍMITES'}</span>
        </h1>
        <button
          onClick={() => {
            const element = document.getElementById('productos');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="border-2 border-white text-white hover:bg-white hover:text-black font-black py-3 px-12 transition duration-500 uppercase tracking-widest text-sm bg-transparent cursor-pointer"
        >
          Comprar Ahora
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        <div className="w-10 h-1 bg-red-600" />
        <div className="w-10 h-1 bg-zinc-700" />
        <div className="w-10 h-1 bg-zinc-700" />
      </div>
    </header>
  );
};

export default Hero;
