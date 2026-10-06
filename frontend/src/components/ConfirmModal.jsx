import Modal from './Modal';

export default function ConfirmModal({ show, message, onConfirm, onCancel, loading }) {
  return (
    <Modal
      show={show}
      title="Confirmar eliminación"
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}Eliminar
          </button>
        </>
      }
    >
      <p className="mb-0"><i className="bi bi-exclamation-triangle text-danger me-2"></i>{message}</p>
    </Modal>
  );
}
