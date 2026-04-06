const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Martin Cardozo\\Desktop\\Tienda Personal\\shop-users\\src\\components\\templates\\TemplateRopa\\TemplateRop.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Añadir componente OrdersList al final (antes de la última exportación o al final del archivo)
const ordersListComponent = `
function OrdersList() {
  const { token } = useAuthSessionStore();
  const { data: pedidos, isLoading } = (require('../../../hooks/usePedidosCliente').usePedidosCliente)(!!token);

  if (isLoading) return <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', color: 'var(--rop-muted)' }}>Cargando tus pedidos...</p>;

  if (!pedidos || pedidos?.length === 0) {
    return <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', color: 'var(--rop-muted)', opacity: 0.7 }}>Aún no has realizado ningún pedido.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {pedidos.map((p: any) => (
        <div key={p.id} style={{ padding: '1rem', border: '1px solid var(--rop-border)', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.85rem', fontWeight: 600, color: 'var(--rop-dark)' }}>
              Pedido #{p.id}
            </span>
            <span style={{ 
              fontFamily: "'Outfit',sans-serif", fontSize: '.65rem', fontWeight: 700, 
              color: p.estado === 'PENDIENTE' ? '#f59e0b' : p.estado === 'COMPLETADO' ? '#10b981' : '#ef4444',
              background: \`\${p.estado === 'PENDIENTE' ? '#f59e0b' : p.estado === 'COMPLETADO' ? '#10b981' : '#ef4444'}15\`,
              padding: '2px 8px', borderRadius: '4px'
            }}>
              {p.estado}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '.75rem', color: 'var(--rop-muted)' }}>
              {new Date(p.createdAt).toLocaleDateString()}
            </span>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.1rem', color: 'var(--rop-dark)' }}>
              $\${Number(p.total).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
`;

// Evitar duplicados si se corre varias veces
if (!content.includes('function OrdersList()')) {
    content += ordersListComponent;
}

// 2. Reemplazar el mensaje de "No hay pedidos" por <OrdersList />
// Usamos una regex para encontrar el bloque de pedidos
const searchPattern = /<p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '\.85rem', color: MUTED, opacity: 0\.7 }}>Aún no has realizado ningún pedido en VESTE\.<\/p>/;
if (searchPattern.test(content)) {
    content = content.replace(searchPattern, '<OrdersList />');
    console.log('Successfully replaced empty orders message.');
} else {
    // Intento con una versión más flexible
    const flexiblePattern = /Aún no has realizado ningún pedido en VESTE\./;
    if (flexiblePattern.test(content)) {
        // Encontramos el elemento p que lo contiene
        content = content.replace(/<p[^>]*>Aún no has realizado ningún pedido en VESTE\.<\/p>/, '<OrdersList />');
        console.log('Successfully replaced empty orders message (flexible).');
    } else {
        console.log('Pattern not found.');
    }
}

fs.writeFileSync(filePath, content);
console.log('Update finished.');
