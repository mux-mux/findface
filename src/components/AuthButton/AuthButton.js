const AuthButton = ({
  status,
  errors,
  loadingText,
  defaultText,
  ariaLabel,
}) => (
  <button
    type="submit"
    disabled={status === 'loading' || Object.values(errors).some((err) => err)}
    className="flex w-full justify-center mt-10 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed"
    aria-label={ariaLabel}
  >
    {status === 'loading' ? loadingText : defaultText}
  </button>
);

export default AuthButton;
