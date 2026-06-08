import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export type StoreNavTarget = 'inicio' | 'producto' | 'contacto' | 'sobrenosotros';

const normalizePath = (basePath: string, relativePath: string) => {
  const trimmed = relativePath.replace(/^\/+/g, '');
  if (!trimmed) return basePath;
  if (basePath === '/' || basePath === '') return `/${trimmed}`;
  return `${basePath}/${trimmed}`;
};

export const useStoreNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const basePath = slug ? `/${slug}` : '/';

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const sectionId = location.hash.replace('#', '');
    const timer = window.setTimeout(() => scrollToSection(sectionId), 50);
    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname, scrollToSection]);

  const isAtRootPath = useCallback(() => {
    const current = location.pathname.replace(/\/+$/, '');
    const root = basePath.replace(/\/+$/, '');
    return current === root;
  }, [location.pathname, basePath]);

  const navigateTo = useCallback(
    (relativePath: string) => {
      const path = normalizePath(basePath, relativePath);
      navigate(path);
    },
    [navigate, basePath]
  );

  const handleNavigate = useCallback(
    (target: StoreNavTarget) => {
      if (target === 'sobrenosotros') {
        navigateTo('about');
        return;
      }
      if (target === 'producto') {
        navigateTo('catalog');
        return;
      }
      if (target === 'contacto') {
        if (isAtRootPath()) scrollToSection('contacto');
        navigate({ pathname: basePath, hash: '#contacto' });
        return;
      }
      if (target === 'inicio') {
        if (isAtRootPath()) scrollToSection('inicio');
        navigate({ pathname: basePath, hash: '#inicio' });
        return;
      }
    },
    [navigateTo, isAtRootPath, basePath, navigate, scrollToSection]
  );

  return {
    basePath,
    navigateTo,
    handleNavigate,
    scrollToSection,
  };
};
