import { useEffect, useState } from 'react';

const Countdown = () => {
  const [time, setTime] = useState({ h: 47, m: 58, s: 42 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 47; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex gap-2 items-center">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-2">
          <span
            className="bg-black text-white px-4 py-2 tabular-nums font-bebas text-[28px]"
          >
            {val}
          </span>
          {i < 2 && <span className="text-black font-black text-xl">:</span>}
        </span>
      ))}
    </div>
  );
};

export default function Marquee({ items }: { items?: any[] }) {
  return (
    <section className="py-10 bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="font-bebas text-4xl leading-none">
            {items?.[0]?.texto || 'OFERTAS DE TEMPORADA'}
          </p>
          <p className="text-red-200 text-xs uppercase tracking-widest mt-1">
            Hasta 40% OFF — Black Edition
          </p>
        </div>
        <Countdown />
      </div>
    </section>
  );
}
