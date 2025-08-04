import React from 'react';
import axios from 'axios';

const SkillCard = ({ skill, onStatusChange }) => {
  const handleToggle = async () => {
    try {
      const updatedStatus = !skill.isVerified;
      await axios.put(`http://localhost:4000/api/skills/${skill._id}/verify`, {
        isVerified: updatedStatus
      });
      onStatusChange(skill._id, updatedStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 8 }}>
      <h3>{skill.skillName}</h3>
      <p><strong>Staff:</strong> {skill.staffName}</p>
      <p><strong>Verified:</strong> {skill.isVerified ? 'Yes' : 'No'}</p>
      <button onClick={handleToggle}>
        {skill.isVerified ? 'Unverify' : 'Verify'}
      </button>
    </div>
  );
};

export default SkillCard;
