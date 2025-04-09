import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import FieldForm from "../Learning/FieldForm";
import { selectIsAuthenticated } from "../../store/slice/authSlice";

const UpdateProfile = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const [missingFields, setMissingFields] = useState([]);
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const allFields = [
    "location",
    "company",
    "about",
    "skills",
    "learnerType",
    "interests",
    "seeking",
  ];

  useEffect(() => {
    const fetchProfileAndFindMissing = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const profile = res.data.user;
  
        const isMissing = (value) => {
          return (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0)
          );
        };
  
        const missing = allFields.filter((field) => isMissing(profile[field]));
  
        console.log("🚨 MISSING PROFILE FIELDS:", missing);
        console.log("💡 RAW PROFILE DATA:", profile);
  
        setMissingFields(missing);
        setShowModal(missing.length > 0);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
  
    if (!isAuthenticated) {
      navigate("/sign-up");
    } else {
      fetchProfileAndFindMissing();
    }
  }, [isAuthenticated, navigate]);
  

  const handleNext = async (val) => {
    const currentField = missingFields[step];
    const token = sessionStorage.getItem("token");

    const isFilled = val !== "" && !(Array.isArray(val) && val.length === 0);

    try {
      if (isFilled) {
        await axios.put(
          "http://localhost:4000/api/user/profile",
          { [currentField]: val },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (step < missingFields.length - 1) {
        setStep((prev) => prev + 1);
      } else {
        setShowModal(false);
        navigate("/learning-page");
      }
    } catch (err) {
      console.error("Failed to update field:", err);
    }
  };

  const handleSkip = () => {
    if (step < missingFields.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setShowModal(false);
      navigate("/learning");
    }
  };

  const currentField = missingFields[step];

  return (
    <div className="p-6">
      {showModal && currentField && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 shadow-lg">
            <FieldForm
              field={currentField}
              onSave={(field, val) => handleNext(val)}
              onSkip={handleSkip}
            />
            <p className="text-xs text-gray-400 text-center mt-4">
              Step {step + 1} of {missingFields.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
