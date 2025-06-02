import "../../css/Modal.css" 

export function Modal({ show, onClose, url }: { show: boolean; onClose: () => void; url: string }) {
  if (!show) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2 className="modal-title">🎉 Rapport prêt !</h2>
        <p className="modal-text">Votre rapport a été généré avec succès.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="modal-link">
           Consulter le rapport
        </a>
      </div>
    </div>
  )
}

