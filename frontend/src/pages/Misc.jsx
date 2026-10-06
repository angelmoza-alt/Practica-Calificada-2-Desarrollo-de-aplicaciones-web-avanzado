import { Link } from 'react-router-dom';

export function NoAutorizado() {
  return (
    <div className="container py-5 text-center">
      <i className="bi bi-shield-x text-danger" style={{ fontSize: '4rem' }}></i>
      <h3 className="mt-3">Acceso denegado</h3>
      <p className="text-muted">Tu rol no tiene permiso para ver esta página.</p>
      <Link to="/menu" className="btn btn-primary">Volver al menú</Link>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-3 fw-bold text-primary">404</h1>
      <p className="text-muted">La página no existe.</p>
      <Link to="/" className="btn btn-primary">Ir al inicio</Link>
    </div>
  );
}
