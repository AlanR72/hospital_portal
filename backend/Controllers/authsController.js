const pool = require("../database/connection");

const login = (req, res) => {
  const { username, password } = req.body; // remove role from frontend

  // Get the user and patient info if applicable
  const sql = `
    SELECT u.id, u.username, u.password_hash, u.role, u.patient_id,
           p.first_name, p.last_name, p.dob, p.gender, p.address, p.contact_phone, p.notes AS patient_notes
    FROM users u
    LEFT JOIN patients p ON u.patient_id = p.id
    WHERE u.username = ?
  `;

  pool.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "User not found" });

    const user = results[0];

    // Password check
    if (user.password_hash !== password)
      return res.status(401).json({ error: "Incorrect password" });

    let response = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // Determine admin access
    if (user.role === "admin" && !["doctor", "nurse"].includes(user.role)) {
      return res.status(403).json({ error: "Access denied for admin dashboard" });
    }
    response.canAccessAdmin = ["doctor", "nurse"].includes(user.role);

    // Patient info
    if (user.role === "patient") {
      const dob = new Date(user.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

      let age_group = "other";
      if (age >= 2 && age <= 4) age_group = "2-4";
      else if (age >= 9 && age <= 12) age_group = "9-12";

      response.patient_id = user.patient_id;
      response.age = age;
      response.age_group = age_group;
      response.patient = {
        id: user.patient_id,
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        contact_phone: user.contact_phone,
        notes: user.patient_notes,
        age,
        age_group
      };
    }

    // Parent info
    if (user.role === "parent") {
      const childSql = `
        SELECT 
          p.id AS patient_id, p.first_name, p.last_name, p.dob, p.gender, p.address, p.contact_phone, p.notes
        FROM parent_child pc
        JOIN patients p ON pc.patient_id = p.id
        WHERE pc.parent_user_id = ?
      `;
      pool.query(childSql, [user.id], (err2, children) => {
        if (err2) return res.status(500).json({ error: "Database error fetching children" });
        response.children = children;
        return res.json(response);
      });
    } else {
      return res.json(response);
    }
  });
};

module.exports = { login };
