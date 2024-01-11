import React from 'react';

const Rank = ({ userName, userEntries }) => {
  return (
    <div>
      <div className="text-xl mt-10">{userName}, your current find face tries count is...</div>
      <div className="text-4xl my-4">{userEntries}</div>
    </div>
  );
};

export default Rank;
