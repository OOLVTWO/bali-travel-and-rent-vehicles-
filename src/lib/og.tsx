import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Gambar preview link (Open Graph) 1200×630, gaya Opsi A: navy → toska, matahari kuning.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const host = site.url.replace(/^https?:\/\//, "");

export function ogCard({ eyebrow, title, meta }: { eyebrow: string; title: string; meta?: string }) {
  const titleSize = title.length > 60 ? 58 : title.length > 36 ? 68 : 80;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#ffffff",
          backgroundColor: "#0b3b55",
          backgroundImage: "linear-gradient(135deg, #0b3b55 0%, #0b3b55 45%, #0a7c86 100%)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -140, right: -120, width: 420, height: 420, borderRadius: 9999, backgroundColor: "#ffc940", opacity: 0.95, display: "flex" }} />
        <svg width="1200" height="160" viewBox="0 0 1200 160" style={{ position: "absolute", left: 0, bottom: 0 }}>
          <path d="M0 70 C150 20 300 20 450 70 S750 120 900 70 S1100 20 1200 50" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="6" fill="none" />
          <path d="M0 120 C150 70 300 70 450 120 S750 170 900 120 S1100 70 1200 100" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="6" fill="none" />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="14" r="7" fill="#FFC940" />
            <path d="M3 24c4-3 8-3 11 0s8 3 11 0 6-3 6-3" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M3 29c4-3 8-3 11 0s8 3 11 0 6-3 6-3" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.5 }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: "#ffc940", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</span>
          <span style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>{title}</span>
          {meta && <span style={{ fontSize: 32, color: "#fff4d6" }}>{meta}</span>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#d6ecef" }}>
          <span>{host}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 9999, backgroundColor: "#25d366", color: "#0d2b3e", fontWeight: 700 }}>
            WhatsApp {site.whatsappDisplay}
          </span>
        </div>
      </div>
    ),
    ogSize,
  );
}
