import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { selectIsAuthenticated } from "../../store/slice/authSlice";

const LearningMenu = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  
  const handleStartLearningClick = () => {
    navigate('/find-teachers');
  };

  const handlePhotoUpdate = async () => {
    if (!newPhotoUrl.trim()) {
      return;
    }
    
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        "http://localhost:4000/api/user/profile",
        { avatar: newPhotoUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state with new photo
      setProfile({
        ...profile,
        avatar: newPhotoUrl
      });
      
      setShowPhotoModal(false);
      setNewPhotoUrl("");
    } catch (error) {
      console.error("Failed to update profile photo:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-up");
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch skill recommendations
    const fetchRecommendations = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.error("Token is missing. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axios.post(
          "http://localhost:4000/api/skills/recommend", 
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecommendations(response.data.recommendedLessons || []);
      } catch (error) {
        console.error("Error fetching skill recommendations:", error.response?.data || error.message);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchProfile();
    fetchRecommendations();
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  const hasDetails =
    profile?.about && profile?.skills?.length > 0 && profile?.company && profile?.location;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Hello, {profile?.name || profile?.username} 👋
      </h1>

      {hasDetails ? (
        <>
          <div className="bg-white shadow rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-4">
              <div className="relative group">
                
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500">{profile.company}, {profile.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {profile.learnerType === "student" ? "Student" : "Professional"} • Seeking: {profile.seeking}
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{profile.about}</p>
            
            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700">Interests</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.interests.map((interest, index) => (
                    <div key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-3">Your Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {profile.skills.map((skill, index) => (
              <SkillCard key={index} title={skill} />
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-3">Your Learning Roadmap</h2>
          {loadingRecommendations ? (
            <div className="text-center p-4">Loading recommendations...</div>
          ) : (
            <SkillsRoadmap 
              currentSkills={profile.skills} 
              recommendedSkills={recommendations}
              handleStartLearningClick={handleStartLearningClick}
            />
          )}
          
          {/* Additional content after roadmap */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learning Statistics
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Learning streak</span>
                  <span className="font-semibold">3 days</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Hours this week</span>
                  <span className="font-semibold">4.5 hrs</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Completed lessons</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total practice sessions</span>
                  <span className="font-semibold">28</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Upcoming Sessions
              </h2>
              {[
                { id: 1, title: "Advanced JavaScript", time: "Tomorrow, 3:00 PM", instructor: "Alex Johnson" },
                { id: 2, title: "Data Structures", time: "April 26, 10:00 AM", instructor: "Maya Patel" }
              ].map(session => (
                <div key={session.id} className="mb-3 p-3 border border-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-800">{session.title}</h3>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">{session.time}</span>
                    <span className="text-gray-500">with {session.instructor}</span>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => navigate('/find-teachers')} 
                className="w-full mt-2 text-center py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition"
              >
                View All Sessions
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-3">Your profile is incomplete.</p>
          <button
            onClick={() => navigate("/update-profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Complete Profile
          </button>
        </div>
      )}
      
      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Update Profile Photo</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter image URL"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() => setShowPhotoModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={handlePhotoUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SkillCard = ({ title }) => (
  <div className="bg-white border shadow-sm rounded-xl p-4 hover:shadow-md transition">
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

const SkillsRoadmap = ({ currentSkills, recommendedSkills, handleStartLearningClick }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <div className="relative">
        {/* The roadmap line */}
        <div className="absolute left-4 top-8 bottom-8 w-1 bg-blue-200"></div>
        
        {/* Current skills section */}
        <div className="mb-8 relative">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold ml-4">Current Skills</h3>
          </div>
          <div className="ml-12">
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill, index) => (
                <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recommended skills section */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold ml-4">Recommended Path</h3>
          </div>
          <div className="ml-12">
            {recommendedSkills.length > 0 ? (
              <div className="space-y-4">
                {recommendedSkills.map((skill, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="font-medium text-blue-800 capitalize">{skill}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">Difficulty: {getDifficulty(skill)}</div>
                      <button
                        onClick={handleStartLearningClick}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-md transition"
                      >
                        Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recommendations available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to assign difficulty levels
const getDifficulty = (skill) => {
  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const index = Math.abs(skill.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 3;
  return difficulties[index];
};

export default LearningMenu;