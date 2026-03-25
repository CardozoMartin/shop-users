import { useParams } from "react-router-dom";
import { usePublicShop } from "../hooks/useShop";
import StoreRenderer from "../components/StoreRenderer";


const PublicStorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: tienda, isLoading, isError } = usePublicShop(slug!);
  console.log('Datos de la tienda pública:', tienda);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (isError || !tienda) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2">
        <p className="text-2xl font-bold text-slate-800">Tienda no encontrada</p>
        <p className="text-slate-400 text-sm">El link que ingresaste no existe o fue eliminado.</p>
      </div>
    );
  }

  return <StoreRenderer tienda={tienda} />;
};

export default PublicStorePage;
