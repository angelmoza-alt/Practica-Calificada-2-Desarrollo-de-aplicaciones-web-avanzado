import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { laboratorioService, medicamentoService } from '../services/data.service';
import { getErrorMessage } from '../services/api';
import { validarMedicamento } from '../utils/validators';
import Field from '../components/Field';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

const VACIO = {
  descripcionMed: '', fechaFabricacion: '', fechaVencimiento: '', presentacion: '',
  stock: '', precioVentaUni: '', precioVentaPres: '', marca: '', codLab: '',
};
const soles = (n) => `S/ ${Number(n).toFixed(2)}`;
const fecha = (f) => f.split('-').reverse().join('/');

export default function Medicamentos() {
  const { canEdit, isAdmin, notify } = useAuth();
  const [params, setParams] = useSearchParams();
  const [lista, setLista] = useState([]);
  const [labs, setLabs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState('');
  const codLab = params.get('codLab') || '';
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [borrar, setBorrar] = useState(null);

  const cargar = async (texto = q, lab = codLab) => {
    setCargando(true);
    try {
      const p = {};
      if (texto) p.q = texto;
      if (lab) p.codLab = lab;
      setLista(await medicamentoService.getAll(p));
    } catch (err) {
      notify(getErrorMessage(err), 'danger');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { laboratorioService.getAll().then(setLabs).catch(() => {}); }, []);
  useEffect(() => { cargar(q, codLab); }, [codLab]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (params.get('nuevo') && canEdit) { abrirNuevo(); setParams({}, { replace: true }); }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const abrirNuevo = () => { setForm({ ...VACIO, codLab }); setEditId(null); setErrors({}); setModal(true); };
  const abrirEditar = (m) => {
    const f = {};
    Object.keys(VACIO).forEach((k) => (f[k] = String(m[k] ?? '')));
    setForm(f); setEditId(m.codMedicamento); setErrors({}); setModal(true);
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const guardar = async (e) => {
    e.preventDefault();
    const errs = validarMedicamento(form); // validación en el front-end
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setGuardando(true);
    try {
      if (editId) await medicamentoService.update(editId, form);
      else await medicamentoService.create(form);
      notify(editId ? 'Medicamento actualizado' : 'Medicamento registrado');
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
      await medicamentoService.remove(borrar.codMedicamento);
      notify('Medicamento eliminado');
      cargar();
    } catch (err) {
      notify(getErrorMessage(err), 'danger');
    } finally {
      setGuardando(false);
      setBorrar(null);
    }
  };

  const filtrarLab = (v) => setParams(v ? { codLab: v } : {});

  return (
    <div className="container-fluid px-lg-5 py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0"><i className="bi bi-capsule me-2"></i>Medicamentos</h2>
        {canEdit && (
          <button className="btn btn-danger" onClick={abrirNuevo}><i className="bi bi-plus-lg me-1"></i>Nuevo Medicamento</button>
        )}
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <form className="input-group" onSubmit={(e) => { e.preventDefault(); cargar(); }}>
            <input className="form-control" placeholder="Buscar por descripción o marca" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn btn-outline-primary"><i className="bi bi-search"></i> Buscar</button>
          </form>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={codLab} onChange={(e) => filtrarLab(e.target.value)}>
            <option value="">Todos los laboratorios</option>
            {labs.map((l) => <option key={l.codLab} value={l.codLab}>{l.razonSocial}</option>)}
          </select>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Cód.</th><th>Descripción</th><th>Marca</th><th>Presentación</th><th>Laboratorio</th>
                <th>F. Fabric.</th><th>F. Venc.</th><th className="text-end">Stock</th>
                <th className="text-end">P. Unit.</th><th className="text-end">P. Pres.</th><th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="11" className="text-center py-4"><span className="spinner-border text-primary"></span></td></tr>
              ) : lista.length === 0 ? (
                <tr><td colSpan="11" className="text-center text-muted py-4">No hay medicamentos</td></tr>
              ) : (
                lista.map((m) => (
                  <tr key={m.codMedicamento}>
                    <td>{m.codMedicamento}</td>
                    <td className="fw-semibold">{m.descripcionMed}</td>
                    <td>{m.marca}</td>
                    <td>{m.presentacion}</td>
                    <td>{m.laboratorio?.razonSocial}</td>
                    <td>{fecha(m.fechaFabricacion)}</td>
                    <td>{fecha(m.fechaVencimiento)}</td>
                    <td className="text-end">
                      <span className={`badge ${m.stock < 100 ? 'bg-warning text-dark' : 'bg-success'}`}>{m.stock}</span>
                    </td>
                    <td className="text-end text-nowrap">{soles(m.precioVentaUni)}</td>
                    <td className="text-end text-nowrap">{soles(m.precioVentaPres)}</td>
                    <td className="text-center text-nowrap">
                      {canEdit && (
                        <button className="btn btn-sm btn-outline-primary me-1" title="Editar" onClick={() => abrirEditar(m)}><i className="bi bi-pencil"></i></button>
                      )}
                      {isAdmin && (
                        <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => setBorrar(m)}><i className="bi bi-trash"></i></button>
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
        size="modal-lg"
        title={editId ? 'Editar Medicamento' : 'Nuevo Medicamento'}
        onClose={() => setModal(false)}
        footer={
          <>
            <button type="submit" form="formMed" className="btn btn-primary" disabled={guardando}>
              {guardando && <span className="spinner-border spinner-border-sm me-2"></span>}Guardar
            </button>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
          </>
        }
      >
        <form id="formMed" onSubmit={guardar} noValidate>
          <div className="row">
            <div className="col-md-8"><Field label="Descripción" name="descripcionMed" value={form.descripcionMed} onChange={onChange} error={errors.descripcionMed} /></div>
            <div className="col-md-4"><Field label="Marca" name="marca" value={form.marca} onChange={onChange} error={errors.marca} /></div>
            <div className="col-md-6">
              <Field as="select" label="Laboratorio" name="codLab" value={form.codLab} onChange={onChange} error={errors.codLab}>
                <option value="">-- Seleccione --</option>
                {labs.map((l) => <option key={l.codLab} value={l.codLab}>{l.razonSocial}</option>)}
              </Field>
            </div>
            <div className="col-md-6"><Field label="Presentación" name="presentacion" value={form.presentacion} onChange={onChange} error={errors.presentacion} placeholder="Ej: Caja x 100 tabletas" /></div>
            <div className="col-md-6"><Field label="Fecha de fabricación" name="fechaFabricacion" type="date" value={form.fechaFabricacion} onChange={onChange} error={errors.fechaFabricacion} /></div>
            <div className="col-md-6"><Field label="Fecha de vencimiento" name="fechaVencimiento" type="date" value={form.fechaVencimiento} onChange={onChange} error={errors.fechaVencimiento} /></div>
            <div className="col-md-4"><Field label="Stock" name="stock" type="number" min="0" value={form.stock} onChange={onChange} error={errors.stock} /></div>
            <div className="col-md-4"><Field label="Precio venta unitario (S/)" name="precioVentaUni" type="number" step="0.01" min="0" value={form.precioVentaUni} onChange={onChange} error={errors.precioVentaUni} /></div>
            <div className="col-md-4"><Field label="Precio venta presentación (S/)" name="precioVentaPres" type="number" step="0.01" min="0" value={form.precioVentaPres} onChange={onChange} error={errors.precioVentaPres} /></div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        show={!!borrar}
        message={`¿Eliminar el medicamento "${borrar?.descripcionMed}"?`}
        onConfirm={eliminar}
        onCancel={() => setBorrar(null)}
        loading={guardando}
      />
    </div>
  );
}
