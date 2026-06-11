import { useState, useEffect, useRef } from "react";
import iconDonasi from "./assets/icon-donasi.png";
import iconLokasi from "./assets/icon-lokasi.png";
import iconChat from "./assets/icon-chat.png";
import donasi from "./assets/donasi.png";
import Eksplorasi from "./pages/Eksplorasi";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
// ── Tailwind config is injected via CDN in claude.ai; colors are inlined as styles ──
const colors = {
  primary: "#0052cc",
  onPrimary: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#434654",
  outlineVariant: "#e1e2e4",
  surfaceContainer: "#f8f9fb",
  surfaceContainerLow: "#ffffff",
  background: "#ffffff",
};

// ── Reusable hooks ──
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

// ── Canvas particle animation ──
function ParticleCanvas({ id, dark = false }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let time = 0;
    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener("resize", resize);
    resize();
    function draw() {
      time += 0.005;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const gridSize = 100;
      const rows = Math.ceil(height / gridSize) + 1;
      const cols = Math.ceil(width / gridSize) + 1;
      ctx.strokeStyle = dark
        ? "rgba(255,255,255,0.25)"
        : "rgba(0,82,204,0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          const nx = Math.sin(x * 0.003 + time) * 25;
          const ny = Math.cos(y * 0.003 + time) * 25;
          const size = 1.5 + Math.sin(time + (x + y) * 0.008) * 1;
          ctx.beginPath();
          ctx.arc(x + nx, y + ny, size, 0, Math.PI * 2);
          ctx.stroke();
          if (i < cols - 1 && j < rows - 1) {
            ctx.globalAlpha = 0.05;
            ctx.beginPath();
            ctx.moveTo(x + nx, y + ny);
            ctx.lineTo(
              (i + 1) * gridSize + Math.sin((i + 1) * gridSize * 0.003 + time) * 25,
              y + ny
            );
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);
  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
        opacity: dark ? 0.15 : 0.4,
        filter: dark ? "brightness(1.5)" : undefined,
      }}
    />
  );
}

// ── Section components ──

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${colors.outlineVariant}40`,
      boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
      transition: "all 0.5s ease",
    }}>
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 80, padding: "0 24px", maxWidth: 1140, margin: "0 auto",
      }}>
        <div style={{ fontFamily: "Montserrat", fontSize: 24, fontWeight: 800, color: colors.primary, letterSpacing: "-0.01em" }}>
          Baik.in
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {["Projects", "Skills", "Contact"].map((item, i) => (
            <button key={item} style={{
              fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
              color: i === 0 ? colors.primary : colors.onSurfaceVariant,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              borderBottom: i === 0 ? `2px solid ${colors.primary}` : "none",
              paddingBottom: 4,
              transition: "color 0.3s",
            }}>{item}</button>
          ))}
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();
  const [ref2, visible2] = useScrollReveal();
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      paddingTop: 120, paddingBottom: 80,
      background: "linear-gradient(to top, rgba(0,82,204,0.05), #fff)",
    }}>
      {/* Blob */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0,82,204,0.08) 0%, rgba(255,255,255,0) 70%)",
        zIndex: 0, top: -200, right: -100, borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        maxWidth: 1140, margin: "0 auto", padding: "0 24px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40,
        alignItems: "center", position: "relative", zIndex: 1,
      }} className="hero-grid">
        {/* Text */}
        <div ref={ref} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 16px", background: `${colors.primary}0d`,
            color: colors.primary, borderRadius: 9999,
            fontSize: 12, fontWeight: 500, fontFamily: "Montserrat",
            border: `1px solid ${colors.primary}1a`, width: "fit-content",
          }}>
            ★ Featured Project
          </div>
          <h1 style={{
            fontFamily: "Montserrat", fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800, color: colors.onSurface, lineHeight: 1.1,
            letterSpacing: "-0.02em", margin: 0,
          }}>
            Baik.in: Berbagi Jadi Lebih Mudah.
          </h1>
          <p style={{
            fontFamily: "Montserrat", fontSize: 18, fontWeight: 400,
            color: colors.onSurfaceVariant, lineHeight: 1.6,
            maxWidth: 480, margin: 0,
          }}>
            Platform komunitas untuk mendonasikan barang-barang yang tidak terpakai
            namun layak pakai ke panti asuhan dan komunitas yang membutuhkan.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 24 }}>
            <a href="/baikin.apk" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: colors.primary, color: colors.onPrimary,
              padding: "14px 24px", borderRadius: 12, border: "none",
              fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
              cursor: "pointer", boxShadow: `0 8px 24px ${colors.primary}30`,
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04) translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1) translateY(0)"}
            >
              ⬇ Download APK
            </a>
            <button onClick={() => navigate("/eksplorasi")}
            
            
            style={{
              background: "#fff", border: `2px solid ${colors.primary}33`,
              color: colors.primary, padding: "14px 24px", borderRadius: 12,
              fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
              cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.background = `${colors.primary}0d`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${colors.primary}33`; e.currentTarget.style.background = "#fff"; }}
            >
              Eksplorasi Proyek
            </button>
          </div>
        </div>

        {/* Image */}
        <div ref={ref2} style={{
          position: "relative",
          opacity: visible2 ? 1 : 0,
          transform: visible2 ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s 0.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `${colors.primary}1a`, filter: "blur(48px)",
            borderRadius: "50%", transform: "scale(0.9)", zIndex: -1,
          }} />
         <img
  src={donasi}
  alt="Baik.in Mockup"
  style={{
    width: "100%", maxWidth: 360, height: "auto",
    objectFit: "contain", margin: "0 auto", display: "block",
    filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.15))",
    animation: "bob 6s ease-in-out infinite",
  }}
