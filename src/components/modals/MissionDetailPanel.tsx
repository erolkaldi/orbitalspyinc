"use client";

import type { MissionData } from '@/types/game'

type Props = {
  mission: MissionData;
  onAccept: (mission: MissionData) => void;
  onClose: () => void;
}

export default function MissionDetailPanel({ mission, onAccept, onClose }: Props) {
  return (
    <div style={{
      width: "280px",
      minWidth: "280px",
      background: "#0d1a0f",
      borderLeft: "1px solid #1a3a1f",
      display: "flex",
      flexDirection: "column",
      padding: "24px",
    }}>
      <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "16px" }}>GÖREV DETAYI</div>

      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{mission.flag}</div>
      <div style={{ fontSize: "14px", color: "#4ade80", letterSpacing: "2px", marginBottom: "4px" }}>{mission.country.toUpperCase()}</div>
      <div style={{ fontSize: "12px", color: "#a3c9a8", lineHeight: "1.6", marginBottom: "20px" }}>{mission.title}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {[
  { label: "ÖDÜL", value: `$${mission.reward.toLocaleString()}` },
  { label: "TİP", value: mission.type.toUpperCase() },
  { label: "SÜRE", value: `${mission.duration} saat` },
  { label: "GEREKLİ TİER", value: `T${mission.tier}` },
  { label: "ÖNCELİK", value: mission.urgent ? "ACİL" : "NORMAL" },
].map(({ label, value }) => (
          <div key={label} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #1a3a1f",
          }}>
            <span style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "2px" }}>{label}</span>
            <span style={{ fontSize: "11px", color: "#4ade80" }}>{value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onAccept(mission)}
        style={{
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
        ▶ GÖREVİ KABUL ET
      </button>
      <button
        onClick={onClose}
        style={{
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
  );
}