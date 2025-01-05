import { useState } from 'react';

export default function FormComponent({ isOpen, onClose, onSubmit, fields, title }) {
  const [formData, setFormData] = useState(
    // Create initial state dynamically from fields
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            field.type === 'select' ? (
              <select
                key={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
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
                key={field.name}
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              />
            )
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

