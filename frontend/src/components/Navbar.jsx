import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROL_BADGE = {
  admin: { text: 'Administrador', cls: 'bg-danger' },
  moderator: { text: 'Moderador', cls: 'bg-warning text-dark' },
  user: { text: 'Usuario', cls: 'bg-light text-dark' },
};

// La barra de navegación cambia sus elementos según el rol del usuario
export default function Navbar() {
  const { user, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  const rol = isAdmin ? 'admin' : isModerator ? 'moderator' : 'user';
  const link = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '');

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to={user ? '/menu' : '/login'}>
          <i className="bi bi-capsule-pill me-1"></i> Farmacia
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          {user && (
            <ul className="navbar-nav me-auto">
              {/* Todos los usuarios */}
              <li className="nav-item">
                <NavLink className={link} to="/menu"><i className="bi bi-house-door me-1"></i>Inicio</NavLink>
              </li>

              {/* Rol USUARIO: solo consulta */}
              {!isModerator && !isAdmin && (
                <>
                  <li className="nav-item">
                    <NavLink className={link} to="/medicamentos"><i className="bi bi-capsule me-1"></i>Medicamentos</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={link} to="/laboratorios"><i className="bi bi-building me-1"></i>Laboratorios</NavLink>
                  </li>
                </>
              )}

              {/* Rol MODERADOR o ADMIN: gestión del almacén */}
              {(isModerator || isAdmin) && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="bi bi-box-seam me-1"></i>Almacén
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/medicamentos"><i className="bi bi-capsule me-2"></i>Medicamentos</Link></li>
                    <li><Link className="dropdown-item" to="/laboratorios"><i className="bi bi-building me-2"></i>Laboratorios</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/medicamentos?nuevo=1"><i className="bi bi-plus-circle me-2"></i>Nuevo medicamento</Link></li>
                    <li><Link className="dropdown-item" to="/laboratorios?nuevo=1"><i className="bi bi-plus-circle me-2"></i>Nuevo laboratorio</Link></li>
                  </ul>
                </li>
              )}
              {(isModerator || isAdmin) && (
                <li className="nav-item">
                  <NavLink className={link} to="/moderador"><i className="bi bi-clipboard-data me-1"></i>Panel Moderador</NavLink>
                </li>
              )}

              {/* Rol ADMIN: administración */}
              {isAdmin && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="bi bi-shield-lock me-1"></i>Administración
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/admin/usuarios"><i className="bi bi-people me-2"></i>Usuarios y roles</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center">
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>{user.username}
                  <span className={`badge ms-2 ${ROL_BADGE[rol].cls}`}>{ROL_BADGE[rol].text}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil"><i className="bi bi-person me-2"></i>Mi perfil</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={cerrarSesion}>
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={link} to="/login"><i className="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={link} to="/registro"><i className="bi bi-person-plus me-1"></i>Registrarse</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
