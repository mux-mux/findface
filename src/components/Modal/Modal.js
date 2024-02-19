import './Modal.css';

const Modal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto text-center">
          <svg
            className="w-14 h-14 text-gray-400 -left-1 inline-block"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            ></path>
          </svg>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            John Bow
          </h2>
          <h4 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight">
            Images Submitted: 5
          </h4>
          <p>Memeber since: July 2023</p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <button className="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  );
};
export default Modal;
