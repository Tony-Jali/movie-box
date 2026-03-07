import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clapperboard, Code2, Film, Heart, Mail, MessageCircle, Search, Smartphone, Star, Video } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div style={{
      background: "#141414", color: "white", minHeight: "100vh",
      padding: "60px 4% 40px"
    }}>
      {/* Navigation Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 4%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          style={{
            fontSize: 24, fontWeight: 900, cursor: "pointer",
            background: "linear-gradient(135deg, #e50914, #831010)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Clapperboard size={20} /> MOVIEBOX</span>
        </motion.div>
        <motion.button
          whileHover={{ background: "rgba(255,255,255,0.1)" }}
          onClick={() => navigate("/")}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
            color: "#b3b3b3", padding: "8px 16px", borderRadius: 4,
            fontSize: 13, cursor: "pointer", fontWeight: 600
          }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ArrowLeft size={14} /> Retour</span>
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: 900, margin: "0 auto", paddingTop: 60
        }}>

        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          style={{
            textAlign: "center", marginBottom: 60,
            padding: "40px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(229,9,20,0.15), rgba(229,9,20,0.05))",
            border: "1px solid rgba(229,9,20,0.3)"
          }}>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 900,
            marginBottom: 16, letterSpacing: "-1px"
          }}>
            À Propos de MovieBox
          </h1>
          <p style={{
            fontSize: 18, color: "#b3b3b3", lineHeight: 1.6,
            maxWidth: 600, margin: "0 auto"
          }}>
            Découvrez les meilleurs films du moment avec une interface élégante et intuitive
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 24,
            marginBottom: 60
          }}>
          {[
            {
              icon: Film,
              title: "Catalogue Complet",
              desc: "Accédez à des milliers de films populaires et tendance"
            },
            {
              icon: Star,
              title: "Notes & Critiques",
              desc: "Consultez les avis du public pour choisir vos films"
            },
            {
              icon: Video,
              title: "Trailers HD",
              desc: "Regardez les bandes-annonces en haute définition"
            },
            {
              icon: Heart,
              title: "Ma Liste",
              desc: "Sauvegardez vos films préférés pour plus tard"
            },
            {
              icon: Search,
              title: "Recherche Avancée",
              desc: "Trouvez rapidement le film que vous cherchez"
            },
            {
              icon: Smartphone,
              title: "Responsive Design",
              desc: "Une expérience fluide sur tous vos appareils"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, background: "rgba(229,9,20,0.1)" }}
              style={{
                padding: 24, borderRadius: 8,
                background: "rgba(229,9,20,0.05)",
                border: "1px solid rgba(229,9,20,0.2)",
                transition: "all 0.3s ease"
              }}>
              <div style={{ fontSize: 40, marginBottom: 12, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <feature.icon size={36} />
              </div>
              <h3 style={{
                fontSize: 16, fontWeight: 700, marginBottom: 8
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 13, color: "#b3b3b3", lineHeight: 1.5
              }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Developer Section */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: "40px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            marginBottom: 60
          }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><Code2 size={60} /></div>
          <h2 style={{
            fontSize: 28, fontWeight: 700, marginBottom: 12
          }}>
            Développé par Tony Jali
          </h2>
          <p style={{
            fontSize: 15, color: "#b3b3b3", marginBottom: 24, lineHeight: 1.6
          }}>
            Passionné par le développement web et les technologies modernes. <br />
            Création d'applications React innovantes et performantes.
          </p>
          
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              whileHover={{ scale: 1.05, background: "rgba(0,119,182,0.9)" }}
              href="https://www.linkedin.com/in/tony-jali-a688b43b2?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B09Y4%2BkN3Sli%2Fqn5UjmIGLw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 6,
                background: "rgba(0,119,182,0.8)", border: "1px solid rgba(0,119,182,1)",
                color: "white", fontWeight: 700, fontSize: 15,
                cursor: "pointer", transition: "all 0.3s ease",
                textDecoration: "none"
              }}>
              <span style={{ fontSize: 20 }}>in</span>
              LinkedIn
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, background: "rgba(37,211,102,0.9)" }}
              href="https://wa.me/651507435"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 6,
                background: "rgba(37,211,102,0.8)", border: "1px solid rgba(37,211,102,1)",
                color: "white", fontWeight: 700, fontSize: 15,
                cursor: "pointer", transition: "all 0.3s ease",
                textDecoration: "none"
              }}>
              <MessageCircle size={18} />
              WhatsApp
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
              href="mailto:tjali2608@gmail.com"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 6,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)",
                color: "white", fontWeight: 700, fontSize: 15,
                cursor: "pointer", transition: "all 0.3s ease",
                textDecoration: "none"
              }}>
              <Mail size={18} />
              Email
            </motion.a>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: "40px", borderRadius: 12,
            background: "rgba(229,9,20,0.08)",
            border: "1px solid rgba(229,9,20,0.25)"
          }}>
          <h3 style={{
            fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center"
          }}>
            Stack Technologique
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 12
          }}>
            {[
              "React 19.2.0",
              "Vite",
              "React Router",
              "Supabase",
              "Framer Motion",
              "Axios",
              "TMDB API",
              "CSS3"
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: "12px 16px", borderRadius: 6,
                  background: "rgba(229,9,20,0.4)",
                  border: "1px solid rgba(229,9,20,0.6)",
                  textAlign: "center", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.3s ease"
                }}>
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          marginTop: 80,
          paddingTop: 40,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center", color: "#666666", fontSize: 12
        }}>
        <p>
          © 2026 MovieBox — Données issues de TMDB API <br />
          Développé avec passion par Tony Jali
        </p>
      </motion.div>
    </div>
  );
}
