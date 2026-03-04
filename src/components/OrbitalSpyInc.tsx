"use client";
type Mission = {
  id: number;
  country: string;
  flag: string;
  title: string;
  reward: number;
  tier: number;
  urgent: boolean;
  region: number[];
};

type Satellite = {
  id: number;
  name: string;
  tier: number;
  status: string;
  coverage: string;
};

const TIER_COLORS: Record<number, string> = {
  1: "#4ade80",
  2: "#facc15",
  3: "#f87171",
};

import { useState,useEffect } from "react";
import dynamic from "next/dynamic";
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

const satellites = [
  { id: 1, name: "SAT-01", tier: 1, status: "active", coverage: "EUR" },
];

const missions = [
  { id: 1, country: "Almanya", flag: "🇩🇪", title: "Doğu sınırı askeri hareket izleme", reward: 4200, tier: 1, urgent: true, region: [52, 13] },
  { id: 2, country: "Japonya", flag: "🇯🇵", title: "Nükleer tesis inşaat raporu", reward: 8800, tier: 2, urgent: false, region: [35, 139] },
  { id: 3, country: "Brezilya", flag: "🇧🇷", title: "Amazon kaynak tespiti", reward: 3100, tier: 1, urgent: false, region: [-15, -47] },
  { id: 4, country: "Hindistan", flag: "🇮🇳", title: "Kuzey sınırı hava sahası analizi", reward: 5500, tier: 2, urgent: true, region: [28, 77] },
  { id: 5, country: "Norveç", flag: "🇳🇴", title: "Arktik buz örtüsü değişim raporu", reward: 2900, tier: 1, urgent: false, region: [60, 8] },
];



export default function OrbitalSpyInc() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [money, setMoney] = useState(12450);
  const [level, setLevel] = useState(1);
  const [satSlots] = useState(2);
  const [activeTab, setActiveTab] = useState("missions");
const [currentTime, setCurrentTime] = useState("");

