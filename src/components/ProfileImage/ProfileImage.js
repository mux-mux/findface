const SIZES = {
  sm: 'w-14 h-14',
  md: 'w-20 h-20',
  lg: 'w-24 h-24'
}
const ProfileImage = ({ src, alt, size }) => {
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClass} rounded-full object-cover border`}
        />
      ) : (
        <svg
          className={`absolute ${sizeClass} text-gray-400 -left-1`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </>
  );
};

export default ProfileImage;
