import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function TransferenciasPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [historial, setHistorial] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [form, setForm] = useState({ cuenta_destino: '', monto: '', descripcion: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarHistorial();
    cargarSaldo();
  }, []);

  async function cargarSaldo() {
    const res = await axios.get('http://localhost:3000/api/usuario/perfil', {
      headers: { Authorization: `Bearer ${sesion.token}` }
    });
    setSaldo(res.data.cuenta.saldo);
  }

  async function cargarHistorial() {
    const res = await axios.get('http://localhost:3000/api/transferencias/historial', {
      headers: { Authorization: `Bearer ${sesion.token}` }
    });
    setHistorial(res.data.transferencias);
  }

  async function handleTransferencia(e) {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);
    try {
      await axios.post('http://localhost:3000/api/transferencias', form, {
        headers: { Authorization: `Bearer ${sesion.token}` }
      });
      setMensaje('✅ Transferencia realizada exitosamente');
      setForm({ cuenta_destino: '', monto: '', descripcion: '' });
      cargarHistorial();
      cargarSaldo();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar transferencia');
    } finally {
      setCargando(false);
    }
  }

  function handleLogout() {
    cerrarSesion();
    navigate('/');
  }

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

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>💸 Transferencias y Pagos</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Formulario */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Nueva transferencia</h3>
            <p style={{ color: '#636e72', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Saldo disponible: <strong style={{ color: '#00b894' }}>S/ {parseFloat(saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
            </p>

            <form onSubmit={handleTransferencia}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cuenta destino</label>
              <input
                type="text" value={form.cuenta_destino}
                onChange={e => setForm({ ...form, cuenta_destino: e.target.value })}
                placeholder="Ej: 0011-0456-789012"
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
              />
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monto (S/)</label>
              <input
                type="number" value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })}
                placeholder="0.00" min="1"
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
              />
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Descripción</label>
              <input
                type="text" value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Ej: Pago de alquiler"
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
                {cargando ? '⏳ Procesando...' : 'Realizar transferencia'}
              </button>
            </form>
          </div>

          {/* Historial */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>📋 Historial de transferencias</h3>
            {historial.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>No hay transferencias realizadas.</p>
            ) : (
              historial.map((t) => (
                <div key={t.id} style={{
                  borderBottom: '1px solid #f0f0f0', padding: '0.75rem 0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>{t.cuenta_destino}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#636e72' }}>{t.descripcion}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#b2bec3' }}>{new Date(t.fecha).toLocaleDateString('es-PE')}</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#E30613', fontSize: '1rem' }}>
                    - S/ {parseFloat(t.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}