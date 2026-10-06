import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/data.service';
import { getErrorMessage } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

const ROLES = [
  { key: 'moderator', label: 'Moderador' },
  { key: 'admin', label: 'Admin' },
];

// Página solo para ADMIN: lista de usuarios y asignación de roles
export default function Usuarios() {
  const { user, notify } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [borrar, setBorrar] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargar = () => userService.getAll().then(setUsuarios).catch((e) => notify(getErrorMessage(e), 'danger'));
  useEffect(() => { cargar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRol = async (u, rol) => {
    const roles = u.roles.includes(rol) ? u.roles.filter((r) => r !== rol) : [...u.roles, rol];
    try {
      const act = await userService.updateRoles(u.id, roles);
      setUsuarios(usuarios.map((x) => (x.id === u.id ? act : x)));
      notify(`Roles de ${u.username} actualizados`);
    } catch (e) {
      notify(getErrorMessage(e), 'danger');
    }
  };

  const eliminar = async () => {
    setCargando(true);
    try {
      await userService.remove(borrar.id);
      notify('Usuario eliminado');
      cargar();
    } catch (e) {
      notify(getErrorMessage(e), 'danger');
    } finally {
      setCargando(false);
      setBorrar(null);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="page-title mb-3"><i className="bi bi-people me-2"></i>Usuarios y roles</h2>
      <p className="text-muted">Todos los usuarios tienen el rol <strong>user</strong>. Marca las casillas para darles más permisos.</p>
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr><th>ID</th><th>Usuario</th><th>Email</th>{ROLES.map((r) => <th key={r.key} className="text-center">{r.label}</th>)}<th className="text-center">Acciones</th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td className="fw-semibold">{u.username} {u.id === user.id && <span className="badge bg-secondary">tú</span>}</td>
                  <td>{u.email}</td>
                  {ROLES.map((r) => (
                    <td key={r.key} className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={u.roles.includes(r.key)}
                        disabled={u.id === user.id && r.key === 'admin'}
                        onChange={() => toggleRol(u, r.key)}
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-danger" disabled={u.id === user.id} onClick={() => setBorrar(u)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal show={!!borrar} message={`¿Eliminar al usuario "${borrar?.username}"?`} onConfirm={eliminar} onCancel={() => setBorrar(null)} loading={cargando} />
    </div>
  );
}
