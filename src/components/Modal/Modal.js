import "./Modal.css";

const Modal = ({ onClose, user, loadUser }) => {
  const onProfileUpdate = (data) => {
    fetch(`http://localhost:3000/profile/${user.id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formInput: data }),
    })
      .then((res) => {
        onClose();
        loadUser({ ...user, ...data });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="modal">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto my-8 text-slate-600">
          <svg
            className="w-14 h-14 text-gray-400 -left-1 m-auto"
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
          <h2 className="my-8 text-center text-2xl font-bold leading-9 tracking-tight">
            {user.name}
          </h2>
          <div className="profile">
            <span>Submitted: </span> <span>{user.entries}</span>
            <span>Age: </span> <span> {user.age}</span>
            <span>Memeber since: </span>
            <span>{new Date(user.joined).toLocaleDateString()}</span>
            <span>Email: </span> <span>{user.email} </span>
          </div>
        </div>

        <div className="flex justify-around">
          <button
            type="button"
            onClick={onProfileUpdate}
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
      </div>
    </div>
  );
};
export default Modal;
