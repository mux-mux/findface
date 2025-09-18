import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';

export const initialUserState = {
  id: 0,
  name: '',
  email: '',
  profileImage: 'http://localhost:3001/uploads/default-profile-image.png',
  age: 0,
  entries: 0,
  joined: '',
};

const UserContext = createContext(null);

const useUser = () => {
  const { user, setUser, loadUser, onUserDataChange } = useContext(UserContext);

  return { user, setUser, loadUser, onUserDataChange };
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserState);

  const loadUser = useCallback((userProfile) => {
    setUser({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      profileImage: userProfile.profileImage,
      age: userProfile.age,
      entries: userProfile.entries,
      joined: userProfile.joined,
    });
  }, []);

  const onUserDataChange = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/signin', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const data = await response.json();

        if (data?.id) {
          const profile = await fetch(
            `http://localhost:3001/profile/${data.id}`,
            {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          );
          const profileData = await profile.json();

          if (profileData?.email) {
            loadUser(profileData);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [loadUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loadUser, onUserDataChange }}>
      {children}
    </UserContext.Provider>
  );
};

export { useUser, UserProvider };
