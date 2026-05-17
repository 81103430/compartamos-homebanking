import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function SolicitudCreditoPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [form, setForm] = useState({ monto: '', cuotas: '12', motivo: '' });
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => { cargarSolicitudes(); }, []);

  async function cargarSolicitudes() {
    const res = await axios.get('http://localhost:3000/api/solicitudes', {
      headers: { Authorization: `Bearer ${sesion.token}` }
    });
    setSolicitudes(res.data.solicitudes);
  }

  async function handleSolicitud(e) {
    e.preventDefault();
    setError(''); setMensaje('');
    if (!form.monto || !form.motivo) { setError('Completa todos los campos'); return; }
    setCargando(true);
    try {
      await axios.post('http://localhost:3000/api/solicitudes', form, {
        headers: { Authorization: `Bearer ${sesion.token}` }
      });
      setMensaje('✅ Solicitud enviada correctamente. En breve será evaluada.');
      setForm({ monto: '', cuotas: '12', motivo: '' });
      cargarSolicitudes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setCargando(false);
    }
  }

  function handleLogout() { cerrarSesion(); navigate('/'); }

  const colorEstado = {
    'enviado': { bg: '#fff3cd', color: '#856404', label: '📤 ENVIADO' },
    'en evaluacion': { bg: '#cce5ff', color: '#004085', label: '🔍 EN EVALUACIÓN' },
    'aprobado': { bg: '#eafaf1', color: '#1e8449', label: '✅ APROBADO' },
    'rechazado': { bg: '#fdecea', color: '#c0392b', label: '❌ RECHAZADO' },
    'desembolsado': { bg: '#e8f5e9', color: '#2e7d32', label: '💰 DESEMBOLSADO' },
  };

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

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>🏦 Solicitud de Crédito</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Formulario */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Nueva solicitud</h3>
            <form onSubmit={handleSolicitud}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monto solicitado (S/)</label>
              <input type="number" value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })}
                placeholder="Ej: 5000" min="500" max="50000"
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
              />

              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>N° de cuotas</label>
              <select value={form.cuotas}
                onChange={e => setForm({ ...form, cuotas: e.target.value })}
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}>
                {[6, 12, 18, 24, 36].map(n => (
                  <option key={n} value={n}>{n} meses</option>
                ))}
              </select>

              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Motivo del crédito</label>
              <textarea value={form.motivo}
                onChange={e => setForm({ ...form, motivo: e.target.value })}
                placeholder="Ej: Capital de trabajo para mi negocio de abarrotes"
                rows={4}
                style={{ display: 'block', width: '100%', padding: '0.7rem', margin: '0.4rem 0 1.5rem', border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }}
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
                {cargando ? '⏳ Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
          </div>

          {/* Historial solicitudes */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>📋 Mis solicitudes</h3>
            {solicitudes.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>No tienes solicitudes aún.</p>
            ) : (
              solicitudes.map((s) => {
                const est = colorEstado[s.estado] || { bg: '#f9f9f9', color: '#333', label: s.estado };
                return (
                  <div key={s.id} style={{
                    border: '1px solid #eee', borderRadius: 8, padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#333' }}>S/ {parseFloat(s.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
                      <span style={{ background: est.bg, color: est.color, padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                        {est.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#636e72' }}>{s.cuotas} cuotas | {s.motivo}</p>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#b2bec3' }}>
                      Enviado: {new Date(s.fecha_solicitud).toLocaleDateString('es-PE')}
                    </p>
                    {s.comentario && (
                      <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#636e72', fontStyle: 'italic' }}>
                        💬 {s.comentario}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}