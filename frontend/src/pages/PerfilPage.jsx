import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerSesion, cerrarSesion } from '../services/authService';

export default function PerfilPage() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const [perfil, setPerfil] = useState(null);
  const [cuenta, setCuenta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await axios.get('http://localhost:3000/api/usuario/perfil', {
          headers: { Authorization: `Bearer ${sesion.token}` }
        });
        setPerfil(res.data.perfil);
        setCuenta(res.data.cuenta);
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

      <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'transparent', border: '1px solid #E30613', color: '#E30613',
          padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer',
          marginBottom: '1.5rem', fontWeight: 600
        }}>← Volver al Dashboard</button>

        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>👤 Mi Perfil</h2>

        {cargando ? (
          <p style={{ color: '#999' }}>Cargando perfil...</p>
        ) : (
          <>
            {/* Avatar y nombre */}
            <div style={{
              background: 'white', borderRadius: 12, padding: '2rem',
              marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              textAlign: 'center'
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#E30613', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto 1rem'
              }}>
                {perfil?.nombre?.charAt(0) || '?'}
              </div>
              <h3 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>{perfil?.nombre}</h3>
              <p style={{ margin: '0.3rem 0 0', color: '#636e72', fontSize: '0.9rem' }}>
                {sesion?.usuario?.email}
              </p>
              <span style={{
                display: 'inline-block', marginTop: '0.5rem',
                background: '#eafaf1', color: '#1e8449',
                padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600
              }}>
                ✅ Cliente activo
              </span>
            </div>

            {/* Datos personales */}
            <div style={{
              background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
              marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
            }}>
              <h3 style={{ color: '#333', marginBottom: '1rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>
                📋 Datos personales
              </h3>
              {[
                { label: 'Nombre completo', valor: perfil?.nombre },
                { label: 'DNI', valor: perfil?.dni },
                { label: 'Teléfono', valor: perfil?.telefono },
                { label: 'Correo electrónico', valor: sesion?.usuario?.email },
                { label: 'Cliente desde', valor: new Date(perfil?.created_at).toLocaleDateString('es-PE') },
              ].map((d) => (
                <div key={d.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.75rem 0', borderBottom: '1px solid #f9f9f9'
                }}>
                  <span style={{ color: '#636e72', fontSize: '0.9rem' }}>{d.label}</span>
                  <span style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>{d.valor}</span>
                </div>
              ))}
            </div>

            {/* Datos de cuenta */}
            <div style={{
              background: 'white', borderRadius: 12, padding: '1.5rem 2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)'
            }}>
              <h3 style={{ color: '#333', marginBottom: '1rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>
                🏦 Datos de cuenta
              </h3>
              {[
                { label: 'Número de cuenta', valor: cuenta?.numero_cuenta },
                { label: 'Tipo de cuenta', valor: cuenta?.tipo?.toUpperCase() },
                { label: 'Saldo disponible', valor: `S/ ${parseFloat(cuenta?.saldo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                { label: 'Fecha apertura', valor: new Date(cuenta?.created_at).toLocaleDateString('es-PE') },
              ].map((d) => (
                <div key={d.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.75rem 0', borderBottom: '1px solid #f9f9f9'
                }}>
                  <span style={{ color: '#636e72', fontSize: '0.9rem' }}>{d.label}</span>
                  <span style={{ fontWeight: 600, color: d.label === 'Saldo disponible' ? '#00b894' : '#333', fontSize: '0.9rem' }}>{d.valor}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}