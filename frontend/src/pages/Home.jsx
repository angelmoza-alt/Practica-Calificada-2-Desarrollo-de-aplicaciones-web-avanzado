import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/data.service';

// Menú principal: se muestra al iniciar sesión
export default function Home() {
  const { user, isAdmin, canEdit } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    userService.stats().then(setStats).catch(() => setStats(null));
  }, []);

  const modulos = [
    { to: '/medicamentos', icon: 'bi-capsule', color: 'primary', title: 'Medicamentos', desc: canEdit ? 'Registrar, editar y consultar medicamentos' : 'Consultar el catálogo de medicamentos', show: true },
    { to: '/laboratorios', icon: 'bi-building', color: 'success', title: 'Laboratorios', desc: canEdit ? 'Gestionar los laboratorios proveedores' : 'Consultar los laboratorios', show: true },
    { to: '/moderador', icon: 'bi-clipboard-data', color: 'warning', title: 'Panel Moderador', desc: 'Control de stock bajo y vencimientos', show: canEdit },
    { to: '/admin/usuarios', icon: 'bi-people', color: 'danger', title: 'Usuarios y roles', desc: 'Administrar cuentas y permisos', show: isAdmin },
    { to: '/perfil', icon: 'bi-person-badge', color: 'secondary', title: 'Mi perfil', desc: 'Ver mis datos y mi token', show: true },
  ];

  const tarjetas = [
    { label: 'Medicamentos', value: stats?.medicamentos, icon: 'bi-capsule', bg: 'bg-primary' },
    { label: 'Laboratorios', value: stats?.laboratorios, icon: 'bi-building', bg: 'bg-success' },
    { label: 'Stock bajo (<100)', value: stats?.stockBajo, icon: 'bi-exclamation-triangle', bg: 'bg-warning' },
    { label: 'Usuarios', value: stats?.usuarios, icon: 'bi-people', bg: 'bg-danger' },
  ];

  return (
    <div className="container py-4">
      <div className="p-4 mb-4 bg-white rounded-4 shadow-sm">
        <h2 className="page-title mb-1">Hola, {user.username} 👋</h2>
        <p className="text-muted mb-0">Bienvenido al menú principal del sistema de farmacia.</p>
      </div>

      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-6 col-lg-3" key={t.label}>
            <div className={`card stat-card ${t.bg} shadow-sm`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="small opacity-75">{t.label}</div>
                  <div className="fs-3 fw-bold">{t.value ?? '—'}</div>
                </div>
                <i className={`bi ${t.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mb-3">Módulos</h5>
      <div className="row g-3">
        {modulos.filter((m) => m.show).map((m) => (
          <div className="col-sm-6 col-lg-4" key={m.to}>
            <Link to={m.to} className="text-decoration-none">
              <div className="card module-card shadow-sm h-100">
                <div className="card-body d-flex gap-3 align-items-center">
                  <span className={`icon bg-${m.color}-subtle text-${m.color}`}><i className={`bi ${m.icon}`}></i></span>
                  <div>
                    <h6 className="mb-1 text-dark">{m.title}</h6>
                    <small className="text-muted">{m.desc}</small>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
