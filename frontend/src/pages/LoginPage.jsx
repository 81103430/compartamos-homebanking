import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, guardarSesion } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setExito('');
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setCargando(true);
    try {
      const data = await login(email, password);
      guardarSesion(data.token, data.user);
      setExito('¡Acceso exitoso! Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f6fa' }}>
      
      {/* Navbar */}
      <nav style={{ background: '#E30613', padding: '1rem 2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        onClick={() => navigate('/')}>
        <span style={{ fontSize: '1.4rem' }}>🏦</span>
        <strong style={{ color: 'white', fontSize: '1.1rem' }}>Compartamos Banco</strong>
      </nav>

      {/* Banner zona segura */}
      <div style={{
        background: '#fff3cd', borderBottom: '1px solid #ffc107',
        padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
      }}>
        <span>🔒</span>
        <span style={{ fontSize: '0.85rem', color: '#856404', fontWeight: 500 }}>
          Zona segura — Conexión cifrada SSL. Nunca compartas tu contraseña con nadie.
        </span>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          
          {/* Card identidad */}
          <div style={{
            background: '#E30613', borderRadius: '12px 12px 0 0',
            padding: '1.5rem 2rem', textAlign: 'center', color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.3rem' }}>🏦</div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Banca por Internet</h2>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Accede de forma segura a tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <div style={{
            background: 'white', borderRadius: '0 0 12px 12px',
            padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
          }}>
            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                Correo electrónico
              </label>
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                style={{
                  display: 'block', width: '100%', padding: '0.75rem',
                  margin: '0.4rem 0 1.2rem', border: '1.5px solid #ddd',
                  borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box'
                }}
              />
              <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                Contraseña
              </label>
              <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  display: 'block', width: '100%', padding: '0.75rem',
                  margin: '0.4rem 0 1.5rem', border: '1.5px solid #ddd',
                  borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box'
                }}
              />

              {/* Mensaje error */}
              {error && (
                <div style={{
                  background: '#fdecea', border: '1px solid #e74c3c',
                  borderRadius: 6, padding: '0.7rem 1rem',
                  color: '#c0392b', fontSize: '0.875rem', marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  ❌ {error}
                </div>
              )}

              {/* Mensaje éxito */}
              {exito && (
                <div style={{
                  background: '#eafaf1', border: '1px solid #27ae60',
                  borderRadius: 6, padding: '0.7rem 1rem',
                  color: '#1e8449', fontSize: '0.875rem', marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  ✅ {exito}
                </div>
              )}

              <button type="submit" disabled={cargando} style={{
                width: '100%', padding: '0.85rem',
                background: cargando ? '#aaa' : '#E30613',
                color: 'white', border: 'none',
                borderRadius: 6, fontSize: '1rem',
                fontWeight: 700, cursor: cargando ? 'not-allowed' : 'pointer'
              }}>
                {cargando ? '⏳ Verificando...' : 'Ingresar'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem', color: '#999' }}>
              🔐 Supervisado por la SBS | 0800-00-228
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}