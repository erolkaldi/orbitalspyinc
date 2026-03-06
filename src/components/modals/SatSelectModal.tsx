"use client";

import type { MissionData, SatelliteData, MissionAssignment } from '@/types/game'

type Props = {
  mission: MissionData;
  satellites: SatelliteData[];
  assignments: MissionAssignment[];
  onSelect: (satelliteId: string) => void;
  onClose: () => void;
}

export default function SatSelectModal({ mission, satellites, assignments, onSelect, onClose }: Props) {
  const activeSats = satellites.filter(s => s.status === 'active');

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
        <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>GÖREV BAŞLAT</div>
        <div style={{ fontSize: "16px", color: "#4ade80", letterSpacing: "2px", marginBottom: "4px" }}>
          {mission.flag} {mission.country}
        </div>
        <div style={{ fontSize: "11px", color: "#a3c9a8", marginBottom: "24px" }}>{mission.title}</div>

        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "12px" }}>UYDU SEÇ</div>

        {activeSats.length === 0 && (
          <div style={{ fontSize: "11px", color: "#f87171", marginBottom: "16px" }}>
            Aktif uydu yok. Önce bir uydu fırlat.
          </div>
        )}

        {activeSats.map(sat => {
          const isBusy = assignments.some(a => a.satelliteId === sat.id);
          return (
            <div
              key={sat.id}
              onClick={() => !isBusy && onSelect(sat.id)}
              style={{
                background: isBusy ? "rgba(255,255,255,0.02)" : "rgba(74,222,128,0.07)",
                border: `1px solid ${isBusy ? "#111f14" : "#2d6a35"}`,
                borderRadius: "4px",
                padding: "12px 16px",
                marginBottom: "8px",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: isBusy ? 0.4 : 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", color: "#4ade80" }}>⬡ {sat.name}</div>
                <div style={{ fontSize: "9px", color: "#2d6a35", marginTop: "2px" }}>
                  TİER {sat.tier} · {sat.orbitType} · {sat.inclination}°
                </div>
              </div>
              {isBusy && <span style={{ fontSize: "9px", color: "#f87171", letterSpacing: "1px" }}>MEŞGUL</span>}
            </div>
          );
        })}

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
            marginTop: "8px",
          }}
        >
          İPTAL
        </button>
      </div>
    </div>
  );
}