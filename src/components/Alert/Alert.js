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
          `flex items-center order my-10 px-4 rounded relative w-fit mx-auto ` +
          classNames
        }
      >
        <span>{message}</span>
        <button
          className="top-0 bottom-0 right-0 px-3 py-3"
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
