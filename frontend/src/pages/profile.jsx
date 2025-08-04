import  { useState, useEffect } from "react";
import { MapPin, Briefcase, Edit2, Plus, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    name: "",
    about: "",
    avatar: "",
    company: "",
    location: "",
    skills: [],
    learnerType: "",
    interests: [],
    seeking: "",
    isStaff: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [appliedSkills, setAppliedSkills] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserSkills();
    fetchAppliedSkills();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get("http://localhost:4000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data.user);
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError("Failed to fetch profile data.");
      }
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/skills/my-skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerifiedSkills(res.data);
    } catch (err) {
      console.error("Failed to fetch verified skills:", err);
    }
  };

  const fetchAppliedSkills = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/skills/my-skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedSkills(res.data.skills || []);
    } catch (err) {
      console.error("Failed to fetch applied skills:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");

      await axios.put(
        "http://localhost:4000/api/user/profile",
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      setError("Failed to update profile.");
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const navigateToCourseUpload = (skillId) => {
    navigate(`/course-content/${skillId}`);
  };

  const getMissingFields = () => {
    const missing = [];
    if (!userData.name) missing.push("Name");
    if (!userData.about) missing.push("About");
    if (!userData.location) missing.push("Location");
    if (!userData.company) missing.push("Company");
    if (!userData.skills?.length) missing.push("Skills");
    return missing;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  const missingFields = getMissingFields();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-t-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {missingFields.length > 0 && !editing && (
        <div className="bg-yellow-50 p-4 rounded-t-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
            <span className="font-medium text-yellow-800">Complete your profile</span>
          </div>
          <p className="text-yellow-700">
            Missing information: {missingFields.join(", ")}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-2 text-yellow-800 underline hover:text-yellow-900"
          >
            Complete Now
          </button>
        </div>
      )}

      <div className="h-40 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg relative">
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden">
            <img
              src={userData.avatar || "/api/placeholder/400/400"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="space-y-1">
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={userData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="block w-full border p-2 rounded"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name || "Add your name"}
                </h1>
              )}
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <button
            onClick={editing ? handleSubmit : () => setEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            {editing ? (
              <input
                type="text"
                name="location"
                value={userData.location || ""}
                onChange={handleInputChange}
                placeholder="Enter your location"
                className="border p-2 rounded flex-1"
              />
            ) : (
              userData.location || "Add your location"
            )}
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-5 h-5 mr-2" />
            {editing ? (
              <input
                type="text"
                name="company"
                value={userData.company || ""}
                onChange={handleInputChange}
                placeholder="Enter your company"
                className="border p-2 rounded flex-1"
              />
            ) : (
              userData.company || "Add your company"
            )}
          </div>
        </div>

        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          {editing ? (
            <textarea
              name="about"
              value={userData.about || ""}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="w-full border p-2 rounded min-h-[100px]"
            />
          ) : (
            <p className="text-gray-600">
              {userData.about || "Add information about yourself"}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Skills</h2>
          </div>

          {editing && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill"
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {userData.skills?.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center"
              >
                {skill}
                {editing && (
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {(!userData.skills || userData.skills.length === 0) && (
            <p className="text-gray-500 text-center py-4">
              No skills added yet. {editing ? "Use the input above to add your skills." : "Click 'Edit Profile' to add your skills."}
            </p>
          )}
        </div>

        {/* Applied Skills Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Applied Skills</h2>
          <div className="flex flex-wrap gap-2">
            {appliedSkills && appliedSkills.length > 0 ? (
              appliedSkills.map((skill) => (
                <div
                  key={skill._id}
                  className={`px-3 py-1 rounded-full flex items-center ${
                    skill.isVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  } ${skill.isVerified ? "cursor-pointer hover:bg-green-100" : ""}`}
                  onClick={() => {
                    if (skill.isVerified ) {
                      navigateToCourseUpload(skill._id);
                    }
                  }}
                >
                  {skill.skillName}
                  {skill.isVerified ? (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 ml-2 text-amber-500" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No applied skills found.</p>
            )}
          </div>
          {userData.isStaff && (
            <p className="text-sm text-gray-500 mt-4">
              Click on a verified skill (green) to upload course content.
            </p>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="font-medium">Learner Type:</label>
              {editing ? (
                <input
                  type="text"
                  name="learnerType"
                  value={userData.learnerType || ""}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              ) : (
                <p className="text-gray-700">{userData.learnerType || "Add your learner type"}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Seeking:</label>
              {editing ? (
                <input
                  type="text"
                  name="seeking"
                  value={userData.seeking || ""}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mt-1"
                />
              ) : (
                <p className="text-gray-700">{userData.seeking || "Add what you're seeking"}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Interests:</label>
              {editing ? (
                <input
                  type="text"
                  name="interests"
                  value={userData.interests?.join(", ") || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      interests: e.target.value.split(",").map((item) => item.trim())
                    }))
                  }
                  className="w-full border p-2 rounded mt-1"
                />
              ) : (
                <p className="text-gray-700">{userData.interests?.join(", ") || "Add your interests"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;