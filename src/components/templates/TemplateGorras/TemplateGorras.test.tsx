import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TemplateGorras from './TemplateGorras';

const tiendaMock = {
  id: 1,
  nombre: 'Tienda test',
  descripcion: 'Descripción test',
  whatsapp: '123',
  instagram: '@test',
  ciudad: 'Ciudad',
  provincia: 'Provincia',
  titulo: 'Título',
  temaConfig: {
    colorAcento: '#f97316',
    fuenteTitulo: 'Playfair Display'
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('TemplateGorras', () => {
  it('renders basic shop info and loader for products', () => {
    renderWithProviders(<TemplateGorras tienda={tiendaMock} />);

    expect(screen.getAllByText(/Tienda test/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Descripción test/i).length).toBeGreaterThanOrEqual(1);
  });
});
