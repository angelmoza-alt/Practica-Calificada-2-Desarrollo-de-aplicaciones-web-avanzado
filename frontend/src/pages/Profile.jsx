import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/data.service';

export default function Profile() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    userService.me().then(setPerfil).catch(() => {});
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 760 }}>
      <h2 className="page-title mb-3"><i className="bi bi-person-badge me-2"></i>Mi perfil</h2>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-3">Usuario</dt><dd className="col-sm-9">{user.username}</dd>
            <dt className="col-sm-3">Email</dt><dd className="col-sm-9">{user.email}</dd>
            <dt className="col-sm-3">Roles</dt>
            <dd className="col-sm-9">{user.roles.map((r) => <span key={r} className="badge bg-primary me-1">{r}</span>)}</dd>
            <dt className="col-sm-3">Registrado</dt>
            <dd className="col-sm-9">{perfil ? new Date(perfil.createdAt).toLocaleString('es-PE') : '…'}</dd>
            <dt className="col-sm-3">Sesión vence</dt>
            <dd className="col-sm-9">{new Date(user.expiresAt).toLocaleString('es-PE')}</dd>
            <dt className="col-sm-3">Token JWT</dt>
            <dd className="col-sm-9"><code className="small text-break">{user.accessToken.slice(0, 40)}…{user.accessToken.slice(-20)}</code></dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
