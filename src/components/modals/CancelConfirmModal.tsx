"use client";

import type { MissionData } from '@/types/game'

type Props = {
  mission: MissionData;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelConfirmModal({ mission, onConfirm, onClose }: Props) {
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
        width: "360px",
      }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#f87171", marginBottom: "8px" }}>UYARI</div>
        <div style={{ fontSize: "16px", color: "#4ade80", letterSpacing: "2px", marginBottom: "16px" }}>GÖREVİ İPTAL ET</div>
        <div style={{ fontSize: "11px", color: "#a3c9a8", lineHeight: "1.6", marginBottom: "8px" }}>
          {mission.flag} {mission.country} — {mission.title}
        </div>
        <div style={{
          background: "rgba(248,113,113,0.1)",
          border: "1px solid #f87171",
          borderRadius: "4px",
          padding: "12px",
          marginBottom: "24px",
        }}>
          <div style={{ fontSize: "9px", color: "#f87171", letterSpacing: "2px", marginBottom: "4px" }}>CEZA</div>
          <div style={{ fontSize: "18px", color: "#f87171" }}>-${Math.floor(mission.reward / 2).toLocaleString()}</div>
        </div>

        <button
          onClick={onConfirm}
          style={{
            width: "100%",
            background: "rgba(248,113,113,0.15)",
            border: "1px solid #f87171",
            color: "#f87171",
            padding: "12px",
            borderRadius: "4px",
            fontSize: "10px",
            letterSpacing: "3px",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          ✕ İPTAL ET
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
          GERİ DÖN
        </button>
      </div>
    </div>
  );
}