/>
        </div>
      </div>

      <style>{`
      @keyframes bob {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const features = [
  {
    title: "Chat Sesama User",
    desc: "Fitur komunikasi langsung antar donatur dan penerima untuk koordinasi yang lebih baik.",
    img: iconChat,
  },
  {
    title: "Lokasi Donasi",
    desc: "Pemetaan titik-titik panti asuhan dan lembaga yang membutuhkan bantuan secara transparan.",
    img: iconLokasi,
  },
  {
    title: "Donasi Jarak Terdekat",
    desc: "Algoritma pencarian lokasi donasi paling dekat dengan posisi user untuk efisiensi logistik.",
    img: iconDonasi,
  },
];

function FeatureCard({ feature, delay }) {
  const [ref, visible] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)"
          : "translateY(60px) scale(0.95)",
        transition: `opacity 1.4s ${delay}ms cubic-bezier(0.16,1,0.3,1), transform ${visible ? "0.6s" : `1.4s ${delay}ms`} cubic-bezier(0.16,1,0.3,1)`,
        background: "#fff", padding: 40, borderRadius: 16,
        border: `1px solid ${colors.outlineVariant}4d`,
        textAlign: "center",
        boxShadow: hovered ? "0 30px 60px -12px rgba(0,82,204,0.12)" : "none",
      }}
    >
      <div style={{
        width: 80, height: 80,
        background: hovered ? colors.primary : `${colors.primary}0d`,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 16, margin: "0 auto 24px",
        transform: hovered ? "rotate(6deg)" : "rotate(0deg)",
        transition: "all 0.5s",
      }}>
        <img src={feature.img} alt={feature.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
      </div>
      <h3 style={{
        fontFamily: "Montserrat", fontSize: 24, fontWeight: 700,
        color: hovered ? colors.primary : colors.onSurface,
        margin: "0 0 8px", transition: "color 0.3s",
      }}>{feature.title}</h3>
      <p style={{
        fontFamily: "Montserrat", fontSize: 16, fontWeight: 400,
        color: colors.onSurfaceVariant, lineHeight: 1.6, margin: 0,
      }}>{feature.desc}</p>
    </div>
  );
}

function FeaturesSection() {
  const [titleRef, titleVisible] = useScrollReveal();
  return (
    <section style={{ padding: "96px 0", background: "#f8f9fb", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div ref={titleRef} style={{
          textAlign: "center", marginBottom: 64,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{ color: colors.primary, fontFamily: "Montserrat", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Platform Capabilities
          </span>
          <h2 style={{ fontFamily: "Montserrat", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, color: colors.onSurface, margin: "8px 0 16px" }}>
            Fitur Utama
          </h2>
          <div style={{ width: 48, height: 6, background: colors.primary, margin: "0 auto", borderRadius: 999 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {features.map((f, i) => <FeatureCard key={f.title} feature={f} delay={i * 150} />)}
        </div>
      </div>
    </section>
  );
}

function BioSection() {
  const [ref, visible] = useScrollReveal();
  return (
    <section style={{ padding: "96px 24px", background: "#f8fafc" }}>
      <div
        ref={ref}
        style={{
          display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24,
          maxWidth: 1140, margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="bio-grid"
      >
        <div style={{
          background: "#fff", padding: 40, borderRadius: 16,
          border: `1px solid ${colors.outlineVariant}66`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{ fontFamily: "Montserrat", fontSize: 24, fontWeight: 700, color: colors.onSurface, marginBottom: 16 }}>
            Latar Belakang
          </h2>
          <p style={{ fontFamily: "Montserrat", fontSize: 16, color: colors.onSurfaceVariant, lineHeight: 1.7, margin: 0 }}>
            Saya adalah{" "}
            <span style={{ color: colors.primary, fontWeight: 600 }}>Githa Refina</span>
            , seorang Lead Developer lulusan Sistem Informasi dari Universitas Brawijaya dengan IPK 3.45.
            Memiliki pengalaman profesional selama lebih dari 3 tahun di industri pengembangan perangkat lunak,
            saya fokus pada menciptakan solusi teknologi yang berdampak sosial, seperti platform Baik.in ini.
          </p>
        </div>
        <div style={{
          background: colors.primary, color: colors.onPrimary,
          padding: 40, borderRadius: 16,
          boxShadow: `0 12px 32px ${colors.primary}1a`,
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "Montserrat", fontSize: 12, fontWeight: 500, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>
            Professional Role
          </span>
          <span style={{ fontFamily: "Montserrat", fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
            Lead Developer
          </span>
          <div style={{ marginTop: 16, width: 40, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 999 }} />
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .bio-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function ChallengeSection() {
  const [leftRef, leftVisible] = useScrollReveal();
  const [rightRef, rightVisible] = useScrollReveal();
  return (
    <section style={{ padding: "96px 0", background: "#fff", overflow: "hidden" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="challenge-grid">
        <div ref={leftRef} style={{
          position: "relative", height: 600, borderRadius: 40, overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
          opacity: leftVisible ? 1 : 0,
          transform: leftVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop"
            alt="Logistics Solution"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
          <div style={{ position: "absolute", bottom: 40, left: 40, right: 40 }}>
            <div style={{ color: "#fff", fontFamily: "Montserrat", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
              ℹ Tantangan :
            </div>
            <h2 style={{ color: "#fff", fontFamily: "Montserrat", fontSize: "clamp(24px,3vw,40px)", fontWeight: 600, margin: 0, lineHeight: 1.1 }}>
              Pemetaan kebutuhan terdekat.
            </h2>
          </div>
        </div>

        <div ref={rightRef} style={{
          paddingLeft: 40,
          opacity: rightVisible ? 1 : 0,
          transform: rightVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s 0.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ color: colors.primary, fontFamily: "Montserrat", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
            ✓ Solusi :
          </div>
          <h2 style={{ fontFamily: "Montserrat", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 600, color: colors.onSurface, marginBottom: 24, lineHeight: 1.05 }}>
            Notifikasi Donasi Terdekat
          </h2>
          <p style={{ fontFamily: "Montserrat", fontSize: 16, color: colors.onSurfaceVariant, lineHeight: 1.7 }}>
            Sistem kami menghadirkan notifikasi real-time untuk kebutuhan di sekitar Anda.
            Dengan chat terintegrasi, koordinasi penjemputan menjadi instan.
          </p>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .challenge-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function FutureFeaturesSection() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [cardRef, cardVisible] = useScrollReveal();
  return (
    <section style={{ padding: "96px 0", background: "#fff", position: "relative", overflow: "hidden" }}>
      <ParticleCanvas id="canvas-future" />
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div ref={titleRef} style={{
          textAlign: "center", marginBottom: 64,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{ color: colors.primary, fontFamily: "Montserrat", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Future Innovation
          </span>
          <h2 style={{ fontFamily: "Montserrat", fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: colors.onSurface, margin: "8px 0 16px" }}>
            Fitur Mendatang
          </h2>
          <div style={{ width: 48, height: 6, background: colors.primary, margin: "0 auto", borderRadius: 999 }} />
        </div>
        <div
          ref={cardRef}
          style={{
            background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)",
            border: `1px solid ${colors.outlineVariant}66`, borderRadius: 40,
            padding: "64px 80px", display: "flex", alignItems: "center", gap: 40,
            boxShadow: "0 20px 60px rgba(0,82,204,0.05)",
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
          }}
          className="future-card"
        >
          <div style={{
            width: 128, height: 128, background: `${colors.primary}0d`,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 32, flexShrink: 0, fontSize: 64,
          }}>
            ♻
          </div>
          <div>
            <h3 style={{ fontFamily: "Montserrat", fontSize: 24, fontWeight: 700, color: colors.onSurface, marginBottom: 12 }}>
              Kelola Sampah Jadi Bahan Bakar
            </h3>
            <p style={{ fontFamily: "Montserrat", fontSize: 18, color: colors.onSurfaceVariant, lineHeight: 1.6, marginBottom: 16 }}>
              Inovasi masa depan untuk mengonversi sampah menjadi bahan bakar alternatif (biofuel)
              yang dapat digunakan untuk mobil atau genset, mendukung ekosistem yang lebih hijau dan berkelanjutan.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: colors.primary, fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
              background: `${colors.primary}0d`, padding: "8px 16px",
              borderRadius: 9999, border: `1px solid ${colors.primary}1a`,
            }}>
              🚀 Coming Soon in 2025
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 640px) { .future-card { flex-direction: column !important; padding: 40px 24px !important; text-align: center; } }`}</style>
      </div>
    </section>
  );
}

