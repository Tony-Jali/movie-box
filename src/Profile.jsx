import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

const SUPABASE_URL = "https://zuriegsqtshtcyiytftg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cmllZ3NxdHNodGN5aXl0ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDU5NzAsImV4cCI6MjA4ODM4MTk3MH0.09K-bABDaXEUvhgaG1Q_e38JLlj-ZDVunRvAUcI7JHs";
const IMG_W = "https://image.tmdb.org/t/p/w300";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AVATAR_COLORS = ["#e50914", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"];

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #141414; }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #141414; }
  ::-webkit-scrollbar-thumb { background: #e50914; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #f40612; }

  .nav-link {
    color: #b3b3b3;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .nav-link:hover {
    color: white;
  }
  .nav-link.active {
    color: white;
  }
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e50914;
  }

  .profile-tab {
    padding: 12px 24px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.3px;
  }
  .profile-tab.active {
    background: linear-gradient(135deg, #e50914, #c41006);
    color: white;
    box-shadow: 0 4px 12px rgba(229,9,20,0.4);
  }
  .profile-tab.inactive {
    background: rgba(255,255,255,0.08);
    color: #b3b3b3;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .profile-tab.inactive:hover {
    background: rgba(255,255,255,0.15);
    color: white;
  }

  .fav-card {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    background: #1a1a1a;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .fav-card:hover {
    transform: translateY(-8px);
    border-color: rgba(229,9,20,0.5);
    box-shadow: 0 8px 24px rgba(229,9,20,0.2);
  }
  .fav-card:hover .fav-overlay { opacity: 1; }

  .fav-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.25s;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
  }

  .remove-btn {
    width: 100%;
    padding: 8px 0;
    background: #e50914;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s;
  }
  .remove-btn:hover { background: #f40612; transform: scale(1.02); }
  .remove-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .view-btn {
    width: 100%;
    padding: 8px 0;
    background: white;
    border: none;
    border-radius: 4px;
    color: #141414;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .view-btn:hover { background: rgba(255,255,255,0.9); transform: scale(1.02); }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Profile() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");
  const [removingId, setRemovingId] = useState(null);
  const userId = localStorage.getItem("moviebox_user_id");
  const username = localStorage.getItem("moviebox_username");
  const user = userId && username ? { id: userId, username } : null;

  // Pick a consistent avatar color from username
  const avatarColor = user
    ? AVATAR_COLORS[user.username.charCodeAt(0) % AVATAR_COLORS.length]
    : AVATAR_COLORS[0];

  useEffect(() => {
    if (!userId || !username) { navigate("/login"); return; }
    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("favorites").select("*").eq("user_id", userId);
        if (!error) setFavorites(data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [navigate, userId, username]);

  const removeFavorite = async (favoriteId) => {
    setRemovingId(favoriteId);
    try {
      const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
      if (!error) setFavorites(prev => prev.filter(f => f.id !== favoriteId));
    } catch (err) { console.error(err); }
    setRemovingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("moviebox_user_id");
    localStorage.removeItem("moviebox_username");
    navigate("/login");
  };

  const parsedFavorites = favorites.map(fav => {
    let movie = fav.movie_data;
    if (typeof movie === "string") {
      try { movie = JSON.parse(movie); } catch { movie = {}; }
    }
    return { ...fav, parsed: movie };
  });

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#141414", color: "white", minHeight: "100vh" }}>

        {/* ── NAVBAR ── */}
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
            padding: "0 4%", height: 68,
            background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%)",
            borderBottom: "1px solid rgba(229,9,20,0.2)",
            display: "flex", alignItems: "center", gap: 32,
            backdropFilter: "blur(12px)"
          }}>
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
            style={{
              fontSize: 22, fontWeight: 900, cursor: "pointer",
              background: "linear-gradient(135deg, #e50914, #831010)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
            🎬 MOVIEBOX
          </motion.div>

          {/* Nav Links */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span className="nav-link active">Profil</span>
            <span className="nav-link" onClick={() => navigate("/")}>Accueil</span>
            <span className="nav-link" onClick={() => navigate("/about")}>À Propos</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/")}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
                color: "#b3b3b3", padding: "8px 16px", borderRadius: 4,
                fontSize: 13, cursor: "pointer", fontWeight: 600,
                transition: "all 0.2s"
              }}>
              ← Accueil
            </motion.button>
            <motion.button
              whileHover={{ background: "#c41006" }}
              onClick={handleLogout}
              style={{
                background: "#e50914", border: "none", borderRadius: 4,
                color: "white", padding: "8px 18px",
                fontSize: 13, cursor: "pointer", fontWeight: 700,
                transition: "all 0.2s"
              }}>
              Déconnexion
            </motion.button>
          </div>
        </motion.nav>

        {/* ── PROFILE HEADER ── */}
        <div style={{
          paddingTop: 68,
          background: "linear-gradient(135deg, rgba(229,9,20,0.15), rgba(229,9,20,0.05), transparent)",
          borderBottom: "1px solid rgba(229,9,20,0.3)"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ padding: "50px 4% 40px", display: "flex", alignItems: "center", gap: 32 }}>

            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              style={{
                width: 100, height: 100, borderRadius: 12,
                background: avatarColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 48, fontWeight: 900, color: "white",
                flexShrink: 0, boxShadow: `0 8px 32px ${avatarColor}66`,
                cursor: "pointer", transition: "all 0.3s"
              }}>
              {user?.username?.[0]?.toUpperCase()}
            </motion.div>

            <div>
              <motion.h1 
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  fontSize: "clamp(32px, 5vw, 48px)", 
                  fontWeight: 900, 
                  color: "white", 
                  marginBottom: 8,
                  letterSpacing: "-1px"
                }}>
                {user?.username}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{ fontSize: 16, color: "#b3b3b3", marginBottom: 4 }}>
                {parsedFavorites.length} film{parsedFavorites.length !== 1 ? "s" : ""} dans ma liste
              </motion.p>
              <motion.p 
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: 13, color: "#757575" }}>
                Bienvenue sur MovieBox ! Gérez vos films favoris en un seul endroit.
              </motion.p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ padding: "0 4% 20px", display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { id: "favorites", label: `📽️ Ma Liste (${parsedFavorites.length})` },
              { id: "activity", label: "📊 Activité" }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                className={`profile-tab ${activeTab === tab.id ? "active" : "inactive"}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: "50px 4% 80px", maxWidth: 1600, margin: "0 auto" }}>

          <AnimatePresence mode="wait">

            {/* FAVORITES TAB */}
            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}>

                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, flexDirection: "column", gap: 20 }}>
                    <div style={{
                      width: 48, height: 48,
                      border: "3px solid rgba(229,9,20,0.3)",
                      borderTop: "3px solid #e50914",
                      borderRadius: "50%", animation: "spin 1s linear infinite"
                    }} />
                    <p style={{ color: "#757575", fontSize: 15, fontWeight: 500 }}>Chargement de votre liste...</p>
                  </motion.div>

                ) : parsedFavorites.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      textAlign: "center", padding: "100px 40px",
                      border: "2px dashed rgba(229,9,20,0.3)",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, rgba(229,9,20,0.05), rgba(229,9,20,0.02))"
                    }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🎬</div>
                    <p style={{ fontSize: 24, color: "#b3b3b3", fontWeight: 700, marginBottom: 12 }}>
                      Votre liste est vide
                    </p>
                    <p style={{ fontSize: 15, color: "#757575", marginBottom: 32, lineHeight: 1.6 }}>
                      Commencez à ajouter vos films préférés pour les retrouver ici. <br/>
                      Explorez le catalogue, trouvez vos films favoris et créez votre collection personnelle !
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/")}
                      style={{
                        background: "linear-gradient(135deg, #e50914, #c41006)",
                        border: "none", borderRadius: 6,
                        color: "white", padding: "14px 36px",
                        fontWeight: 700, fontSize: 16, cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(229,9,20,0.4)"
                      }}>
                      ▶ Découvrir les films
                    </motion.button>
                  </motion.div>

                ) : (
                  <>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{ fontSize: 15, color: "#b3b3b3", marginBottom: 24 }}>
                      Affichage de {parsedFavorites.length} film{parsedFavorites.length !== 1 ? "s" : ""}
                    </motion.p>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                      gap: 16
                    }}>
                      {parsedFavorites.map((fav, idx) => {
                        const movie = fav.parsed;
                        return (
                          <motion.div
                            key={fav.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="fav-card"
                            style={{ opacity: removingId === fav.id ? 0.5 : 1 }}>

                            <img
                              src={movie.poster_path
                                ? `${IMG_W}${movie.poster_path}`
                                : "https://via.placeholder.com/170x255/1a1a1a/555?text=N/A"}
                              alt={movie.title}
                              style={{ width: "100%", height: 255, objectFit: "cover", display: "block" }}
                              onClick={() => navigate(`/movie/${movie.id}`)}
                            />

                            <div className="fav-overlay">
                              {/* Rating */}
                              <div style={{ fontSize: 12, color: "#46d369", fontWeight: 700, marginBottom: 6 }}>
                                ⭐ {movie.vote_average?.toFixed(1)} · {movie.release_date?.substring(0, 4)}
                              </div>
                              {/* Title */}
                              <div style={{ fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 10 }}>
                                {movie.title}
                              </div>
                              {/* Buttons */}
                              <button className="view-btn" onClick={() => navigate(`/movie/${movie.id}`)}>
                                ▶ Voir
                              </button>
                              <button
                                className="remove-btn"
                                onClick={() => removeFavorite(fav.id)}
                                disabled={removingId === fav.id}>
                                {removingId === fav.id ? "⏳..." : "✕ Retirer"}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ACTIVITY TAB */}
            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}>

                {/* Stats */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16, marginBottom: 50
                }}>
                  {[
                    { label: "📽️ Films en liste", value: parsedFavorites.length, color: "#e50914" },
                    { label: "⭐ Note moyenne", value: parsedFavorites.length > 0
                        ? (parsedFavorites.reduce((acc, f) => acc + (f.parsed?.vote_average || 0), 0) / parsedFavorites.length).toFixed(1)
                        : "—", color: "#46d369" },
                    { label: "🎬 Total vu", value: parsedFavorites.length, color: "#0ea5e9" },
                    { label: "📅 Membre depuis", value: "2026", color: "#f59e0b" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(229,9,20,0.05))",
                        border: "1px solid rgba(229,9,20,0.3)",
                        borderRadius: 8, padding: "28px 24px"
                      }}>
                      <div style={{ fontSize: 13, color: "#b3b3b3", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 40, fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent favorites preview */}
                {parsedFavorites.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "white", letterSpacing: "-0.5px" }}>
                      ✨ Ajouts récents
                    </h2>
                    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
                      {parsedFavorites.slice(0, 10).map((fav, idx) => {
                        const m = fav.parsed;
                        return (
                          <motion.div
                            key={fav.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + idx * 0.02 }}
                            onClick={() => navigate(`/movie/${m.id}`)}
                            style={{
                              flexShrink: 0, width: 140, borderRadius: 6,
                              overflow: "hidden", cursor: "pointer",
                              transition: "all 0.3s",
                              border: "1px solid rgba(255,255,255,0.05)"
                            }}
                            whileHover={{ y: -8 }}>
                            <img
                              src={m.poster_path ? `${IMG_W}${m.poster_path}` : "https://via.placeholder.com/140x210/1a1a1a/555?text=N/A"}
                              alt={m.title}
                              style={{ width: "100%", height: 210, objectFit: "cover", display: "block" }}
                            />
                            <div style={{
                              padding: "8px 10px", background: "#1a1a1a",
                              fontSize: 12, color: "#b3b3b3", fontWeight: 600,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }}>
                              {m.title}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── FOOTER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            padding: "40px 4%",
            borderTop: "1px solid rgba(229,9,20,0.2)",
            textAlign: "center",
            background: "linear-gradient(180deg, transparent, rgba(229,9,20,0.05))"
          }}>
          <p style={{ color: "#757575", fontSize: 13, lineHeight: 1.6 }}>
            © 2026 MovieBox — Données issues de TMDB <br/>
            <span style={{ fontSize: 12, color: "#555" }}>Développé par Tony Jali</span>
          </p>
        </motion.div>

      </div>
    </>
  );
}
