import { useEffect, useState } from 'react';

const useStatus = (initialStatus = 'idle') => {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') {
      return;
    }

    // const timeoutId = setTimeout(() => {
    //   setStatus('idle');
    // }, 10000);

    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }, [status]);

  return { status, setStatus };
};

export default useStatus;
