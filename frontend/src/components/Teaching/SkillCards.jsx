import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Constants
const API_BASE_URL = "http://localhost:4000/api";

const SkillCards = ({ skills = [], userId }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [bookedSkills, setBookedSkills] = useState([]); // Track booked skills
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's booked skills on component mount
  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const response = await axios.get(`${API_BASE_URL}/skills/my-skills`, config);
        
        // Ensure bookedSkills is always an array
        const skillsData = response.data || [];
        setBookedSkills(Array.isArray(skillsData) ? skillsData : [skillsData]);
        
        console.log("Fetched booked skills:", skillsData);
      } catch (error) {
        console.error("Error fetching user skills:", error);
        setBookedSkills([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserSkills();
  }, []);
  
  const handleBookStaff = async (skill) => {
    try {
      // Mark as booked in the frontend
      setBookedSkills((prev) => [...prev, skill]);
  
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert("Please log in to book the staff!");
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      await axios.put(`${API_BASE_URL}/user/profile`, 
        {
          userId,
          bookedSkill: skill.skillName,
          skillId: skill._id // Use skill ID
        },
        config
      );
  
      alert("Staff successfully booked!");
    } catch (error) {
      console.error("Error booking staff", error);
      alert("Failed to book staff.");
      // Roll back UI change if the API call fails
      setBookedSkills(prev => prev.filter(s => s._id !== skill._id));
    }
  };
  
  const goToClass = (skill) => {
    const skillId = skill._id;
    if (!skillId) {
      console.error("No skill ID found:", skill);
      alert("Error: Skill ID not found");
      return;
    }
    navigate(`/course-content-review/${skillId}`);
  };
  
  // Check if a skill is already booked - safely handle non-array data
  const isSkillBooked = (skill) => {
    if (!Array.isArray(bookedSkills)) {
      console.warn("bookedSkills is not an array:", bookedSkills);
      return false;
    }
    
    const skillId = skill._id;
    const skillName = skill.skillName;
    
    return bookedSkills.some(bookedSkill => {
      if (typeof bookedSkill === 'string') {
        return bookedSkill === skillName;
      } else if (bookedSkill && typeof bookedSkill === 'object') {
        return bookedSkill._id === skillId || bookedSkill.skillName === skillName;
      }
      return false;
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading your skills...</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill) => {
        const booked = isSkillBooked(skill);
        
        return (
          <div key={skill._id} className="bg-white shadow-lg rounded-lg p-6 border">
            <h2 className="text-xl font-semibold">{skill.skillName}</h2>
            <p className="text-gray-600 text-sm">Instructor: {skill.staffName}</p>

            <button
              className="text-blue-500 text-sm hover:underline mt-2 block"
              onClick={() => setSelectedSkill(skill)}
            >
              View Details
            </button>

            <button
              className={`mt-4 px-4 py-2 rounded-md text-sm transition ${
                booked
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-primary text-white hover:bg-primary"
              }`}
              onClick={() => booked ? goToClass(skill) : handleBookStaff(skill)}
            >
              {booked ? "Go to Class" : "Book Staff"}
            </button>
          </div>
        );
      })}

      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold">{selectedSkill.skillName}</h2>
            <p className="text-gray-600">{selectedSkill.description}</p>
            <p className="mt-2"><strong>Instructor:</strong> {selectedSkill.staffName}</p>
            <p>
              <strong>Location:</strong> {selectedSkill.location.city}, {selectedSkill.location.country}
              {selectedSkill.location.isOnline && " (Online Available)"}
            </p>
            <p className="mt-2"><strong>Availability:</strong></p>
            <ul className="ml-4 list-disc text-sm">
              {selectedSkill.availability.map((slot, index) => (
                <li key={index}>
                  {slot.fromDay} - {slot.toDay} ({slot.fromTime} to {slot.toTime})
                </li>
              ))}
            </ul>
            <p className="mt-2"><strong>Class Length:</strong> {selectedSkill.fees.classLength}</p>
            <p><strong>Price:</strong> ${selectedSkill.fees.price}</p>
            <p className="mt-2"><strong>Curriculum:</strong></p>
            <ul className="ml-4 list-disc text-sm">
              {selectedSkill.curriculum.lessons.map((lesson, index) => (
                <li key={index}>
                  <strong>{lesson.title}:</strong> {lesson.objective} - {lesson.description}
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition"
                onClick={() => setSelectedSkill(null)}
              >
                Close
              </button>
              {isSkillBooked(selectedSkill) ? (
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
                  onClick={() => {
                    setSelectedSkill(null);
                    goToClass(selectedSkill);
                  }}
                >
                  Go to Class
                </button>
              ) : (
                <button 
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary transition"
                  onClick={() => {
                    handleBookStaff(selectedSkill);
                    setSelectedSkill(null);
                  }}
                >
                  Book Staff
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes
SkillCards.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      skillName: PropTypes.string.isRequired,
      staffName: PropTypes.string.isRequired,
      description: PropTypes.string,
      location: PropTypes.shape({
        city: PropTypes.string,
        country: PropTypes.string,
        isOnline: PropTypes.bool,
      }),
      availability: PropTypes.arrayOf(
        PropTypes.shape({
          fromDay: PropTypes.string,
          toDay: PropTypes.string,
          fromTime: PropTypes.string,
          toTime: PropTypes.string,
        })
      ),
      fees: PropTypes.shape({
        classLength: PropTypes.string,
        price: PropTypes.number,
      }),
      curriculum: PropTypes.shape({
        lessons: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            objective: PropTypes.string,
            description: PropTypes.string,
          })
        ),
      }),
    })
  ),
  userId: PropTypes.string.isRequired,
};

export default SkillCards;