import React, { useEffect, useState } from "react";
import '../../assets/Styles/MedicalTeam.css'


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
  <div className="medical-team-container">
    {team.length > 0 ? (
      <div>
        <p className="intro-text">
          Hi {team[0].patient_first_name}! Here’s your medical team who help take care of you:
        </p>

        {team.map((member, index) => (
          <div key={index} className="team-member-card">
            {member.photo_url && (
              <img
                src={member.photo_url}
                alt={member.name}
                className="team-photo"
              />
            )}

            <p className="team-text">
              <strong>{member.name}</strong> is your {member.role} in the {member.department} department.
            </p>

            <p className="team-text">
              You can talk to {member.name} by email: {member.contact_email} or by phone: {member.contact_phone}.
            </p>

            {member.patient_notes && (
              <p className="team-text">
                A little note about {member.name}: {member.patient_notes}
              </p>
            )}

            {member.relationship && (
              <p className="team-text">
                {member.name} is your {member.relationship}.
              </p>
            )}
          </div>
        ))}

        <p className="outro-text">
          Remember, your medical team is here to help you feel better and stay healthy!
        </p>
      </div>
    ) : (
      <p>Hi there! You don’t have a medical team assigned yet.</p>
    )}
  </div>

  );
}

export default ThreeFourMedicalTeam;