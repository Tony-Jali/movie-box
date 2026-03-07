import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SUPABASE_URL = "https://zuriegsqtshtcyiytftg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cmllZ3NxdHNodGN5aXl0ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDU5NzAsImV4cCI6MjA4ODM4MTk3MH0.09K-bABDaXEUvhgaG1Q_e38JLlj-ZDVunRvAUcI7JHs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }

  .login-input {
    width: 100%;
    padding: 16px 18px;
    background: rgba(22, 22, 22, 0.8);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 4px;
    color: white;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .login-input:focus {
    border-color: rgba(255,255,255,0.6);
    background: rgba(50,50,50,0.8);
  }
  .login-input::placeholder { color: rgba(255,255,255,0.4); }

  .login-btn-primary {
    width: 100%;
    padding: 16px;
    background: #e50914;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.2s;
  }
  .login-btn-primary:hover:not(:disabled) { background: #f40612; }
  .login-btn-primary:disabled { background: #831010; cursor: not-allowed; opacity: 0.7; }

  .login-btn-secondary {
    width: 100%;
    padding: 14px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 4px;
    color: rgba(255,255,255,0.75);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.2s, border-color 0.2s;
  }
  .login-btn-secondary:hover {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.4);
    color: white;
  }
`;

const BG_MOVIES = [
  "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
  "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  "/kdPMUlP73bMv4Mr46UF9GjMRDTF.jpg",
  "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
  "/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
  "/6MKr3KgOLmzOP6MSuZERO41Lpbb.jpg",
  "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  "/oDkQxpiGNSvDBRjFzOgKqFLa2L4.jpg",
  "/pB8BM7pdSp6B3DbLui1dx8JLB2T.jpg",
];

const IMG_W = "https://image.tmdb.org/t/p/w300";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.pathname === "/register" ? "register" : "login";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!email.trim() || !password.trim()) {
        setMessage("Veuillez entrer un email et un mot de passe");
        setMsgType("error");
        setLoading(false);
        return;
      }

      if (mode === "register") {
        if (!username.trim()) {
          setMessage("Veuillez entrer un nom d'utilisateur");
          setMsgType("error");
          setLoading(false);
          return;
        }

        const { data: existingEmail, error: emailErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email.trim())
          .maybeSingle();

        if (emailErr) {
          setMessage("Erreur verification email: " + emailErr.message);
          setMsgType("error");
          setLoading(false);
          return;
        }

        if (existingEmail) {
          setMessage("Cet email est deja utilise.");
          setMsgType("error");
          setLoading(false);
          return;
        }

        const userId = crypto.randomUUID();
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{
            id: userId,
            username: username.trim(),
            email: email.trim(),
            password: password,
            avatar: null
          }]);

        if (profileError) {
          setMessage("Erreur inscription: " + profileError.message);
          setMsgType("error");
          setLoading(false);
          return;
        }

        localStorage.setItem("moviebox_user_id", userId);
        localStorage.setItem("moviebox_username", username.trim());
        setMessage("Compte cree! Redirection...");
        setMsgType("success");
        setTimeout(() => navigate("/"), 800);
      } else {
        const { data: user, error: loginError } = await supabase
          .from("profiles")
          .select("id, username")
          .eq("email", email.trim())
          .eq("password", password)
          .maybeSingle();

        if (loginError) {
          setMessage("Erreur connexion: " + loginError.message);
          setMsgType("error");
          setLoading(false);
          return;
        }

        if (!user) {
          setMessage("Email ou mot de passe invalide.");
          setMsgType("error");
          setLoading(false);
          return;
        }

        localStorage.setItem("moviebox_user_id", user.id);
        localStorage.setItem("moviebox_username", user.username || email.split("@")[0]);
        setMessage("Connexion reussie! Redirection...");
        setMsgType("success");
        setTimeout(() => navigate("/"), 800);
      }
    } catch (err) {
      setMessage("Erreur: " + err.message);
      setMsgType("error");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh",
        background: "#141414",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden"
      }}>

        <div style={{
          position: "absolute", inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 4,
          opacity: 0.25,
          filter: "blur(1px)",
          transform: "scale(1.05)"
        }}>
          {BG_MOVIES.map((path, i) => (
            <div key={i} style={{
              backgroundImage: `url(${IMG_W}${path})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }} />
          ))}
        </div>

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(20,20,20,0.85) 50%, rgba(20,20,20,0.95) 100%)"
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          padding: "20px 4%",
          display: "flex", alignItems: "center"
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              color: "#e50914", fontSize: 32, fontWeight: 900,
              letterSpacing: "-1px", cursor: "pointer"
            }}
            onClick={() => navigate("/")}>
            MOVIEBOX
          </motion.div>
        </div>

        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
          position: "relative", zIndex: 10
        }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              width: "100%",
              maxWidth: 450,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(12px)",
              borderRadius: 6,
              padding: "60px 68px",
              boxShadow: "0 4px 60px rgba(0,0,0,0.8)"
            }}>

            <h1 style={{
              fontSize: 32, fontWeight: 700,
              marginBottom: 28, color: "white"
            }}>
              {mode === "register" ? "S'inscrire" : "Se connecter"}
            </h1>

            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mode === "register" && (
                <input
                  className="login-input"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}

              <input
                className="login-input"
                type="email"
                placeholder="Email fictif (ex: toi@moviebox.local)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="login-input"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                className="login-btn-primary"
                type="submit"
                disabled={loading}
                style={{ marginTop: 8 }}>
                {loading ? "Chargement..." : mode === "register" ? "S'inscrire" : "Se connecter"}
              </button>

              <button
                className="login-btn-secondary"
                type="button"
                onClick={() => {
                  localStorage.setItem("testMode", "true");
                  navigate("/");
                }}>
                Acces TEST (sans inscription)
              </button>
            </form>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: 16,
                    padding: "12px 16px",
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 600,
                    background: msgType === "error" ? "rgba(229,9,20,0.15)" : "rgba(70,211,105,0.15)",
                    border: `1px solid ${msgType === "error" ? "rgba(229,9,20,0.4)" : "rgba(70,211,105,0.4)"}`,
                    color: msgType === "error" ? "#ff6b6b" : "#46d369"
                  }}>
                  {msgType === "error" ? "! " : "OK "}{message}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{
              marginTop: 48,
              fontSize: 16,
              color: "rgba(255,255,255,0.5)"
            }}>
              {mode === "register" ? "Deja un compte ? " : "Nouveau sur MOVIEBOX ? "}
              <span
                onClick={() => navigate(mode === "register" ? "/login" : "/register")}
                style={{ color: "white", fontWeight: 700, cursor: "pointer" }}>
                {mode === "register" ? "Connectez-vous." : "Inscrivez-vous maintenant."}
              </span>
            </div>

            <p style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
              Utilisez un email fictif, mais au format valide.
            </p>
          </motion.div>
        </div>

        <div style={{
          position: "relative", zIndex: 10,
          padding: "20px 4%",
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}>
          <p style={{ color: "#757575", fontSize: 13, textAlign: "center" }}>
            2026 MOVIEBOX - Donnees issues de TMDB
          </p>
        </div>

      </div>
    </>
  );
}
