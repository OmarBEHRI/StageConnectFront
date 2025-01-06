import { useState, useEffect, useMemo } from 'react';

export default function FormComponent({ isOpen, onClose, onSubmit, fields, title, submitButtonText, prefillData = null }) {
  // Compute initial form data only when prefillData changes and is not null
  const initialFormData = useMemo(() => {
    if (!prefillData) {
      // If prefillData is null or undefined, initialize with empty values
      return fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {});
    }
    // If prefillData is provided, use it to prefill the form
    return fields.reduce((acc, field) => {
      acc[field.name] = prefillData[field.name] || '';
      return acc;
    }, {});
  }, [prefillData]); // Only recompute when prefillData changes

  // Initialize formData state with initialFormData
  const [formData, setFormData] = useState(initialFormData);

  // Update formData only when initialFormData changes (e.g., when prefillData changes)
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-gray-700 mb-2">{field.placeholder}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                >
                  <option value="">Select {field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}