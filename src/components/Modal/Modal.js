import './Modal.css';

const Modal = ({ onClose }) => {
  return (
    <div className="modal">
      <div>Dialog Window</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
export default Modal;
