import { useReducer } from 'react';

const useToggle = (initialValue) => {
  return useReducer((state) => !state, initialValue || false);
};

export default useToggle;
