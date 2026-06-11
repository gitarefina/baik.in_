import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ssChat from "../assets/ss-chat.png";
import ssLokasi from "../assets/ss-lokasi.png";
import ssDonasi from "../assets/ss-donasi.png";

const colors = {
  primary: "#0052cc",
  onPrimary: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#434654",
  outlineVariant: "#e1e2e4",
  surfaceContainer: "#f8f9fb",
};

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const fitur = [
  {
    title: "Chat Sesama User",
    desc: "Fitur komunikasi langsung antar donatur dan penerima untuk koordinasi yang lebih baik.",
    img: ssChat,
    badge: "Komunikasi",
  },
  {
    title: "Lokasi Donasi",
    desc: "Pemetaan titik-titik panti asuhan dan lembaga yang membutuhkan bantuan secara transparan.",
    img: ssLokasi,
    badge: "Pemetaan",
  },
  {
    title: "Donasi Jarak Terdekat",
    desc: "Algoritma pencarian lokasi donasi paling dekat dengan posisi user untuk efisiensi logistik.",
    img: ssDonasi,
    badge: "Algoritma",
  },
];

function FiturCard({ item, index }) {
  const [ref, visible] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 1.2s ${index * 150}ms cubic-bezier(0.16,1,0.3,1), transform 1.2s ${index * 150}ms cubic-bezier(0.16,1,0.3,1)`,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        alignItems: "center",
        padding: "64px 0",
        borderBottom: `1px solid ${colors.outlineVariant}4d`,
      }}
      className="fitur-row"
    >
      {/* Image */}
      <div
        style={{ order: isEven ? 0 : 1 }}
        className="fitur-img-col"
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: hovered
              ? "0 40px 80px rgba(0,82,204,0.15)"
              : "0 20px 40px rgba(0,0,0,0.08)",
            transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
          }}
        >
          <img
            src={item.img}
            alt={item.title}
            style={{
              width: "100%", height: "auto",
              objectFit: "cover", display: "block",
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div style={{ order: isEven ? 1 : 0, padding: "0 16px" }} className="fitur-text-col">
        <div style={{
          display: "inline-flex", alignItems: "center",
          padding: "4px 14px", background: `${colors.primary}0d`,
          color: colors.primary, borderRadius: 9999,
          fontSize: 12, fontWeight: 600, fontFamily: "Montserrat",
          border: `1px solid ${colors.primary}1a`,
          marginBottom: 16, letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {item.badge}
        </div>
        <h2 style={{
          fontFamily: "Montserrat",
          fontSize: "clamp(24px, 3vw, 36px)",
          fontWeight: 700, color: colors.onSurface,
          lineHeight: 1.2, margin: "0 0 16px",
        }}>
          {item.title}
        </h2>
        <p style={{
          fontFamily: "Montserrat", fontSize: 16,
          color: colors.onSurfaceVariant, lineHeight: 1.8, margin: 0,
        }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export default function Eksplorasi() {
  const navigate = useNavigate();
  const [titleRef, titleVisible] = useScrollReveal();

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", background: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.outlineVariant}40`,
      }}>
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          height: 72, padding: "0 24px", maxWidth: 1140, margin: "0 auto",
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              fontFamily: "Montserrat", fontSize: 22, fontWeight: 800,
              color: colors.primary, background: "none", border: "none",
              cursor: "pointer", padding: 0,
            }}
          >
            Baik.in
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
              color: colors.primary, background: `${colors.primary}0d`,
              border: `1px solid ${colors.primary}1a`,
              padding: "8px 16px", borderRadius: 9999, cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${colors.primary}1a`}
            onMouseLeave={e => e.currentTarget.style.background = `${colors.primary}0d`}
          >
            ← Kembali
          </button>
        </nav>
      </header>

      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section style={{
          padding: "80px 24px 40px",
          background: "linear-gradient(to bottom, rgba(0,82,204,0.03), #fff)",
          textAlign: "center",
        }}>
          <div
            ref={titleRef}
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
              maxWidth: 640, margin: "0 auto",
            }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 16px", background: `${colors.primary}0d`,
              color: colors.primary, borderRadius: 9999,
              fontSize: 12, fontWeight: 600, fontFamily: "Montserrat",
              border: `1px solid ${colors.primary}1a`, marginBottom: 24,
            }}>
              ✦ Eksplorasi Proyek
            </div>
            <h1 style={{
              fontFamily: "Montserrat",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800, color: colors.onSurface,
              lineHeight: 1.1, letterSpacing: "-0.02em", margin: "0 0 16px",
            }}>
              Fitur Unggulan Baik.in
            </h1>
            <p style={{
              fontFamily: "Montserrat", fontSize: 18,
              color: colors.onSurfaceVariant, lineHeight: 1.6, margin: 0,
            }}>
              Kenali lebih dalam fitur-fitur yang membuat donasi jadi lebih mudah, transparan, dan efisien.
            </p>
          </div>
        </section>

        {/* Fitur List */}
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 24px 96px" }}>
          {fitur.map((item, i) => (
            <FiturCard key={item.title} item={item} index={i} />
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        background: colors.surfaceContainer,
        borderTop: `1px solid ${colors.outlineVariant}4d`,
        padding: "32px 24px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "Montserrat", fontSize: 14,
          color: colors.onSurfaceVariant, margin: 0,
        }}>
          © 2024 Baik.in Donation Platform
        </p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .fitur-row { grid-template-columns: 1fr !important; gap: 32px !important; }
          .fitur-img-col, .fitur-text-col { order: unset !important; }
        }
      `}</style>
    </div>
  );
}