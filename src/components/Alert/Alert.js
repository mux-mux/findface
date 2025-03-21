import FocusLock from 'react-focus-lock';

const Alert = ({ onClose, message }) => {
  let classNames = message.toLowerCase().includes('success')
    ? 'bg-teal-100 border-teal-400 text-teal-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <FocusLock>
      <div
        className={
          `flex items-center order my-10 px-4 rounded relative min-w-min mx-auto ` +
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
