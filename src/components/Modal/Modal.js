import { useState, useCallback, useContext } from 'react';
import FocusLock from 'react-focus-lock';
import { UserContext } from '../../App.js';
import Alert from '../Alert/Alert.js';
import Spinner from '../Spinner/Spinner.js';
import ProfileImage from '../ProfileImage/ProfileImage.js';
import useStatus from '../../hooks/useStatus.js';
import './Modal.css';

const Modal = ({ onClose }) => {
  const { user, loadUser } = useContext(UserContext);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newAge, setNewAge] = useState(user.age || 20);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(user.profileImage || '');
  const [preview, setPreview] = useState(user.profileImage || '');
  const { status, setStatus } = useStatus('idle');

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setImage(file);
  };

  const onProfileUpdate = useCallback(async () => {
    if (newEmail === user.email && newAge === user.age && preview === image)
      return;

    setStatus('loading');
    let imageUrl = user.profileImage;

    try {
      if (image && typeof image !== 'string') {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('userId', user.id);

        const uploadResponse = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: window.localStorage.getItem('token'),
          },
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.error);

        imageUrl = uploadData.imageUrl;
      }

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
          profileImage: imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Profile update failed');

      setStatus('success');
      setMessage('Profile updated successfully');
      loadUser({
        ...user,
        age: newAge,
        email: newEmail,
        profileImage: imageUrl,
      });
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }, [newEmail, newAge, preview, image, user, loadUser, setStatus]);

  const enableEditing = (e) => {
    const input = e.currentTarget.previousElementSibling;
    input.removeAttribute('disabled');
    input.focus();
  };

  const disableEditing = (e) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      e.target.setAttribute('disabled', 'disabled');
    }
  };

  return (
    <FocusLock>
      <div
        className="fixed top-0 left-0 w-full h-full overflow-auto modal"
        role="dialog"
      >
        <div className="flex flex-col justify-center mx-auto w-min py-20">
          <div className="mx-auto mb-8 text-slate-600">
            <div className="flex flex-col items-center">
              <ProfileImage
                src={preview || user.profileImage}
                alt={`${user.name} profile`}
                size="lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="mt-2 upload-button"
                aria-label="Upload an image from PC"
              />
            </div>
            <h2 className="my-8 text-xl text-center font-semibold text-gray-800">
              {user.name}
            </h2>
            <div className="profile">
              <div className="grid-rows">
                <span>Submitted: </span> <span>{`${user.entries} images`}</span>
              </div>
              <div className="grid-rows">
                <span>Age: </span>{' '}
                <div className="flex">
                  <input
                    type="number"
                    value={newAge}
                    disabled
                    className="input-profile"
                    onChange={(e) => setNewAge(+e.target.value)}
                    onBlur={disableEditing}
                    onKeyDown={disableEditing}
                    aria-label="Enter your age"
                  />
                  <button
                    className="edit-profile"
                    onClick={enableEditing}
                    aria-label="Edit your age"
                  >
                    &#9998;
                  </button>
                </div>
              </div>
              <div className="grid-rows">
                <span>Memeber since: </span>
                <span>{new Date(user.joined).toLocaleDateString()}</span>
              </div>
              <div className="grid-rows">
                <span>Email: </span>{' '}
                <div className="flex">
                  <input
                    type="email"
                    value={newEmail}
                    disabled
                    className="input-profile"
                    onChange={(e) => setNewEmail(e.target.value)}
                    onBlur={disableEditing}
                    onKeyDown={disableEditing}
                    aria-label="Enter your email"
                  />
                  <button
                    className="edit-profile"
                    onClick={enableEditing}
                    aria-label="Edit your email"
                  >
                    &#9998;
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-around">
            <button
              type="button"
              onClick={onProfileUpdate}
              className="w-1/2 mr-2 bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              aria-label="Save profile updates"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 ml-2 bg-red-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-red-700 focus:ring-4 focus:ring-red-300"
              aria-label="Cancel profile updates"
            >
              Cancel
            </button>
          </div>
          {status === 'loading' && <Spinner />}
          {(status === 'error' || status === 'success') && (
            <Alert message={message} onClose={() => setStatus('idle')} />
          )}
        </div>
      </div>
    </FocusLock>
  );
};

export default Modal;
