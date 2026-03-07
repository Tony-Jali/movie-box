import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = username.trim();
    if (!value) return;
    const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
    localStorage.setItem("moviebox_user_id", id);
    localStorage.setItem("moviebox_username", value);
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#141414", color: "white", padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 420, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 24 }}>
        <h1 style={{ marginBottom: 16, fontSize: 28 }}>Connexion</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "white", marginBottom: 12 }}
        />
        <button type="submit" style={{ width: "100%", padding: "12px 14px", borderRadius: 6, border: "none", background: "#e50914", color: "white", fontWeight: 700, cursor: "pointer" }}>
          Continuer
        </button>
      </form>
    </div>
  );
}
