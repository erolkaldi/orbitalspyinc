"use client";

import { TIER_LIMITS } from '@/lib/gameConfig'
import type { SatelliteData } from '@/types/game'

type Props = {
  satellite: SatelliteData;
  onChange: (sat: SatelliteData) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function OrbitModal({ satellite, onChange, onSave, onClose }: Props) {
  const limits = TIER_LIMITS[satellite.tier as keyof typeof TIER_LIMITS];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{
        background: "#0d1a0f",
        border: "1px solid #1a3a1f",
        borderRadius: "6px",
        padding: "40px",
        width: "380px",
      }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>YÖRÜNGE AYARLARI</div>
        <div style={{ fontSize: "18px", color: "#4ade80", letterSpacing: "2px", marginBottom: "28px" }}>{satellite.name}</div>

        {/* Orbit Type */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "10px" }}>YÖRÜNGE TİPİ</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["LEO", "MEO", "GEO"].map((type) => {
              const locked = !limits.orbitTypes.includes(type as any);
              return (
                <button
                  key={type}
                  onClick={() => !locked && onChange({ ...satellite, orbitType: type })}
                  style={{
                    flex: 1,
                    background: satellite.orbitType === type ? "rgba(74,222,128,0.2)" : "none",
                    border: `1px solid ${locked ? "#111f14" : satellite.orbitType === type ? "#4ade80" : "#1a3a1f"}`,
                    color: locked ? "#1a3a1f" : satellite.orbitType === type ? "#4ade80" : "#2d6a35",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    cursor: locked ? "not-allowed" : "pointer",
                    opacity: locked ? 0.4 : 1,
                  }}
                >
                  {locked ? "🔒" : ""} {type}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: "9px", color: "#2d6a35", marginTop: "6px" }}>
            {satellite.orbitType === "LEO" && "Alçak yörünge · Hızlı · Dar kapsama"}
            {satellite.orbitType === "MEO" && "Orta yörünge · Dengeli kapsama"}
            {satellite.orbitType === "GEO" && "Sabit yörünge · Geniş kapsama · Sadece ekvator"}
          </div>
        </div>

        {/* Inclination */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "10px" }}>
            EĞİM (INCLINATION) — {satellite.inclination}°
          </div>
          <input
            type="range"
            min={0}
            max={limits.maxInclination}
            value={satellite.inclination}
            onChange={(e) => onChange({ ...satellite, inclination: Number(e.target.value) })}
            style={{ width: "100%", accentColor: "#4ade80" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#2d6a35", marginTop: "4px" }}>
            <span>0° Ekvator</span>
            <span>{limits.maxInclination / 2}° Orta</span>
            <span>{limits.maxInclination}° Max</span>
          </div>
          <div style={{ fontSize: "9px", color: "#a3c9a8", marginTop: "8px" }}>
            {satellite.inclination < 30 && "Kapsama: Ekvator bölgesi (Afrika, G. Amerika, G.D. Asya)"}
            {satellite.inclination >= 30 && satellite.inclination < 60 && "Kapsama: Orta enlemler (Avrupa, ABD, Çin, Japonya)"}
            {satellite.inclination >= 60 && "Kapsama: Tüm enlemler dahil kutup bölgeleri"}
          </div>
        </div>

        {/* GEO Longitude */}
        {satellite.orbitType === "GEO" && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "10px" }}>
              SABİT KONUM (BOYLAM) — {satellite.geoLongitude}°
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              value={satellite.geoLongitude}
              onChange={(e) => onChange({ ...satellite, geoLongitude: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#4ade80" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#2d6a35", marginTop: "4px" }}>
              <span>-180° Batı</span>
              <span>0° Meridyen</span>
              <span>180° Doğu</span>
            </div>
          </div>
        )}

        <button
          onClick={onSave}
          style={{
            width: "100%",
            background: "rgba(74,222,128,0.15)",
            border: "1px solid #4ade80",
            color: "#4ade80",
            padding: "12px",
            borderRadius: "4px",
            fontSize: "10px",
            letterSpacing: "3px",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          ▶ KAYDET
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "none",
            border: "1px solid #1a3a1f",
            color: "#2d6a35",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "10px",
            letterSpacing: "2px",
            cursor: "pointer",
          }}
        >
          İPTAL
        </button>
      </div>
    </div>
  );
}