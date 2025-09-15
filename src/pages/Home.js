import DOMPurify from 'dompurify';
import { useState } from 'react';
import ImageForm from '../components/ImageForm/ImageForm.js';
import Rank from '../components/Rank/Rank.js';
import FindFace from '../components/FindFace/FindFace.js';

const Home = ({ user, imageUrl, onUserDataChange, setImageUrl }) => {
  const [input, setInput] = useState('');

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onImageSubmit = async (e) => {
    e.preventDefault();
    const sanitizedUrl = DOMPurify.sanitize(input).trim();
    (await isImageUrl(sanitizedUrl)) && setImageUrl(sanitizedUrl);
  };

  function isImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => {
        alert('Url is not an image');
        resolve(false);
      };
      img.src = url;
    });
  }

  return (
    <div className="text-center">
      <Rank userName={user.name} userEntries={user.entries} />
      <ImageForm onInputChange={onInputChange} onImageSubmit={onImageSubmit} />
      {imageUrl && (
        <FindFace
          imageUrl={imageUrl}
          onUserDataChange={onUserDataChange}
          user={user}
        />
      )}
    </div>
  );
};

export default Home;
