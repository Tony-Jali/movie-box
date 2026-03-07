import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Heart, Info, Play, Star, User, Video, X } from "lucide-react";

const TMDB_API_KEY = "20ee1557500e8089a6d549f19b23014e";
const SUPABASE_URL = "https://zuriegsqtshtcyiytftg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cmllZ3NxdHNodGN5aXl0ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDU5NzAsImV4cCI6MjA4ODM4MTk3MH0.09K-bABDaXEUvhgaG1Q_e38JLlj-ZDVunRvAUcI7JHs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const IMG = "https://image.tmdb.org/t/p/original";
const IMG_W = "https://image.tmdb.org/t/p/w500";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #141414; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #141414; }
  ::-webkit-scrollbar-thumb { background: #e50914; border-radius: 2px; }

  .detail-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 32px;
    background: white;
    border: none; border-radius: 4px;
    color: #141414; font-size: 18px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.3px;
    transition: background 0.2s;
  }
  .detail-btn-primary:hover { background: rgba(255,255,255,0.75); }

  .detail-btn-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 32px;
    background: rgba(109,109,110,0.7);
    border: none; border-radius: 4px;
    color: white; font-size: 18px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.3px;
    transition: background 0.2s;
  }
  .detail-btn-secondary:hover { background: rgba(109,109,110,0.5); }
  .detail-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

  .detail-btn-fav {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 32px;
    background: rgba(109,109,110,0.7);
    border: none; border-radius: 4px;
    color: white; font-size: 18px; font-weight: 700;
    cursor: pointer; transition: background 0.2s;
  }
  .detail-btn-fav:hover:not(:disabled) { background: rgba(109,109,110,0.5); }
  .detail-btn-fav:disabled { opacity: 0.6; cursor: not-allowed; }
  .detail-btn-fav.active { color: #e50914; }

  .info-badge {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 2px;
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    font-weight: 400;
  }

  .stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    padding: 20px 24px;
    transition: background 0.2s;
  }
  .stat-card:hover { background: rgba(255,255,255,0.08); }

  .genre-tag {
    display: inline-block;
    padding: 5px 14px;
    background: rgba(229,9,20,0.15);
    border: 1px solid rgba(229,9,20,0.4);
    border-radius: 3px;
    font-size: 13px;
    color: #ff6b6b;
    font-weight: 600;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingFavorite, setAddingFavorite] = useState(false);
  const [trailers, setTrailers] = useState([]);
  const [playingTrailer, setPlayingTrailer] = useState(null);
  const userId = localStorage.getItem("moviebox_user_id");
  const username = localStorage.getItem("moviebox_username");
  const user = userId && username ? { id: userId, username } : null;

  useEffect(() => {
    if (!userId || !username) navigate("/login");
  }, [navigate, userId, username]);

  useEffect(() => {
    if (!movieId) return;
    const loadMovieData = async () => {
      try {
        const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr-FR`),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=fr-FR`),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=fr-FR`),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`)
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
        setSimilar(similarRes.data.results?.slice(0, 8) || []);
        // Filtrer les trailers: d'abord "Trailer", puis "Teaser", puis tout vidéo YouTube
        const allVideos = videosRes.data.results || [];
        const trailers = allVideos.filter(v => v.site === "YouTube" && v.type === "Trailer");
        const teasers = allVideos.filter(v => v.site === "YouTube" && v.type === "Teaser");
        const otherYT = allVideos.filter(v => v.site === "YouTube");
        const trailerList = trailers.length > 0 ? trailers : (teasers.length > 0 ? teasers : otherYT);
        setTrailers(trailerList);
      } catch (err) {
        console.error("Erreur:", err);
      }
      setLoading(false);
    };

    loadMovieData();
  }, [movieId]);

  const handleAddFavorite = async () => {
    if (!user || !movie) return;
    setAddingFavorite(true);
    try {
      const { error } = await supabase.from("favorites").insert([{
        user_id: user.id, movie_id: movie.id, movie_data: JSON.stringify(movie)
      }]);
      if (!error) setIsFavorite(true);
      else alert(`Erreur: ${error.message}`);
    } catch (err) { alert(`Erreur: ${err.message}`); }
    setAddingFavorite(false);
  };

  // ── LOADING ──
  if (loading) return (
    <>
      <style>{styles}</style>
      <div style={{
        background: "#141414", color: "white", minHeight: "100vh",
        display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16
      }}>
        <div style={{
          width: 44, height: 44,
          border: "3px solid rgba(229,9,20,0.3)",
          borderTop: "3px solid #e50914",
          borderRadius: "50%", animation: "spin 1s linear infinite"
        }} />
        <p style={{ color: "#757575", fontSize: 15 }}>Chargement du film...</p>
      </div>
    </>
  );

  if (!movie) return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#141414", color: "white", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#757575" }}>Film non trouvé.</p>
      </div>
    </>
  );

  const topCast = credits?.cast?.slice(0, 6) || [];
  const director = credits?.crew?.find(c => c.job === "Director");
  const maturityRating = movie.adult ? "18+" : movie.vote_average > 7 ? "PG-13" : "PG";

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#141414", color: "white", minHeight: "100vh" }}>

        {/* ── NAVBAR ── */}
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
            padding: "0 4%", height: 68,
            background: "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
            display: "flex", alignItems: "center", gap: 28,
            backdropFilter: "blur(2px)"
          }}>
          <div
            style={{ color: "#e50914", fontSize: 28, fontWeight: 900, letterSpacing: "-1px", cursor: "pointer" }}
            onClick={() => navigate("/")}>
            MOVIEBOX
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "white", padding: "8px 20px", borderRadius: 4,
              fontSize: 14, cursor: "pointer", fontWeight: 600,
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ArrowLeft size={14} /> Accueil</span>
          </button>
        </motion.nav>

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          style={{
            height: "80vh", minHeight: 500,
            backgroundImage: `url(${IMG}${movie.backdrop_path})`,
            backgroundSize: "cover", backgroundPosition: "center top",
            position: "relative", display: "flex", alignItems: "flex-end"
          }}>
          {/* Gradients */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(77deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, transparent 70%)"
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
            background: "linear-gradient(to top, #141414, transparent)"
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "20%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)"
          }} />

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ position: "relative", padding: "0 4% 80px", maxWidth: 700 }}>

            {/* Badges */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{
                background: "#e50914", color: "white", fontSize: 11,
                fontWeight: 700, padding: "3px 8px", borderRadius: 2, letterSpacing: 1
              }}>MOVIEBOX</span>
              <span className="info-badge">{maturityRating}</span>
              <span className="info-badge">{movie.release_date?.substring(0, 4)}</span>
              {movie.runtime && <span className="info-badge">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>}
              <span style={{ color: "#46d369", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Star size={14} fill="currentColor" /> {movie.vote_average?.toFixed(1)}/10
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900,
              color: "white", lineHeight: 1, marginBottom: 16,
              textShadow: "2px 2px 10px rgba(0,0,0,0.6)", letterSpacing: "-1px"
            }}>
              {movie.title}
            </h1>

            <p style={{
              fontSize: "clamp(13px, 1.8vw, 16px)", color: "#e5e5e5",
              lineHeight: 1.7, marginBottom: 24, maxWidth: 560,
              textShadow: "1px 1px 4px rgba(0,0,0,0.8)"
            }}>
              {movie.overview?.substring(0, 200)}{movie.overview?.length > 200 ? "..." : ""}
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button className="detail-btn-primary">
                <Play size={18} fill="currentColor" /> Lecture
              </button>
              {trailers.length > 0 ? (
                <button 
                  className="detail-btn-secondary"
                  onClick={() => setPlayingTrailer(trailers[0])}>
                  <Video size={18} /> Bande-annonce
                </button>
              ) : (
                <div style={{
                  padding: "8px 16px", borderRadius: 4,
                  background: "rgba(229,9,20,0.2)", border: "1px solid rgba(229,9,20,0.5)",
                  color: "#ff9999", fontSize: 13, fontWeight: 600
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Info size={14} /> Aucune bande-annonce disponible</span>
                </div>
              )}
              <button
                className={`detail-btn-fav ${isFavorite ? "active" : ""}`}
                onClick={handleAddFavorite}
                disabled={addingFavorite || isFavorite}>
                <span style={{ display: "inline-flex", alignItems: "center" }}>{isFavorite ? <Heart size={20} fill="currentColor" /> : <Heart size={20} />}</span>
                {isFavorite ? "Dans ma liste" : "Ma liste"}
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* ── DETAILS SECTION ── */}
        <div style={{ padding: "0 4% 80px" }}>

          {/* Main info grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "clamp(30px, 5vw, 60px)",
              marginBottom: 50,
              paddingTop: 20
            }}>

            {/* Left — Synopsis + Cast */}
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                fontSize: 22, fontWeight: 700, marginBottom: 12,
                color: "white", letterSpacing: 0.3
              }}>
                Synopsis
              </h2>
              <p style={{
                fontSize: 15, color: "#b3b3b3", lineHeight: 1.8, marginBottom: 36
              }}>
                {movie.overview || "Aucune description disponible."}
              </p>

              {/* Cast */}
              {topCast.length > 0 && (
                <>
                  <p style={{ fontSize: 14, color: "#757575", marginBottom: 6 }}>
                    <span style={{ color: "#b3b3b3" }}>Distribution :</span>{" "}
                    {topCast.map(a => a.name).join(", ")}
                  </p>
                </>
              )}
              {director && (
                <p style={{ fontSize: 14, color: "#757575", marginBottom: 6 }}>
                  <span style={{ color: "#b3b3b3" }}>Réalisateur :</span> {director.name}
                </p>
              )}
              {movie.genres?.length > 0 && (
                <p style={{ fontSize: 14, color: "#757575" }}>
                  <span style={{ color: "#b3b3b3" }}>Genres :</span>{" "}
                  {movie.genres.map(g => g.name).join(", ")}
                </p>
              )}
            </div>

            {/* Right — Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 200 }}>
              <div className="stat-card">
                <div style={{ fontSize: 12, color: "#757575", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Note</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#46d369", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Star size={20} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
                </div>
                <div style={{ fontSize: 12, color: "#757575" }}>{movie.vote_count?.toLocaleString()} votes</div>
              </div>

              {movie.budget > 0 && (
                <div className="stat-card">
                  <div style={{ fontSize: 12, color: "#757575", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Budget</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>
                    ${(movie.budget / 1000000).toFixed(0)}M
                  </div>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="stat-card">
                  <div style={{ fontSize: 12, color: "#757575", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Box Office</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#46d369" }}>
                    ${(movie.revenue / 1000000).toFixed(0)}M
                  </div>
                </div>
              )}

              {movie.production_companies?.length > 0 && (
                <div className="stat-card">
                  <div style={{ fontSize: 12, color: "#757575", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Studio</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#b3b3b3" }}>
                    {movie.production_companies[0].name}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: 50 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {movie.genres.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cast Row */}
          {topCast.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ marginBottom: 50 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "white" }}>
                Distribution
              </h2>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                {topCast.map(actor => (
                  <div key={actor.id} style={{ flexShrink: 0, width: 120, textAlign: "center" }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: "50%",
                      margin: "0 auto 8px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.05)",
                      border: "2px solid rgba(255,255,255,0.1)"
                    }}>
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 28, color: "#757575"
                        }}><User size={28} /></div>
                      )}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 2 }}>
                      {actor.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#757575", lineHeight: 1.3 }}>
                      {actor.character}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Poster + Similar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: movie.poster_path ? "auto 1fr" : "1fr",
            gap: 40, alignItems: "start"
          }}>
            {movie.poster_path && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}>
                <img
                  src={`${IMG_W}${movie.poster_path}`}
                  alt={movie.title}
                  style={{
                    width: 200, borderRadius: 4,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                    display: "block"
                  }}
                />
              </motion.div>
            )}

            {/* Similar movies */}
            {similar.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "white" }}>
                  Films similaires
                </h2>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                  {similar.map(m => (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/movie/${m.id}`)}
                      style={{
                        flexShrink: 0, width: 130, borderRadius: 4,
                        overflow: "hidden", cursor: "pointer",
                        transition: "transform 0.2s",
                        position: "relative"
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                      <img
                        src={m.poster_path
                          ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                          : "https://via.placeholder.com/130x195/1a1a1a/555?text=N/A"}
                        alt={m.title}
                        style={{ width: "100%", height: 195, objectFit: "cover", display: "block" }}
                      />
                      <div style={{
                        padding: "6px 8px", background: "#1a1a1a",
                        fontSize: 11, color: "#b3b3b3",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }}>
                        {m.title}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: "24px 4%",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center"
        }}>
          <p style={{ color: "#757575", fontSize: 13 }}>
            © 2026 MOVIEBOX — Données issues de TMDB
          </p>
        </div>

        {/* MODAL TRAILER */}
        {playingTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setPlayingTrailer(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2000, cursor: "pointer"
            }}>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative", width: "90%", maxWidth: 900,
                cursor: "default"
              }}>
              <button
                onClick={() => setPlayingTrailer(null)}
                style={{
                  position: "absolute", top: -40, right: 0,
                  background: "none", border: "none", color: "white",
                  fontSize: 32, cursor: "pointer", fontWeight: "bold"
                }}>
                <X size={28} />
              </button>
              <div style={{
                position: "relative", paddingBottom: "56.25%", height: 0,
                overflow: "hidden", borderRadius: 8
              }}>
                <iframe
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%", border: "none"
                  }}
                  src={`https://www.youtube.com/embed/${playingTrailer.key}?autoplay=1`}
                  allowFullScreen
                  title="Film Trailer"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

      </div>
    </>
  );
}
