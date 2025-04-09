import { useState } from "react";

const SkillCards = ({ skills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill) => (
        <div key={skill.skillName} className="bg-white shadow-lg rounded-lg p-6 border">
          <h2 className="text-xl font-semibold">{skill.skillName}</h2>
          <p className="text-gray-600 text-sm">Instructor: {skill.staffName}</p>

          {/* View Details Button */}
          <button
            className="text-blue-500 text-sm hover:underline mt-2 block"
            onClick={() => setSelectedSkill(skill)}
          >
            View Details
          </button>

          {/* Book Staff Button */}
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
            Book Staff
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold">{selectedSkill.skillName}</h2>
            <p className="text-gray-600">{selectedSkill.description}</p>

            {/* Instructor */}
            <p className="mt-2"><strong>Instructor:</strong> {selectedSkill.staffName}</p>

            {/* Location */}
            <p><strong>Location:</strong> {selectedSkill.location.city}, {selectedSkill.location.country}  
              {selectedSkill.location.isOnline && " (Online Available)"}
            </p>

            {/* Availability */}
            <p className="mt-2"><strong>Availability:</strong></p>
            <ul className="ml-4 list-disc text-sm">
              {selectedSkill.availability.map((slot, index) => (
                <li key={index}>
                  {slot.fromDay} - {slot.toDay} ({slot.fromTime} to {slot.toTime})
                </li>
              ))}
            </ul>

            {/* Fees */}
            <p className="mt-2"><strong>Class Length:</strong> {selectedSkill.fees.classLength}</p>
            <p><strong>Price:</strong> ${selectedSkill.fees.price}</p>

            {/* Curriculum */}
            <p className="mt-2"><strong>Curriculum:</strong></p>
            <ul className="ml-4 list-disc text-sm">
              {selectedSkill.curriculum.lessons.map((lesson, index) => (
                <li key={index}>
                  <strong>{lesson.title}:</strong> {lesson.objective} - {lesson.description}
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition"
                onClick={() => setSelectedSkill(null)}
              >
                Close
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
                Book Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillCards;
