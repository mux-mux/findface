import { useState, useEffect } from 'react';

const fetchEmoji = async (entries) => {
  try {
    if (!entries) return '🤔';

    const response = await fetch(
      `https://znq0m5iub3.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`
    );

    if (!response || !response.json) throw new Error('Invalid response');

    const data = await response.json();
    return data?.input || '🤔';
  } catch (error) {
    console.error('Error fetching emoji:', error);
    return '🤔';
  }
};

const Rank = ({ userName, userEntries }) => {
  const [emoji, setEmoji] = useState(localStorage.getItem('rankBadge') || '🤔');

  useEffect(() => {
    const generateEmoji = async () => {
      const newEmoji = await fetchEmoji(userEntries);
      setEmoji(newEmoji);
      localStorage.setItem('rankBadge', newEmoji);
    };

    if (userEntries) {
      generateEmoji();
    }
  }, [userEntries]);

  return (
    <div>
      <div className="text-xl mt-10">
        {userName}, your current find face tries count is...
      </div>
      <div className="text-4xl my-4">{userEntries}</div>
      <div className="text-4xl my-4">{`Rank Badge: ${emoji}`}</div>
    </div>
  );
};

export default Rank;
