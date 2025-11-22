import React, { useEffect, useState } from "react";

 function ThreeFourMedicalTeam({ patientId }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!patientId) return;

    async function fetchTeam() {
      try {
        const res = await fetch(`http://localhost:4000/medicalTeam/${patientId}`);
        if (!res.ok) throw new Error("Failed to fetch medical team");

        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.error("Error fetching medical team:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, [patientId]);

  if (loading) return <p>Loading medical team...</p>;
  if (!team || team.length === 0) return <p>No medical team assigned.</p>;

  return (
    <div className="medical-team-grid">
      {team.map((member, index) => (
        <div key={index} className="team-member-card">
          {member.photo_url && (
            <img
              src={member.photo_url}
              alt={member.name}
              className="team-photo"
            />
          )}

          <h3>{member.name}</h3>
          <p><strong>Role:</strong> {member.role}</p>
          <p><strong>Department:</strong> {member.department}</p>
          <p><strong>Email:</strong> {member.contact_email}</p>
          <p><strong>Phone:</strong> {member.contact_phone}</p>

          {member.profile_notes && (
            <p className="profile-notes">{member.profile_notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ThreeFourMedicalTeam;