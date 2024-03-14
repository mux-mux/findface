import React, { useState, useEffect } from "react";

const Rank = ({ userName, userEntries }) => {
  const [emoji, setEmoji] = useState("");

  const generateEmoji = (entries) => {
    fetch(
      `https://znq0m5iub3.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`,
    )
      .then((resp) => resp.json())
      .then((data) => setEmoji(data.input))
      .catch(console.log);
  };

  useEffect(() => {
    generateEmoji(userEntries);
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
