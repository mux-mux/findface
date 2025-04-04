const FormInput = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  error,
  autoComplete,
  required = true,
  maxLength,
  placeholder,
}) => {
  return (
    <div className="mb-4 relative">
      <label htmlFor={id} className="block text-sm font-medium leading-6 pb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        onChange={onChange}
        value={value}
      />
      {error && (
        <span
          className="absolute text-error text-xs mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
