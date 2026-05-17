import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '1rem 2rem',
        backgroundColor: '#E30613', color: 'white'
      }}>
        <strong style={{ fontSize: '1.3rem' }}>🏦 Compartamos Banco</strong>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer' }}>Créditos</span>
          <span style={{ cursor: 'pointer' }}>Ahorros</span>
          <button onClick={() => navigate('/login')} style={{
            background: 'white', color: '#E30613', border: 'none',
            padding: '0.5rem 1.2rem', borderRadius: 6,
            fontWeight: 700, cursor: 'pointer'
          }}>
            Banca por Internet
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #E30613, #ff4d57)',
        color: 'white', padding: '5rem 2rem', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Tu futuro empieza hoy
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto 2rem', fontSize: '1.1rem' }}>
          Créditos rápidos y ahorros seguros para el microempresario peruano.
        </p>
        <button onClick={() => navigate('/login')} style={{
          background: 'white', color: '#E30613', border: 'none',
          padding: '0.8rem 2rem', borderRadius: 8,
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
        }}>
          Ingresar a mi cuenta
        </button>
      </section>

      {/* Productos */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f9f9f9' }}>
        <h2 style={{ marginBottom: '2rem', color: '#333' }}>Nuestros productos</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem', maxWidth: 850, margin: '0 auto'
        }}>
          {[
            { titulo: 'Crédito MYPE', desc: 'Desde S/ 500 hasta S/ 50,000 para tu negocio.' },
            { titulo: 'Ahorro Compartamos', desc: 'La mejor tasa, sin comisiones ocultas.' },
            { titulo: 'Crédito Grupal', desc: 'Fortalece tu comunidad con créditos grupales.' },
          ].map((p) => (
            <div key={p.titulo} style={{
              background: 'white', borderRadius: 10,
              padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #E30613', textAlign: 'left'
            }}>
              <h3 style={{ color: '#E30613', marginBottom: '0.4rem' }}>{p.titulo}</h3>
              <p style={{ color: '#636e72' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#222', color: '#aaa',
        textAlign: 'center', padding: '1.5rem', fontSize: '0.875rem'
      }}>
        Compartamos Banco S.A. | Supervisado por la SBS | 0800-00-228
      </footer>
    </div>
  );
}