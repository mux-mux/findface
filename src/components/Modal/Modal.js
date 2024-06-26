import { useState, useContext } from 'react';
import { UserContext } from '../../App.js';
import Alert from '../Alert/Alert.js';
import Spinner from '../Spinner/Spinner.js';
import useStatus from '../../hooks/useStatus.js';
import './Modal.css';

const Modal = ({ onClose }) => {
  const { user, loadUser } = useContext(UserContext);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newAge, setNewAge] = useState(user.age || 20);
  const [message, setMessage] = useState('');
  const { status, setStatus } = useStatus('idle');

  const onProfileUpdate = async () => {
    if (newEmail !== user.email || newAge !== user.age) {
      try {
        setStatus('loading');

        const response = await fetch(`http://localhost:3001/profile/${user.id}`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: window.localStorage.getItem('token'),
          },
          body: JSON.stringify({
            ...user,
            age: newAge,
            email: newEmail,
            prevEmail: user.email,
            prevAge: user.age,
          }),
        });

        if (response.status === 200) {
          setStatus('success');
          setMessage('Update success');
          loadUser({ ...user, age: newAge, email: newEmail });
        }
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const onRemoveDisabled = (e) => {
    const parent = e.currentTarget.parentNode;
    const childInput = parent.getElementsByClassName('input-profile');
    childInput[0].removeAttribute('disabled');
    childInput[0].focus();
  };

  const onSetEmail = (e) => setNewEmail(e.target.value);
  const onSetAge = (e) => setNewAge(e.target.value);
  const onSetDisabled = (e) => {
    if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'blur') {
      e.target.setAttribute('disabled', 'disabled');
    }
  };

  return (
    <div className="modal">
      <div className="w-min mx-auto min-h-full px-6 py-12 lg:px-8">
        <div className="mx-auto my-8 text-slate-600">
          <svg
            className="w-14 h-14 text-gray-400 -left-1 m-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          <h2 className="my-8 text-center text-2xl font-bold leading-9 tracking-tight">{user.name}</h2>
          <div className="profile">
            <span>Submitted: </span> <span>{`${user.entries} images`}</span>
            <span>Age: </span>{' '}
            <div className="flex">
              <input
                type="number"
                value={newAge}
                disabled
                className="input-profile"
                onChange={onSetAge}
                onBlur={onSetDisabled}
                onKeyDown={onSetDisabled}
              />
              <span className="edit-profile" onClick={onRemoveDisabled}>
                &#9998;
              </span>
            </div>
            <span>Memeber since: </span>
            <span>{new Date(user.joined).toLocaleDateString()}</span>
            <span>Email: </span>{' '}
            <div className="flex">
              <input
                type="email"
                value={newEmail}
                disabled
                className="input-profile"
                onChange={onSetEmail}
                onBlur={onSetDisabled}
                onKeyDown={onSetDisabled}
              />
              <span className="edit-profile" onClick={onRemoveDisabled}>
                &#9998;
              </span>
            </div>
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
            Cancel
          </button>
        </div>
        {status === 'loading' && <Spinner />}
        {(status === 'error' || status === 'success') && <Alert message={message} onClose={() => setStatus('idle')} />}
      </div>
    </div>
  );
};
export default Modal;
