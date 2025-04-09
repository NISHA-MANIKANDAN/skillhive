import  { useEffect, useState } from "react";
import axios from "axios";
import SkillCards from "./Teaching/SkillCards";

const SkillList = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/skills/all")
      .then((response) => setSkills(response.data))
      .catch((error) => console.error("Error fetching skills", error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Skills</h1>
      <SkillCards skills={skills} />
    </div>
  );
};

export default SkillList;
