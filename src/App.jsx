import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Clapperboard, Flame, Heart, Info, Play, Plus, Search, Star } from "lucide-react";

const TMDB_API_KEY = "20ee1557500e8089a6d549f19b23014e";
const SUPABASE_URL = "https://zuriegsqtshtcyiytftg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cmllZ3NxdHNodGN5aXl0ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDU5NzAsImV4cCI6MjA4ODM4MTk3MH0.09K-bABDaXEUvhgaG1Q_e38JLlj-ZDVunRvAUcI7JHs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const IMG = "https://image.tmdb.org/t/p/original";
const IMG_W = "https://image.tmdb.org/t/p/w500";

const CATEGORIES = ["Trending Now", "Populaires", "Récemment Ajoutés", "Ma Liste"];
const GENRES = ["Action", "Aventure", "Biographie", "Crime", "Comédie", "Documentaire", "Drame"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Netflix+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #141414; }
  ::-webkit-scrollbar-thumb { background: #e50914; border-radius: 2px; }

  body { background: #141414; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }

  .nav-link {
    color: #e5e5e5;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s;
    white-space: nowrap;
    text-decoration: none;
  }
  .nav-link:hover { color: #b3b3b3; }
  .nav-link.active { color: white; font-weight: 700; }

  .tab-btn {
    padding: 6px 18px;
    border-radius: 3px;
    border: none;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .tab-btn.active {
    background: #e50914;
    color: white;
  }
  .tab-btn.inactive {
    background: rgba(255,255,255,0.08);
    color: #b3b3b3;
  }
  .tab-btn.inactive:hover {
    background: rgba(255,255,255,0.15);
    color: white;
  }

  .genre-btn {
    padding: 5px 16px;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.3);
    background: transparent;
    color: #b3b3b3;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .genre-btn:hover { border-color: white; color: white; }

  .movie-card {
    position: relative;
    flex: 0 0 auto;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, z-index 0s;
  }
  .movie-card:hover { transform: scale(1.08); z-index: 10; }
  .movie-card:hover .card-overlay { opacity: 1; }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
  }

  .row-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: thin;
  }

  .search-input {
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(255,255,255,0.5);
    color: white;
    padding: 6px 12px 6px 34px;
    border-radius: 3px;
    font-size: 13px;
    width: 200px;
    outline: none;
    transition: all 0.3s;
  }
  .search-input:focus {
    border-color: white;
    width: 240px;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.5); }
`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("moviebox_user_id");
    const username = localStorage.getItem("moviebox_username");
    if (userId && username) {
      setUser({ id: userId, username: username });
      setAuthLoading(false);
    } else {
      navigate("/login");
      setAuthLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) fetchMovies();
  }, [user]);

  const fetchMovies = async () => {
    try {
      const [popular, trend] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR`),
        axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`)
      ]);
      setMovies(popular.data.results);
      setTrending(trend.data.results);
      setBanner(trend.data.results[0]);
      setLoading(false);
    } catch (err) {
      console.error("Erreur TMDB:", err);
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
      );
      setSearchResults(res.data.results || []);
    } catch {
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) searchMovies(q);
    else if (!q) setSearchResults([]);
  };

  if (authLoading) return (
    <div style={{ background: "#141414", color: "white", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(229,9,20,0.3)", borderTop: "3px solid #e50914", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  const Poster = ({ movie, width = 185 }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [addingFavorite, setAddingFavorite] = useState(false);

    const handleAddFavorite = async (e) => {
      e.stopPropagation();
      if (!user) { navigate("/login"); return; }
      setAddingFavorite(true);
      try {
        const { error } = await supabase.from("favorites").insert([{
          user_id: user.id, movie_id: movie.id, movie_data: JSON.stringify(movie)
        }]);
        if (!error) setIsFavorite(true);
      } catch (err) { console.error(err); }
      setAddingFavorite(false);
    };

    return (
      <div className="movie-card" style={{ width, height: width * 1.5 }} onClick={() => navigate(`/movie/${movie.id}`)}>
        <img
          src={movie.poster_path ? `${IMG_W}${movie.poster_path}` : "https://via.placeholder.com/185x278/141414/555?text=No+Image"}
          alt={movie.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div className="card-overlay">
          <div style={{ fontSize: 12, color: "#46d369", fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 6 }}>
            {movie.title}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
              style={{
                flex: 1, padding: "5px 0", background: "white", border: "none",
                borderRadius: 3, color: "#141414", fontWeight: 700, fontSize: 11, cursor: "pointer"
              }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Play size={12} fill="currentColor" /> VOIR
              </span>
            </button>
            <button
              onClick={handleAddFavorite}
              disabled={addingFavorite || isFavorite}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: isFavorite ? "rgba(229,9,20,0.8)" : "rgba(255,255,255,0.15)",
                border: `2px solid ${isFavorite ? "#e50914" : "rgba(255,255,255,0.5)"}`,
                color: "white", fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
              {isFavorite ? <Heart size={13} fill="currentColor" /> : <Plus size={13} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const displayMovies = searchResults.length > 0 ? searchResults : movies;
  const rowLabel = searchResults.length > 0 ? `Résultats: "${searchQuery}"` : "Populaires";

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#141414", color: "white", minHeight: "100vh" }}>

        {/* ── NAVBAR ── */}
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
            padding: "0 4%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)",
            display: "flex", alignItems: "center", gap: 28, height: 68,
            backdropFilter: "blur(2px)"
          }}>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ color: "#e50914", fontSize: 28, fontWeight: 900, letterSpacing: "-1px", cursor: "pointer", flexShrink: 0 }}
            onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
            MOVIEBOX
          </motion.div>

          {/* Nav Links */}
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <span className="nav-link active">Accueil</span>
            <span className="nav-link" onClick={() => navigate("/profile")}>Séries</span>
            <span className="nav-link">Films</span>
            <span className="nav-link" onClick={() => navigate("/profile")}>Récents</span>
            <span className="nav-link" onClick={() => navigate("/profile")}>Ma Liste</span>
            <span className="nav-link" onClick={() => navigate("/about")}>À Propos</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span
                style={{ position: "absolute", left: 10, fontSize: 14, color: "rgba(255,255,255,0.6)", zIndex: 1, cursor: "pointer" }}
                onClick={() => setShowSearch(!showSearch)}>
                <Search size={14} />
              </span>
              <AnimatePresence>
                {showSearch && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="search-input"
                    type="text"
                    placeholder="Titres, acteurs..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                )}
              </AnimatePresence>
              {!showSearch && (
                <div style={{ width: 20 }} />
              )}
            </div>

            {/* User */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/profile")}
                  style={{
                    width: 32, height: 32, borderRadius: 4, background: "#e50914",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 14, cursor: "pointer"
                  }}>
                  {user.username?.[0]?.toUpperCase() || "U"}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    localStorage.removeItem("moviebox_user_id");
                    localStorage.removeItem("moviebox_username");
                    navigate("/login");
                  }}
                  style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
                    color: "#b3b3b3", padding: "5px 12px", borderRadius: 3,
                    fontSize: 12, cursor: "pointer"
                  }}>
                  Quitter
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ background: "#f40612" }}
                onClick={() => navigate("/login")}
                style={{
                  background: "#e50914", border: "none", borderRadius: 3,
                  color: "white", fontWeight: 700, fontSize: 14,
                  padding: "8px 20px", cursor: "pointer"
                }}>
                Connexion
              </motion.button>
            )}
          </div>
        </motion.nav>

        {/* ── HERO BANNER ── */}
        {banner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              height: "85vh", minHeight: 500,
              backgroundImage: `url(${IMG}${banner.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              position: "relative",
              display: "flex", alignItems: "flex-end"
            }}>

            {/* Gradients */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(77deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)"
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
              background: "linear-gradient(to top, #141414, transparent)"
            }} />
            {/* Top fade */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "25%",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)"
            }} />

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ position: "relative", padding: "0 4% 80px", maxWidth: 600 }}>

              {/* Rating badge */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                <span style={{
                  background: "#e50914", color: "white", fontSize: 11,
                  fontWeight: 700, padding: "3px 8px", borderRadius: 2, letterSpacing: 1
                }}>TOP 10</span>
                <span style={{ color: "#46d369", fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Star size={13} fill="currentColor" /> {banner.vote_average?.toFixed(1)}</span>
                <span style={{ color: "#b3b3b3", fontSize: 13 }}>
                  {banner.release_date?.substring(0, 4)}
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900,
                color: "white", lineHeight: 1, marginBottom: 16,
                textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
                letterSpacing: "-1px"
              }}>
                {banner.title}
              </h1>

              <p style={{
                fontSize: "clamp(13px, 1.8vw, 16px)", color: "#e5e5e5",
                lineHeight: 1.6, marginBottom: 24,
                textShadow: "1px 1px 4px rgba(0,0,0,0.8)"
              }}>
                {banner.overview?.substring(0, 160)}...
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  whileHover={{ background: "rgba(255,255,255,0.85)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/movie/${banner.id}`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 28px", background: "white", border: "none",
                    borderRadius: 4, color: "#141414", fontWeight: 700,
                    fontSize: 16, cursor: "pointer", letterSpacing: 0.5
                  }}>
                  <Play size={18} fill="currentColor" /> Lecture
                </motion.button>
                <motion.button
                  whileHover={{ background: "rgba(109,109,110,0.7)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 24px",
                    background: "rgba(109,109,110,0.5)",
                    border: "none", borderRadius: 4,
                    color: "white", fontWeight: 700,
                    fontSize: 16, cursor: "pointer", letterSpacing: 0.5
                  }}
                  onClick={() => navigate(`/movie/${banner.id}`)}>
                  <Info size={18} /> Plus d'infos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── CONTENT SECTION ── */}
        <div style={{ padding: "0 4% 60px", marginTop: -20 }}>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`tab-btn ${activeTab === i ? "active" : "inactive"}`}
                onClick={() => setActiveTab(i)}>
                {cat}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {GENRES.map((g) => (
                <button key={g} className="genre-btn">{g}</button>
              ))}
            </div>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{
                width: 36, height: 36,
                border: "3px solid rgba(229,9,20,0.3)",
                borderTop: "3px solid #e50914",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
            </div>
          )}

          {/* Trending Row */}
          {!loading && trending.length > 0 && !searchResults.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 20, fontWeight: 700, marginBottom: 14,
                color: "white", letterSpacing: 0.5
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Flame size={18} /> Trending Now</span>
              </h2>
              <div className="row-scroll">
                {trending.map((movie) => (
                  <Poster key={movie.id} movie={movie} width={160} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Row */}
          {!loading && displayMovies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}>
              <h2 style={{
                fontSize: 20, fontWeight: 700, marginBottom: 14,
                color: "white", letterSpacing: 0.5
              }}>
                {searchResults.length > 0
                  ? <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Search size={18} /> {`Résultats pour "${searchQuery}"`}</span>
                  : isSearching
                  ? "Recherche..."
                  : <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Clapperboard size={18} /> {rowLabel}</span>}
              </h2>

              {isSearching ? (
                <div style={{ color: "#b3b3b3", padding: "30px 0" }}>Recherche en cours...</div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "8px 8px"
                }}>
                  {displayMovies.map((movie) => (
                    <Poster key={movie.id} movie={movie} width="100%" />
                  ))}
                </div>
              )}

              {searchQuery && !isSearching && searchResults.length === 0 && searchQuery.length > 2 && (
                <p style={{ color: "#b3b3b3", padding: "30px 0" }}>Aucun film trouvé pour "{searchQuery}"</p>
              )}
            </motion.div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: "30px 4%",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center"
        }}>
          <p style={{ color: "#757575", fontSize: 13, marginBottom: 4 }}>Questions ? Appelez le 0800 916 316</p>
          <p style={{ color: "#757575", fontSize: 11 }}>© 2026 MOVIEBOX — Données issues de TMDB</p>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .movie-card img { transition: transform 0.3s; }
        .movie-card:hover img { transform: scale(1.05); }
      `}</style>
    </>
  );
}
