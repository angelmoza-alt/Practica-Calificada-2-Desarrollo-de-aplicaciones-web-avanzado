// Modal de Bootstrap controlado por React
export default function Modal({ show, title, onClose, children, footer, size = '' }) {
  if (!show) return null;
  return (
    <>
      <div className="modal-backdrop-custom" onClick={onClose}></div>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}>
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
