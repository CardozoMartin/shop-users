import { motion } from 'framer-motion';

interface Props {
  className?: string;
  imageClassName?: string; // Para controlar la relación de aspecto según el template
}

export const SkeletonProductCard = ({ className = '', imageClassName = 'aspect-[3/4]' }: Props) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col group ${className}`}
    >
      {/* Contenedor de la imagen */}
      <div className={`w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md overflow-hidden ${imageClassName}`} />
      
      {/* Contenedor del texto inferior */}
      <div className="mt-4 flex flex-col gap-2 px-1">
        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1" />
      </div>
    </motion.div>
  );
};
