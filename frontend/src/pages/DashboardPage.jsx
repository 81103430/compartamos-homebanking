import { useNavigate } from 'react-router-dom';
import { obtenerSesion, cerrarSesion } from '../services/authService';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [perfil, setPerfil] = useState(null);
  const [cuenta, setCuenta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await axios.get('http://localhost:3000/api/usuario/perfil', {
          headers: { Authorization: `Bearer ${sesion.token}` }
        });
        setPerfil(res.data.perfil);
        setCuenta(res.data.cuenta);
      } catch (err) {
        console.error('Error cargando perfil:', err);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🏦</span>
          <strong>Compartamos Banco</strong>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem' }}>👤 {sesion?.usuario?.email}</span>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid white', color: 'white',
            padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontWeight: 600
          }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>

        {/* Saludo personalizado */}
        <div style={{
          background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
          marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
          borderLeft: '5px solid #E30613'
        }}>
          {cargando ? (
            <p style={{ color: '#999' }}>Cargando tu información...</p>
          ) : (
            <>
              <h2 style={{ color: '#E30613', margin: 0 }}>
                ¡Bienvenida, {perfil?.nombre || sesion?.usuario?.email}! 👋
              </h2>
              <p style={{ color: '#636e72', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
                DNI: {perfil?.dni || '—'} &nbsp;|&nbsp; Tel: {perfil?.telefono || '—'}
              </p>
            </>
          )}
        </div>

        {/* Tarjetas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem', marginBottom: '1.5rem'
        }}>
          {[
            {
              titulo: 'Cuenta Ahorros',
              valor: cuenta ? `S/ ${parseFloat(cuenta.saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : 'S/ —',
              sub: cuenta?.numero_cuenta || '—',
              color: '#00b894',
              icono: '💰'
            },
            {
              titulo: 'Crédito Activo',
              valor: 'S/ 8,000.00',
              sub: 'Crédito MYPE',
              color: '#E30613',
              icono: '📋'
            },
            {
              titulo: 'Próxima Cuota',
              valor: '15/06/2026',
              sub: 'S/ 450.00',
              color: '#e17055',
              icono: '📅'
            },
          ].map((t) => (
            <div key={t.titulo} style={{
              background: 'white', borderRadius: 10,
              padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              borderLeft: `4px solid ${t.color}`
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.icono}</div>
              <p style={{ fontSize: '0.85rem', color: '#636e72', margin: '0 0 0.3rem' }}>{t.titulo}</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: t.color, margin: 0 }}>{t.valor}</p>
              <p style={{ fontSize: '0.78rem', color: '#b2bec3', margin: '0.2rem 0 0' }}>{t.sub}</p>
            </div>
          ))}
        </div>

        {/* Módulos próximos */}
        <div style={{
          background: 'white', borderRadius: 10, padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Mis servicios</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {[
              { nombre: 'Ahorros', icono: '🏦' },
              { nombre: 'Créditos', icono: '📋' },
              { nombre: 'Transferencias', icono: '💸' },
              { nombre: 'Pagos', icono: '💳' },
              { nombre: 'Mi Perfil', icono: '👤' },
            ].map((s) => (
              <div key={s.nombre} style={{
                background: '#f9f9f9', borderRadius: 8, padding: '1rem',
                textAlign: 'center', cursor: 'pointer', border: '1px solid #eee',
                transition: 'all 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#E30613'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#eee'}
              >
                <div style={{ fontSize: '1.8rem' }}>{s.icono}</div>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{s.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}