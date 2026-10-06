import { useEffect, useState } from 'react';
import { medicamentoService } from '../services/data.service';

// Panel exclusivo de moderador/admin: alertas de stock bajo y próximos vencimientos
export default function PanelModerador() {
  const [meds, setMeds] = useState([]);

  useEffect(() => { medicamentoService.getAll().then(setMeds).catch(() => {}); }, []);

  const hoy = new Date();
  const en6Meses = new Date(hoy.getFullYear(), hoy.getMonth() + 6, hoy.getDate()).toISOString().slice(0, 10);
  const stockBajo = meds.filter((m) => m.stock < 100).sort((a, b) => a.stock - b.stock);
  const porVencer = meds.filter((m) => m.fechaVencimiento <= en6Meses);
  const valorInventario = meds.reduce((s, m) => s + m.stock * Number(m.precioVentaUni), 0);

  const Tabla = ({ items, cols }) =>
    items.length === 0 ? (
      <p className="text-muted mb-0 p-3">Sin alertas 🎉</p>
    ) : (
      <table className="table table-sm mb-0">
        <thead><tr>{cols.map((c) => <th key={c[0]}>{c[0]}</th>)}</tr></thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.codMedicamento}>{cols.map((c) => <td key={c[0]}>{c[1](m)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );

  return (
    <div className="container py-4">
      <h2 className="page-title mb-3"><i className="bi bi-clipboard-data me-2"></i>Panel Moderador</h2>
      <div className="alert alert-info">
        Valor total del inventario (precio unitario × stock): <strong>S/ {valorInventario.toFixed(2)}</strong>
      </div>
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-warning fw-semibold"><i className="bi bi-exclamation-triangle me-2"></i>Stock bajo (&lt; 100 unidades)</div>
            <Tabla items={stockBajo} cols={[['Medicamento', (m) => m.descripcionMed], ['Laboratorio', (m) => m.laboratorio?.razonSocial], ['Stock', (m) => m.stock]]} />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-danger text-white fw-semibold"><i className="bi bi-calendar-x me-2"></i>Vencen en los próximos 6 meses</div>
            <Tabla items={porVencer} cols={[['Medicamento', (m) => m.descripcionMed], ['Vence', (m) => m.fechaVencimiento.split('-').reverse().join('/')], ['Stock', (m) => m.stock]]} />
          </div>
        </div>
      </div>
    </div>
  );
}
