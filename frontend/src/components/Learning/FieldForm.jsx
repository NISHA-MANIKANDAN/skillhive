import { useEffect, useState } from "react";

const FieldForm = ({ field, onSave, onSkip }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    setInputValue("");
    setSelectedOptions([]);
  }, [field]);

  const labelMap = {
    location: "Your Location",
    company: "Company or School",
    about: "Tell us about yourself",
    skills: "Your Key Skills",
    learnerType: "Are you a student, professional, etc.?",
    interests: "What are you interested in learning?",
    seeking: "What are you seeking?",
  };

  const locationOptions = ["New York", "London", "Chennai", "Tokyo", "Remote"];
  const checkboxOptions = {
    skills: ["JavaScript", "Python", "C++", "Machine Learning", "React"],
    interests: ["Web Dev", "AI", "IoT", "Cybersecurity", "DSA"],
    seeking: ["Jobs", "Internships", "Projects", "Mentorship"],
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const multiSelectFields = ["skills", "interests"];

    const valueToSave = multiSelectFields.includes(field)
      ? selectedOptions
      : selectedOptions[0] || inputValue;
    
    onSave(field, valueToSave);
  };

  const renderInputField = () => {
    if (field === "location") {
      return (
        <select
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a location</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      );
    }

    if (field in checkboxOptions) {
      return (
        <div className="flex flex-col gap-2">
          {checkboxOptions[field].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={labelMap[field]}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium mb-2">
        {labelMap[field] || field}
      </label>
      {renderInputField()}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-gray-500 hover:underline"
        >
          Skip
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default FieldForm;
