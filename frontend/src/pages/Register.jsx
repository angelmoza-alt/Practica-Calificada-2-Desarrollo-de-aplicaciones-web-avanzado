import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import { getErrorMessage } from '../services/api';
import { validarRegistro } from '../utils/validators';
import Field from '../components/Field';

export default function Register() {
  const { user, notify } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/menu" replace />;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validarRegistro(form); // validación en el front-end
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const { data } = await AuthService.register(form.username.trim(), form.email.trim(), form.password);
      notify(data.message);
      navigate('/login');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card shadow">
        <div className="card-header">
          <div className="auth-avatar mb-2"><i className="bi bi-person-plus"></i></div>
          <h4 className="mb-0">Crear cuenta</h4>
          <small className="opacity-75">Regístrate para acceder al sistema</small>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={onSubmit} noValidate>
            <Field label="Usuario" name="username" icon="bi-person" value={form.username} onChange={onChange} error={errors.username} />
            <Field label="Email" name="email" type="email" icon="bi-envelope" value={form.email} onChange={onChange} error={errors.email} />
            <Field label="Contraseña" name="password" type="password" icon="bi-key" value={form.password} onChange={onChange} error={errors.password} />
            <Field label="Confirmar contraseña" name="confirm" type="password" icon="bi-key-fill" value={form.confirm} onChange={onChange} error={errors.confirm} />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2"></span>}Registrarme
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