function CTASection() {
  const [ref, visible] = useScrollReveal();
  return (
    <section style={{ padding: "96px 0", background: colors.primary, position: "relative", overflow: "hidden" }}>
      <ParticleCanvas id="canvas-cta" dark />
      <div
        ref={ref}
        style={{
          maxWidth: 1140, margin: "0 auto", padding: "0 24px",
          textAlign: "center", position: "relative", zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 16px", background: "rgba(255,255,255,0.1)",
          borderRadius: 9999, fontSize: 12, fontWeight: 500,
          fontFamily: "Montserrat", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", marginBottom: 24,
        }}>
          🤝 Partnership Opportunity
        </div>
        <h2 style={{
          fontFamily: "Montserrat", fontSize: "clamp(32px,5vw,48px)",
          fontWeight: 800, color: "#fff", lineHeight: 1.1,
          letterSpacing: "-0.02em", marginBottom: 16,
        }}>
          Mari Berkolaborasi &amp; Berbagi Dampak
        </h2>
        <p style={{
          fontFamily: "Montserrat", fontSize: 18, color: "rgba(255,255,255,0.9)",
          lineHeight: 1.6, maxWidth: 600, margin: "0 auto 40px",
        }}>
          Kami selalu terbuka untuk kolaborasi dengan pengembang, organisasi sosial,
          atau mitra strategis yang ingin menciptakan dampak positif berkelanjutan bersama Baik.in.
        </p>

        
        
        
        
        {/* <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
  {[
    { label: "Hubungi Kami Sekarang ✉", href: "https://yourwebsite.com", style: { background: "#fff", color: colors.primary } },
    { label: "Ajakan Berdonasi ♥", style: { background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "#fff" } },
  ].map(btn =>
    btn.href ? (
      
        key={btn.label}
        href={btn.href}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 40px", borderRadius: 12,
          fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
          cursor: "pointer", textDecoration: "none",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          ...btn.style,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04) translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
      >
        {btn.label}
      </a>
    ) : (
      <button
        key={btn.label}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 40px", borderRadius: 12,
          fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
          cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          ...btn.style,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04) translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
      >
        {btn.label}
      </button>
    )
  )}
</div> */}




        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Hubungi Kami Sekarang ✉", href: "https://yourwebsite.com", style: { background: "#fff", color: colors.primary } },
            { label: "Ajakan Berdonasi ♥", style: { background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "#fff" } },
          ].map(btn => (
            <a
              key={btn.label}
              href={btn.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 40px", borderRadius: 12,
                fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                ...btn.style,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04) translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: colors.surfaceContainer,
      borderTop: `1px solid ${colors.outlineVariant}4d`,
      padding: "40px 0",
    }}>
      <div style={{
        maxWidth: 1140, margin: "0 auto", padding: "0 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 24,
      }}>
        <div>
          <div style={{ fontFamily: "Montserrat", fontSize: 24, fontWeight: 800, color: colors.primary, marginBottom: 8 }}>
            Baik.in
          </div>
          <p style={{ fontFamily: "Montserrat", fontSize: 16, color: colors.onSurfaceVariant, margin: 0, maxWidth: 360 }}>
            © 2024 Baik.in Donation Platform. Built for community impact with modern technology.
          </p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["LinkedIn", "GitHub", "Twitter"].map(link => (
            <button key={link} style={{
              fontFamily: "Montserrat", fontSize: 14, fontWeight: 600,
              color: colors.onSurfaceVariant, background: "none", border: "none",
              cursor: "pointer", padding: 0,
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = colors.primary}
              onMouseLeave={e => e.currentTarget.style.color = colors.onSurfaceVariant}
            >
              {link} ↗
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      <main style={{ paddingTop: 80 }}>
        <HeroSection />
        <FeaturesSection />
        <BioSection />
        <ChallengeSection />
        <FutureFeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
// ── Root ──
// export default function BaikinApp() {
//   return (
//     <div style={{ fontFamily: "Montserrat, sans-serif", overflowX: "hidden" }}>
//       <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
//       <Header />
//       <main style={{ paddingTop: 80 }}>
//         <HeroSection />
//         <FeaturesSection />
//         <BioSection />
//         <ChallengeSection />
//         <FutureFeaturesSection />
//         <CTASection />
//       </main>
//       <Footer />
//     </div>
//   );
// }
export default function BaikinApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eksplorasi" element={<Eksplorasi />} />
      </Routes>
    </BrowserRouter>
  );
}
