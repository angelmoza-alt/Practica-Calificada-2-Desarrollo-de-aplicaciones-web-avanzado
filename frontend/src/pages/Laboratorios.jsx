import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { laboratorioService } from '../services/data.service';
import { getErrorMessage } from '../services/api';
import { validarLaboratorio } from '../utils/validators';
import Field from '../components/Field';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

const VACIO = { razonSocial: '', direccion: '', telefono: '', email: '', contacto: '' };

export default function Laboratorios() {
  const { canEdit, isAdmin, notify } = useAuth();
  const [params, setParams] = useSearchParams();
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [borrar, setBorrar] = useState(null);

  const cargar = async (texto = q) => {
    setCargando(true);
    try {
      setLista(await laboratorioService.getAll(texto ? { q: texto } : undefined));
    } catch (err) {
      notify(getErrorMessage(err), 'danger');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(''); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Abre el modal "Nuevo" si se llega desde el menú Almacén > Nuevo laboratorio
  useEffect(() => {
    if (params.get('nuevo') && canEdit) { abrirNuevo(); setParams({}, { replace: true }); }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setErrors({}); setModal(true); };
  const abrirEditar = (l) => {
    setForm({ razonSocial: l.razonSocial, direccion: l.direccion, telefono: l.telefono, email: l.email, contacto: l.contacto });
    setEditId(l.codLab); setErrors({}); setModal(true);
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const guardar = async (e) => {
    e.preventDefault();
    const errs = validarLaboratorio(form); // validación en el front-end
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setGuardando(true);
    try {
      if (editId) await laboratorioService.update(editId, form);
      else await laboratorioService.create(form);
      notify(editId ? 'Laboratorio actualizado' : 'Laboratorio registrado');
      setModal(false);
      cargar();
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      notify(getErrorMessage(err), 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    setGuardando(true);
    try {
      await laboratorioService.remove(borrar.codLab);
      notify('Laboratorio eliminado');
      cargar();
    } catch (err) {
      notify(getErrorMessage(err), 'danger');
    } finally {
      setGuardando(false);
      setBorrar(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0"><i className="bi bi-building me-2"></i>Laboratorios</h2>
        {canEdit && (
          <button className="btn btn-danger" onClick={abrirNuevo}><i className="bi bi-plus-lg me-1"></i>Nuevo Laboratorio</button>
        )}
      </div>

      <form className="input-group mb-3" style={{ maxWidth: 420 }} onSubmit={(e) => { e.preventDefault(); cargar(); }}>
        <input className="form-control" placeholder="Buscar por razón social o contacto" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-outline-primary"><i className="bi bi-search"></i> Buscar</button>
      </form>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Cód.</th><th>Razón social</th><th>Dirección</th><th>Teléfono</th><th>Email</th><th>Contacto</th><th className="text-center">Medicamentos</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="8" className="text-center py-4"><span className="spinner-border text-primary"></span></td></tr>
              ) : lista.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted py-4">No hay laboratorios</td></tr>
              ) : (
                lista.map((l) => (
                  <tr key={l.codLab}>
                    <td>{l.codLab}</td>
                    <td className="fw-semibold">{l.razonSocial}</td>
                    <td>{l.direccion}</td>
                    <td>{l.telefono}</td>
                    <td>{l.email}</td>
                    <td>{l.contacto}</td>
                    <td className="text-center">
                      <Link to={`/medicamentos?codLab=${l.codLab}`} className="badge bg-info text-dark text-decoration-none" title="Ver sus medicamentos">
                        {l.totalMedicamentos}
                      </Link>
                    </td>
                    <td className="text-center text-nowrap">
                      {canEdit && (
                        <button className="btn btn-sm btn-outline-primary me-1" title="Editar" onClick={() => abrirEditar(l)}><i className="bi bi-pencil"></i></button>
                      )}
                      {isAdmin && (
                        <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => setBorrar(l)}><i className="bi bi-trash"></i></button>
                      )}
                      {!canEdit && <span className="text-muted small">Solo lectura</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={modal}
        title={editId ? 'Editar Laboratorio' : 'Nuevo Laboratorio'}
        onClose={() => setModal(false)}
        footer={
          <>
            <button type="submit" form="formLab" className="btn btn-primary" disabled={guardando}>
              {guardando && <span className="spinner-border spinner-border-sm me-2"></span>}Guardar
            </button>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
          </>
        }
      >
        <form id="formLab" onSubmit={guardar} noValidate>
          <Field label="Razón social" name="razonSocial" value={form.razonSocial} onChange={onChange} error={errors.razonSocial} />
          <Field label="Dirección" name="direccion" value={form.direccion} onChange={onChange} error={errors.direccion} />
          <div className="row">
            <div className="col-md-6"><Field label="Teléfono" name="telefono" value={form.telefono} onChange={onChange} error={errors.telefono} /></div>
            <div className="col-md-6"><Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} /></div>
          </div>
          <Field label="Persona de contacto" name="contacto" value={form.contacto} onChange={onChange} error={errors.contacto} />
        </form>
      </Modal>

      <ConfirmModal
        show={!!borrar}
        message={`¿Eliminar el laboratorio "${borrar?.razonSocial}"?`}
        onConfirm={eliminar}
        onCancel={() => setBorrar(null)}
        loading={guardando}
      />
    </div>
  );
}
