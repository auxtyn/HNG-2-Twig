const FormInput = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={`input ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  )
}

export default FormInput