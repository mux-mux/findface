import React from 'react';

const Rank = ({ userName, userEntries }) => {
  return (
    <div>
      <div className="f3">{userName}, your current find face count is...</div>
      <div className="f1">{userEntries}</div>
    </div>
  );
};

export default Rank;
