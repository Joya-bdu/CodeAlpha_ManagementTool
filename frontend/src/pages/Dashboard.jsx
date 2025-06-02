import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";  // npm install jwt-decode

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found");
      return;
    }

    // Token expired কি না চেক
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.error("Token expired");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/projects/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Project List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : projects.length > 0 ? (
        projects.map((p) => (
          <div key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>Status: {p.status}</p>
          </div>
        ))
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
}

export default Dashboard;

