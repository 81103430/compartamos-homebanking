import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function BandejaPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    const res = await axios.get('http://localhost:3000/api/solicitudes/bandeja', {
      headers: { Authorization: `Bearer ${sesion.token}` }
    });
    setSolicitudes(res.data.solicitudes);
    setCargando(false);
  }

  async function evaluar(id) {
    await axios.patch(`http://localhost:3000/api/solicitudes/${id}/evaluar`, {}, {
      headers: { Authorization: `Bearer ${sesion.token}` }
    });
    cargar();
  }

  async function decidir(id, decision) {
    const comentario = decision === 'aprobado'
      ? 'Crédito aprobado por el comité. Proceder con desembolso.'
      : 'Solicitud rechazada. Capacidad de pago insuficiente.';
    await axios.patch(`http://localhost:3000/api/solicitudes/${id}/decision`,
      { decision, comentario },
      { headers: { Authorization: `Bearer ${sesion.token}` } }
    );
    cargar();
  }

  function handleLogout() { cerrarSesion(); navigate('/'); }

  const colorEstado = {
    'enviado': { bg: '#fff3cd', color: '#856404' },
    'en evaluacion': { bg: '#cce5ff', color: '#004085' },
    'aprobado': { bg: '#eafaf1', color: '#1e8449' },
    'rechazado': { bg: '#fdecea', color: '#c0392b' },
    'desembolsado': { bg: '#e8f5e9', color: '#2e7d32' },
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
          <strong>Compartamos Banco — Comité de Créditos</strong>
        </div>
        <button onClick={handleLogout} style={{
          background: 'transparent', border: '1px solid white', color: 'white',
          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer'
        }}>Cerrar sesión</button>
      </nav>

      <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'transparent', border: '1px solid #E30613', color: '#E30613',
          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer',
          marginBottom: '1.5rem', fontWeight: 600
        }}>← Volver al Dashboard</button>

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>📥 Bandeja de Solicitudes — Comité</h2>

        {cargando ? <p>Cargando...</p> : solicitudes.length === 0 ? (
          <p style={{ color: '#999' }}>No hay solicitudes.</p>
        ) : (
          solicitudes.map((s) => {
            const est = colorEstado[s.estado] || { bg: '#f9f9f9', color: '#333' };
            return (
              <div key={s.id} style={{
                background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
                marginBottom: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                borderLeft: `5px solid ${est.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      {s.perfiles?.nombre || 'Cliente'} — S/ {parseFloat(s.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </h3>
                    <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#636e72' }}>
                      DNI: {s.perfiles?.dni} | {s.cuotas} cuotas
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#333' }}>📝 {s.motivo}</p>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#b2bec3' }}>
                      {new Date(s.fecha_solicitud).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <span style={{ background: est.bg, color: est.color, padding: '0.3rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                      {s.estado.toUpperCase()}
                    </span>
                    {s.estado === 'enviado' && (
                      <button onClick={() => evaluar(s.id)} style={{
                        background: '#0066cc', color: 'white', border: 'none',
                        padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem'
                      }}>🔍 Evaluar</button>
                    )}
                    {s.estado === 'en evaluacion' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => decidir(s.id, 'aprobado')} style={{
                          background: '#00b894', color: 'white', border: 'none',
                          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem'
                        }}>✅ Aprobar</button>
                        <button onClick={() => decidir(s.id, 'rechazado')} style={{
                          background: '#E30613', color: 'white', border: 'none',
                          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem'
                        }}>❌ Rechazar</button>
                      </div>
                    )}
                  </div>
                </div>
                {s.comentario && (
                  <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: '#636e72', fontStyle: 'italic', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                    💬 {s.comentario}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}