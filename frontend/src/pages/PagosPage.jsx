import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function PagosPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [form, setForm] = useState({ servicio: '', numero: '', monto: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function handleLogout() {
    cerrarSesion();
    navigate('/');
  }

  async function handlePago(e) {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!form.servicio || !form.numero || !form.monto) {
      setError('Completa todos los campos');
      return;
    }
    setCargando(true);
    setTimeout(() => {
      setMensaje(`✅ Pago de ${form.servicio} por S/ ${form.monto} realizado exitosamente`);
      setForm({ servicio: '', numero: '', monto: '' });
      setCargando(false);
    }, 1500);
  }

  const servicios = [
    { nombre: 'Luz (Electrocentro)', icono: '💡' },
    { nombre: 'Agua (SEDAM)', icono: '💧' },
    { nombre: 'Internet (Claro)', icono: '📡' },
    { nombre: 'Teléfono (Movistar)', icono: '📱' },
    { nombre: 'Gas (Cálidda)', icono: '🔥' },
    { nombre: 'Cable (DirecTV)', icono: '📺' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <nav style={{
        background: '#E30613', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          <span style={{ fontSize: '1.3rem' }}>🏦</span>
          <strong>Compartamos Banco</strong>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem' }}>👤 {sesion?.usuario?.email}</span>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid white', color: 'white',
            padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer'
          }}>Cerrar sesión</button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'transparent', border: '1px solid #E30613', color: '#E30613',
          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer',
          marginBottom: '1.5rem', fontWeight: 600
        }}>← Volver al Dashboard</button>

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>💳 Pagos de Servicios</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Servicios disponibles */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Servicios disponibles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {servicios.map((s) => (
                <div key={s.nombre}
                  onClick={() => setForm({ ...form, servicio: s.nombre })}
                  style={{
                    background: form.servicio === s.nombre ? '#fdecea' : '#f9f9f9',
                    border: form.servicio === s.nombre ? '2px solid #E30613' : '2px solid transparent',
                    borderRadius: 8, padding: '0.75rem', textAlign: 'center',
                    cursor: 'pointer'
                  }}>
                  <div style={{ fontSize: '1.5rem' }}>{s.icono}</div>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>{s.nombre}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario pago */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Datos del pago</h3>
            <form onSubmit={handlePago}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Servicio seleccionado</label>
              <input type="text" value={form.servicio} readOnly
                placeholder="Selecciona un servicio"
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box', background: '#f9f9f9' }}
              />
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>N° de suministro / contrato</label>
              <input type="text" value={form.numero}
                onChange={e => setForm({ ...form, numero: e.target.value })}
                placeholder="Ej: 123456789"
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
              />
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monto a pagar (S/)</label>
              <input type="number" value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })}
                placeholder="0.00" min="1"
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1.5rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
              />

              {error && (
                <div style={{ background: '#fdecea', border: '1px solid #e74c3c', borderRadius: 6, padding: '0.7rem', color: '#c0392b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  ❌ {error}
                </div>
              )}
              {mensaje && (
                <div style={{ background: '#eafaf1', border: '1px solid #27ae60', borderRadius: 6, padding: '0.7rem', color: '#1e8449', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {mensaje}
                </div>
              )}

              <button type="submit" disabled={cargando} style={{
                width: '100%', padding: '0.85rem',
                background: cargando ? '#aaa' : '#E30613',
                color: 'white', border: 'none', borderRadius: 6,
                fontSize: '1rem', fontWeight: 700, cursor: cargando ? 'not-allowed' : 'pointer'
              }}>
                {cargando ? '⏳ Procesando pago...' : 'Pagar ahora'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}