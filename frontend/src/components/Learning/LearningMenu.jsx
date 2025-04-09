import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { selectIsAuthenticated } from "../../store/slice/authSlice";

const LearningMenu = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-up");
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token"); // 🔑 Use token from storage
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

    fetchProfile();
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  const hasDetails =
    profile?.about && profile?.skills?.length > 0 && profile?.company && profile?.location;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Hello, {profile?.username || profile?.name} 👋
      </h1>

      {hasDetails ? (
        <>
          <div className="bg-white shadow rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar || "https://via.placeholder.com/100"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500">{profile.company}, {profile.location}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{profile.about}</p>
          </div>

          <h2 className="text-xl font-semibold mb-3">Your Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.skills.map((skill, index) => (
              <SkillCard key={index} title={skill} />
            ))}
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
    </div>
  );
};

const SkillCard = ({ title }) => (
  <div className="bg-white border shadow-sm rounded-xl p-4 hover:shadow-md transition">
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-500">Status: Not Started</p>
    <button className="mt-2 text-blue-600 hover:underline text-sm">View Learning Path</button>
  </div>
);

export default LearningMenu;
