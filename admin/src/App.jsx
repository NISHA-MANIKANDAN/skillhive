import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillCard from './components/SkillCard';

const App = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/skills/all');
        setSkills(res.data);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setSkills(prev =>
      prev.map(skill => (skill._id === id ? { ...skill, isVerified: newStatus } : skill))
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Skill Verification</h1>
      {skills.map(skill => (
        <SkillCard key={skill._id} skill={skill} onStatusChange={handleStatusChange} />
      ))}
    </div>
  );
};

export default App;
