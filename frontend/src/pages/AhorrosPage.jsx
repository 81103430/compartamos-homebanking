import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function AhorrosPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [cuenta, setCuenta] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await axios.get('http://localhost:3000/api/ahorros', {
          headers: { Authorization: `Bearer ${sesion.token}` }
        });
        setCuenta(res.data.cuenta);
        setMovimientos(res.data.movimientos);
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
        
        {/* Botón volver */}
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'transparent', border: '1px solid #E30613', color: '#E30613',
          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer',
          marginBottom: '1.5rem', fontWeight: 600
        }}>← Volver al Dashboard</button>

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>💰 Módulo de Ahorros</h2>

        {cargando ? (
          <p style={{ color: '#999' }}>Cargando información...</p>
        ) : (
          <>
            {/* Tarjeta cuenta */}
            <div style={{
              background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
              marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              borderLeft: '5px solid #00b894',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '1rem'
            }}>
              <div>
                <p style={{ color: '#636e72', fontSize: '0.85rem', margin: 0 }}>Cuenta de Ahorros</p>
                <p style={{ color: '#333', fontWeight: 600, margin: '0.2rem 0' }}>{cuenta?.numero_cuenta}</p>
                <p style={{ color: '#636e72', fontSize: '0.8rem', margin: 0 }}>
                  Abierta desde: {new Date(cuenta?.created_at).toLocaleDateString('es-PE')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#636e72', fontSize: '0.85rem', margin: 0 }}>Saldo disponible</p>
                <p style={{ color: '#00b894', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                  S/ {parseFloat(cuenta?.saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Últimos movimientos */}
            <div style={{
              background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
            }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>📋 Estado de cuenta — Últimos movimientos</h3>
              
              {movimientos.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>No hay movimientos registrados.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.85rem', color: '#636e72', borderBottom: '2px solid #eee' }}>Fecha</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.85rem', color: '#636e72', borderBottom: '2px solid #eee' }}>Descripción</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.85rem', color: '#636e72', borderBottom: '2px solid #eee' }}>Tipo</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.85rem', color: '#636e72', borderBottom: '2px solid #eee' }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((m) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#636e72' }}>
                          {new Date(m.fecha).toLocaleDateString('es-PE')}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#333' }}>{m.descripcion}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            background: m.tipo === 'deposito' ? '#eafaf1' : '#fdecea',
                            color: m.tipo === 'deposito' ? '#1e8449' : '#c0392b',
                            padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600
                          }}>
                            {m.tipo === 'deposito' ? '⬆ Depósito' : '⬇ Retiro'}
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem', textAlign: 'right', fontWeight: 700,
                          color: m.tipo === 'deposito' ? '#00b894' : '#E30613', fontSize: '0.95rem'
                        }}>
                          {m.tipo === 'deposito' ? '+' : '-'} S/ {parseFloat(m.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}