import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { validarLogin } from '../utils/validators';
import Field from '../components/Field';

export default function Login() {
  const { user, login, notify } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(params.get('expirada') ? 'Tu sesión expiró, vuelve a iniciar sesión.' : '');
  const [loading, setLoading] = useState(false);
  const [verPass, setVerPass] = useState(false);

  if (user) return <Navigate to="/menu" replace />;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validarLogin(form); // validación en el front-end
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const u = await login(form.username.trim(), form.password);
      notify(`¡Bienvenido, ${u.username}!`);
      navigate(location.state?.from?.pathname || '/menu', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card shadow">
        <div className="card-header">
          <div className="auth-avatar mb-2"><i className="bi bi-person-lock"></i></div>
          <h4 className="mb-0">Iniciar sesión</h4>
          <small className="opacity-75">Sistema de Farmacia</small>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2"><i className="bi bi-x-circle me-2"></i>{error}</div>}
          <form onSubmit={onSubmit} noValidate>
            <Field label="Usuario" name="username" icon="bi-person" value={form.username} onChange={onChange} error={errors.username} autoComplete="username" />
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-key"></i></span>
                <input id="password" name="password" type={verPass ? 'text' : 'password'} className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={onChange} autoComplete="current-password" />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setVerPass(!verPass)} title="Mostrar/ocultar">
                  <i className={`bi ${verPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2"></span>}Ingresar
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
          <div className="small text-muted border-top mt-3 pt-3">
            <strong>Usuarios de prueba</strong> (contraseña <code>123456</code>): admin · moderador · usuario
          </div>
        </div>
      </div>
    </div>
  );
}
