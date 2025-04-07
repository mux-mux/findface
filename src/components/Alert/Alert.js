import { useRef } from 'react';
import FocusLock from 'react-focus-lock';
import useOutsideClick from '../../hooks/useOutsideClick.js';

const Alert = ({ onClose, message }) => {
  const alertRef = useRef(null);
  useOutsideClick(alertRef, onClose);

  let classNames = message.toLowerCase().includes('success')
    ? 'bg-teal-100 border-teal-400 text-teal-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <FocusLock returnFocus allowOutsideClick={() => true}>
      <div
        ref={alertRef}
        role="alert"
        className={
          `fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center px-4 py-2 rounded z-50 ` +
          classNames
        }
      >
        <span>{message}</span>
        <button
          className="p-1 ml-3"
          onClick={onClose}
          aria-label={`Close ${message}`}
        >
          <b>X</b>
        </button>
      </div>
    </FocusLock>
  );
};
export default Alert;
