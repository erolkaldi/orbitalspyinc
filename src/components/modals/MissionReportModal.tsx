"use client";

import type { MissionData } from '@/types/game'

type Target = {
  name: string;
  type: string;
  status: string;
}

type ReportData = {
  summary: string;
  targets: Target[];
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
}

type Props = {
  mission: MissionData;
  report: ReportData;
  reward: number;
  onClose: () => void;
}

const THREAT_COLORS = {
  LOW: "#4ade80",
  MEDIUM: "#facc15",
  HIGH: "#f97316",
  CRITICAL: "#f87171",
}

export default function MissionReportModal({ mission, report, reward, onClose }: Props) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
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
        width: "480px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}>
        {/* Başlık */}
        <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>GİZLİ · İSTİHBARAT RAPORU</div>
        <div style={{ fontSize: "18px", color: "#4ade80", letterSpacing: "2px", marginBottom: "4px" }}>
          {mission.flag} {mission.country.toUpperCase()}
        </div>
        <div style={{ fontSize: "11px", color: "#a3c9a8", marginBottom: "24px" }}>{mission.title}</div>

        {/* Simulated Uydu Görüntüsü */}
        <div style={{
          background: "#060e07",
          border: "1px solid #1a3a1f",
          borderRadius: "4px",
          height: "140px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 30% 40%, rgba(74,222,128,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(74,222,128,0.05) 0%, transparent 40%)",
          }} />
          {/* Grid overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(45,106,53,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,53,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          {/* Scan line */}
          <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background: "rgba(74,222,128,0.4)",
            animation: "scanline 2s linear infinite",
            top: "50%",
          }} />
          <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "3px", zIndex: 1 }}>
            SAT-IMG · {mission.latitude.toFixed(2)}°N {mission.longitude.toFixed(2)}°E
          </div>
        </div>

        {/* Tehdit Seviyesi & Güven */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${THREAT_COLORS[report.threatLevel]}`,
            borderRadius: "4px",
            padding: "12px",
          }}>
            <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "2px", marginBottom: "4px" }}>TEHDİT SEVİYESİ</div>
            <div style={{ fontSize: "16px", color: THREAT_COLORS[report.threatLevel], fontWeight: "bold" }}>
              {report.threatLevel}
            </div>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid #1a3a1f",
            borderRadius: "4px",
            padding: "12px",
          }}>
            <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "2px", marginBottom: "4px" }}>GÜVEN SKORU</div>
            <div style={{ fontSize: "16px", color: "#4ade80", fontWeight: "bold" }}>{report.confidence}%</div>
          </div>
        </div>

        {/* Özet */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "8px" }}>ANALİZ ÖZETİ</div>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid #1a3a1f",
            borderRadius: "4px",
            padding: "12px",
            fontSize: "11px",
            color: "#a3c9a8",
            lineHeight: "1.6",
          }}>
            {report.summary}
          </div>
        </div>

        {/* Tespit Edilen Hedefler */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "8px" }}>
            TESPİT EDİLEN HEDEFLER [{report.targets.length}]
          </div>
          {report.targets.map((target, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid #1a3a1f",
              borderRadius: "4px",
              marginBottom: "6px",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "#c8e6c9" }}>{target.name}</div>
                <div style={{ fontSize: "9px", color: "#2d6a35", marginTop: "2px" }}>{target.type}</div>
              </div>
              <div style={{
                fontSize: "8px",
                color: target.status === "ACTIVE" ? "#4ade80" : "#facc15",
                border: `1px solid ${target.status === "ACTIVE" ? "#4ade80" : "#facc15"}`,
                padding: "2px 6px",
                borderRadius: "2px",
                letterSpacing: "1px",
              }}>
                {target.status}
              </div>
            </div>
          ))}
        </div>

        {/* Ödül */}
        <div style={{
          background: "rgba(74,222,128,0.07)",
          border: "1px solid #2d6a35",
          borderRadius: "4px",
          padding: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "2px" }}>GÖREV ÖDÜLÜ</div>
          <div style={{ fontSize: "20px", color: "#4ade80", fontWeight: "bold" }}>+${reward.toLocaleString()}</div>
        </div>

        <button
          onClick={onClose}
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
          }}
        >
          ▶ RAPORU İLET
        </button>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}