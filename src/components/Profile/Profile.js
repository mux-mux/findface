import { useState, useContext, useCallback, Fragment } from 'react';
import { UserContext } from '../../App.js';
import { createPortal } from 'react-dom';
import { Menu, Transition } from '@headlessui/react';

import Modal from '../Modal/Modal.js';
import ProfileImage from '../ProfileImage/ProfileImage.js';

const Profile = ({ onRouteChange }) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext);

  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const handleSignOut = useCallback(
    () => onRouteChange('signout'),
    [onRouteChange]
  );

  return (
    <div className="flex justify-center">
      {showModal &&
        createPortal(<Modal onClose={handleCloseModal} />, document.body)}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900">
            <div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <ProfileImage
                src={user.profileImage}
                alt={`${user.name} profile`}
                size="sm"
              />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                    onClick={handleOpenModal}
                  >
                    Account settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
export default Profile;
