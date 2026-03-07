import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#141414", color: "white", padding: 24 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <button onClick={() => navigate("/")} style={{ marginBottom: 20, background: "transparent", border: "1px solid rgba(255,255,255,0.25)", color: "white", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
          Retour accueil
        </button>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>A propos de MovieBox</h1>
        <p style={{ color: "#b3b3b3", lineHeight: 1.7 }}>
          MovieBox est une application React qui affiche des films populaires, les details d'un film et une liste de favoris.
        </p>
      </div>
    </div>
  );
}