useEffect(() => {
  setCurrentTime(new Date().toUTCString().slice(0, 25).toUpperCase());
  const interval = setInterval(() => {
    setCurrentTime(new Date().toUTCString().slice(0, 25).toUpperCase());
  }, 1000);
  return () => clearInterval(interval);
}, []);
  const handleAccept = (mission:Mission) => {
    setActiveMission(mission);
    setSelectedMission(null);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#080c0a",
      fontFamily: "'Courier New', monospace",
      color: "#a3c9a8",
      overflow: "hidden",
    }}>
      {/* SOL PANEL */}
      <div style={{
        width: "320px",
        minWidth: "320px",
        background: "linear-gradient(180deg, #0d1a0f 0%, #080c0a 100%)",
        borderRight: "1px solid #1a3a1f",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #1a3a1f",
          background: "rgba(0,255,80,0.03)",
        }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "4px" }}>CLASSIFIED</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "2px", color: "#4ade80" }}>ORBITAL SPY INC</div>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginTop: "2px" }}>GLOBAL INTELLIGENCE SOLUTIONS</div>
        </div>

        {/* Oyuncu Stats */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid #1a3a1f",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}>
          <div style={{ background: "rgba(0,255,80,0.05)", border: "1px solid #1a3a1f", padding: "10px", borderRadius: "4px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "4px" }}>BAKIYE</div>
            <div style={{ fontSize: "16px", color: "#4ade80", fontWeight: "bold" }}>${money.toLocaleString()}</div>
          </div>
          <div style={{ background: "rgba(0,255,80,0.05)", border: "1px solid #1a3a1f", padding: "10px", borderRadius: "4px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "4px" }}>SEVİYE</div>
            <div style={{ fontSize: "16px", color: "#4ade80", fontWeight: "bold" }}>LVL {level}</div>
          </div>
        </div>

        {/* Uydu Slotları */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #1a3a1f" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "12px" }}>UYDU SLOTLARI [{satellites.length}/{satSlots}]</div>
          {Array.from({ length: satSlots }).map((_, i) => {
            const sat = satellites[i];
            return (
              <div key={i} style={{
                background: sat ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${sat ? "#2d6a35" : "#1a2a1f"}`,
                borderRadius: "4px",
                padding: "10px 12px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <div style={{
                  width: "28px", height: "28px",
                  border: `2px solid ${sat ? "#4ade80" : "#1a3a1f"}`,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                  color: sat ? "#4ade80" : "#1a3a1f",
                }}>⬡</div>
                {sat ? (
                  <div>
                    <div style={{ fontSize: "11px", color: "#4ade80", fontWeight: "bold" }}>{sat.name}</div>
                    <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "1px" }}>TİER {sat.tier} · AKTİF</div>
                  </div>
                ) : (
                  <div style={{ fontSize: "10px", color: "#1a3a1f", letterSpacing: "1px" }}>BOŞ SLOT</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aktif Görev */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #1a3a1f", flex: 1 }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "12px" }}>AKTİF GÖREV</div>
          {activeMission ? (
            <div style={{
              background: "rgba(74,222,128,0.07)",
              border: "1px solid #2d6a35",
              borderRadius: "4px",
              padding: "12px",
            }}>
              <div style={{ fontSize: "10px", color: "#4ade80", marginBottom: "6px" }}>{activeMission.flag} {activeMission.country}</div>
              <div style={{ fontSize: "11px", color: "#a3c9a8", lineHeight: "1.4", marginBottom: "10px" }}>{activeMission.title}</div>
              <div style={{
                background: "#0d1a0f",
                height: "4px",
                borderRadius: "2px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: "45%",
                  background: "linear-gradient(90deg, #2d6a35, #4ade80)",
                  animation: "pulse 2s infinite",
                }} />
              </div>
              <div style={{ fontSize: "9px", color: "#2d6a35", marginTop: "6px", letterSpacing: "1px" }}>TARAMA DEVAM EDİYOR...</div>
            </div>
          ) : (
            <div style={{ fontSize: "10px", color: "#1a3a1f", letterSpacing: "1px", textAlign: "center", padding: "20px 0" }}>
              — GÖREV YOK —
            </div>
          )}
        </div>

        {/* Alt buton */}
        <div style={{ padding: "16px 24px" }}>
          <button style={{
            width: "100%",
            background: "rgba(74,222,128,0.1)",
            border: "1px solid #2d6a35",
            color: "#4ade80",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "10px",
            letterSpacing: "2px",
            cursor: "pointer",
          }}>
            ⬡ UYDU MAĞAZASI
          </button>
        </div>
      </div>

      {/* MERKEZ — Harita + İlanlar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Üst Bar */}
        <div style={{
          height: "48px",
          background: "#0d1a0f",
          borderBottom: "1px solid #1a3a1f",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "24px",
        }}>
          {["missions", "map"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab ? "#4ade80" : "#2d6a35",
                fontSize: "10px",
                letterSpacing: "3px",
                cursor: "pointer",
                padding: "4px 0",
                borderBottom: activeTab === tab ? "1px solid #4ade80" : "1px solid transparent",
                textTransform: "uppercase",
              }}
            >
              {tab === "missions" ? "İSTİHBARAT İLANLARI" : "DÜNYA HARİTASI"}
            </button>
          ))}
          <div style={{ marginLeft: "auto", fontSize: "9px", color: "#2d6a35", letterSpacing: "2px" }}>
            {currentTime} UTC
          </div>
        </div>

        {/* İçerik */}
        {activeTab === "missions" ? (
          <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "16px" }}>
              {missions.length} İLAN MEVCUT · TİER {level} KAPASİTE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {missions.map((m) => {
                const locked = m.tier > level;
                return (
                  <div
                    key={m.id}
                    onClick={() => !locked && setSelectedMission(m)}
                    style={{
                      background: locked ? "rgba(255,255,255,0.02)" : "rgba(74,222,128,0.05)",
                      border: `1px solid ${locked ? "#111f14" : selectedMission?.id === m.id ? "#4ade80" : "#1a3a1f"}`,
                      borderRadius: "4px",
                      padding: "16px 20px",
                      cursor: locked ? "not-allowed" : "pointer",
                      opacity: locked ? 0.4 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "24px" }}>{m.flag}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", color: "#a3c9a8", letterSpacing: "1px" }}>{m.country.toUpperCase()}</span>
                        {m.urgent && <span style={{ fontSize: "8px", color: "#f87171", letterSpacing: "2px", border: "1px solid #f87171", padding: "1px 5px", borderRadius: "2px" }}>ACİL</span>}
                        <span style={{ fontSize: "8px", letterSpacing: "1px", color: TIER_COLORS[m.tier], border: `1px solid ${TIER_COLORS[m.tier]}`, padding: "1px 5px", borderRadius: "2px" }}>T{m.tier}</span>
                        {locked && <span style={{ fontSize: "8px", color: "#2d6a35", letterSpacing: "2px" }}>🔒 KİLİTLİ</span>}
                      </div>
                      <div style={{ fontSize: "13px", color: locked ? "#2d6a35" : "#c8e6c9" }}>{m.title}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", color: "#4ade80", fontWeight: "bold" }}>${m.reward.toLocaleString()}</div>
                      <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "1px" }}>ÖDÜL</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
         <div style={{ flex: 1, overflow: "hidden", height: "calc(100vh - 48px)" }}>
  <WorldMap
    missions={missions}
    activeMission={activeMission}
    onSelectMission={setSelectedMission}
  />
</div>
        )}
      </div>

      {/* SAĞ PANEL — Görev Detayı */}
      {selectedMission && (
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
          
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>{selectedMission.flag}</div>
          <div style={{ fontSize: "14px", color: "#4ade80", letterSpacing: "2px", marginBottom: "4px" }}>{selectedMission.country.toUpperCase()}</div>
          <div style={{ fontSize: "12px", color: "#a3c9a8", lineHeight: "1.6", marginBottom: "20px" }}>{selectedMission.title}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {[
              { label: "ÖDÜL", value: `$${selectedMission.reward.toLocaleString()}` },
              { label: "GEREKLİ TİER", value: `T${selectedMission.tier}` },
              { label: "ÖNCELİK", value: selectedMission.urgent ? "ACİL" : "NORMAL" },
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
            onClick={() => handleAccept(selectedMission)}
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
            onClick={() => setSelectedMission(null)}
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
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c0a; }
        ::-webkit-scrollbar-thumb { background: #1a3a1f; border-radius: 2px; }
      `}</style>
    </div>
  );
}
