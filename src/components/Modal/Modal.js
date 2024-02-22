import { useState } from 'react';
import './Modal.css';

const Modal = ({ onClose, user }) => {
  const [userUpdate, setUserUpdate] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
  });

  const onFormChange = (event) => {
    switch (event.target.name) {
      case 'name':
        setUserUpdate({ ...userUpdate, name: event.target.value });
        break;
      case 'age':
        setUserUpdate({ ...userUpdate, age: event.target.value });
        break;
      case 'email':
        setUserUpdate({ ...userUpdate, email: event.target.value });
        break;
      default:
        return;
    }
  };

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
            {userUpdate.name}
          </h2>
          <h4 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight">
            `Images Submitted: ${user.entries}`
          </h4>
          <p>`Memeber since: ${new Date(user.joined).toLocaleDateString}`</p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 my-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                onChange={onFormChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <label htmlFor="name" className="block text-sm font-medium leading-6 my-2">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                autoComplete="age"
                required
                onChange={onFormChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <label htmlFor="name" className="block text-sm font-medium leading-6 my-2">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={onFormChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex justify-around">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Modal;
