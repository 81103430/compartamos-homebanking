import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function CreditosPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [creditos, setCreditos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await axios.get('http://localhost:3000/api/creditos', {
          headers: { Authorization: `Bearer ${sesion.token}` }
        });
        setCreditos(res.data.creditos);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function handleLogout() {
    cerrarSesion();
    navigate('/');
  }

  const colorEstado = {
    desembolsado: '#00b894',
    aprobado: '#0066cc',
    'en evaluacion': '#f39c12',
    enviado: '#636e72',
    rechazado: '#E30613'
  };

  function cronograma(monto, cuotas) {
    const interes = 0.025;
    const cuota = (monto * interes) / (1 - Math.pow(1 + interes, -cuotas));
    return cuota.toFixed(2);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      {/* Navbar */}
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

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>📋 Módulo de Créditos</h2>

        {cargando ? (
          <p style={{ color: '#999' }}>Cargando créditos...</p>
        ) : creditos.length === 0 ? (
          <p style={{ color: '#999' }}>No tienes créditos activos.</p>
        ) : (
          creditos.map((c) => (
            <div key={c.id} style={{
              background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
              marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              borderLeft: `5px solid ${colorEstado[c.estado] || '#636e72'}`
            }}>
              {/* Encabezado crédito */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#333' }}>Crédito MYPE #{c.id}</h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#636e72' }}>
                    Solicitado: {new Date(c.fecha_solicitud).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <span style={{
                  background: colorEstado[c.estado] || '#636e72',
                  color: 'white', padding: '0.3rem 1rem',
                  borderRadius: 20, fontSize: '0.85rem', fontWeight: 600
                }}>
                  {c.estado.toUpperCase()}
                </span>
              </div>

              {/* Datos del crédito */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Monto total', valor: `S/ ${parseFloat(c.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, color: '#E30613' },
                  { label: 'N° de cuotas', valor: `${c.cuotas} meses`, color: '#333' },
                  { label: 'Cuota mensual', valor: `S/ ${cronograma(c.monto, c.cuotas)}`, color: '#0066cc' },
                  { label: 'Tasa mensual', valor: '2.5%', color: '#636e72' },
                ].map((d) => (
                  <div key={d.label} style={{ background: '#f9f9f9', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.78rem', color: '#636e72', margin: '0 0 0.3rem' }}>{d.label}</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: d.color, margin: 0 }}>{d.valor}</p>
                  </div>
                ))}
              </div>

              {/* Cronograma */}
              <h4 style={{ color: '#333', marginBottom: '0.75rem' }}>📅 Cronograma de pagos</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9' }}>
                      {['Cuota', 'Vencimiento', 'Capital', 'Interés', 'Total', 'Estado'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'center', color: '#636e72', borderBottom: '2px solid #eee' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.min(c.cuotas, 6) }).map((_, i) => {
                      const cuotaMensual = parseFloat(cronograma(c.monto, c.cuotas));
                      const interesMes = (c.monto * 0.025).toFixed(2);
                      const capitalMes = (cuotaMensual - interesMes).toFixed(2);
                      const fecha = new Date();
                      fecha.setMonth(fecha.getMonth() + i + 1);
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 600 }}>{i + 1}</td>
                          <td style={{ padding: '0.6rem', textAlign: 'center' }}>{fecha.toLocaleDateString('es-PE')}</td>
                          <td style={{ padding: '0.6rem', textAlign: 'center' }}>S/ {capitalMes}</td>
                          <td style={{ padding: '0.6rem', textAlign: 'center' }}>S/ {interesMes}</td>
                          <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 700, color: '#E30613' }}>S/ {cuotaMensual.toFixed(2)}</td>
                          <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                            <span style={{
                              background: i === 0 ? '#fdecea' : '#eafaf1',
                              color: i === 0 ? '#c0392b' : '#1e8449',
                              padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem'
                            }}>
                              {i === 0 ? 'Pendiente' : 'Por vencer'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {c.cuotas > 6 && (
                  <p style={{ textAlign: 'center', color: '#636e72', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Mostrando 6 de {c.cuotas} cuotas
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}