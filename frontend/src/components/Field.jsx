// Campo de formulario Bootstrap que muestra el error de validación
export default function Field({ label, name, error, as = 'input', children, icon, ...props }) {
  const cls = `${as === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`;
  const control =
    as === 'select' ? (
      <select id={name} name={name} className={cls} {...props}>{children}</select>
    ) : (
      <input id={name} name={name} className={cls} {...props} />
    );

  return (
    <div className="mb-3">
      {label && <label htmlFor={name} className="form-label">{label}</label>}
      {icon ? (
        <div className="input-group has-validation">
          <span className="input-group-text"><i className={`bi ${icon}`}></i></span>
          {control}
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      ) : (
        <>
          {control}
          {error && <div className="invalid-feedback">{error}</div>}
        </>
      )}
    </div>
  );
}
