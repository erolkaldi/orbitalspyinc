"use client";


type Props = {
  username: string;
  companyName: string;
  money: number;
  level: number;
  satellites: SatelliteData[];
  missions: MissionData[];
}




const TIER_COLORS: Record<number, string> = {
  1: "#4ade80",
  2: "#facc15",
  3: "#f87171",
};

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MissionData, SatelliteData } from "@/types/game";
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });







export default function OrbitalSpyInc({ username, companyName, money: initialMoney, level: initialLevel, 
  satellites: initialSatellites, missions }: Props) {
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [money, setMoney] = useState(initialMoney);
  const [level, setLevel] = useState(initialLevel);
  const [satellites, setSatellites] = useState(initialSatellites);
  const [satSlots] = useState(2);
  const [activeTab, setActiveTab] = useState("missions");
  const [currentTime, setCurrentTime] = useState("");
const [showEdit, setShowEdit] = useState(false);
const [editUsername, setEditUsername] = useState(username);
const [editCompanyName, setEditCompanyName] = useState(companyName);
const [editError, setEditError] = useState("");
const [editLoading, setEditLoading] = useState(false);
  useEffect(() => {
    setCurrentTime(new Date().toUTCString().slice(0, 25).toUpperCase());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(0, 25).toUpperCase());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleAccept = (mission: MissionData) => {
    setActiveMission(mission);
    setSelectedMission(null);
  };
const handleEdit = async () => {
  if (!editUsername.trim() || !editCompanyName.trim()) {
    setEditError("Tüm alanları doldur.");
    return;
  }
  setEditLoading(true);
  const res = await fetch("/api/user/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: editUsername, companyName: editCompanyName }),
  });
  if (res.ok) {
    window.location.reload();
  } else {
    const data = await res.json();
    setEditError(data.message || "Bir hata oluştu.");
  }
  setEditLoading(false);
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
          <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "2px", color: "#4ade80" }}>{companyName.toUpperCase()}</div>
          <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#a3c9a8", marginTop: "2px" }}>CMD: {username}</div>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
  <button
    onClick={() => setShowEdit(true)}
    style={{
      flex: 1,
      background: "none",
      border: "1px solid #1a3a1f",
      color: "#2d6a35",
      padding: "4px 10px",
      borderRadius: "3px",
      fontSize: "9px",
      letterSpacing: "2px",
      cursor: "pointer",
    }}
  >
    DÜZENLE
  </button>
  <button
    onClick={() => window.location.href = '/api/auth/signout'}
    style={{
      flex: 1,
      background: "none",
      border: "1px solid #1a3a1f",
      color: "#2d6a35",
      padding: "4px 10px",
      borderRadius: "3px",
      fontSize: "9px",
      letterSpacing: "2px",
      cursor: "pointer",
    }}
  >
    ÇIKIŞ
  </button>
</div>
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
        {satellites.length === 0 && (
          <div style={{
            background: "rgba(74,222,128,0.05)",
            border: "1px dashed #2d6a35",
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "8px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "10px", color: "#a3c9a8", marginBottom: "8px", lineHeight: "1.5" }}>
              🛰️ İlk uydun bizden hediye!
            </div>
            <button
              onClick={async () => {
                const res = await fetch("/api/satellite/claim-starter", { method: "POST" });
                if (res.ok) window.location.reload();
              }}
              style={{
                background: "rgba(74,222,128,0.15)",
                border: "1px solid #4ade80",
                color: "#4ade80",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "9px",
                letterSpacing: "2px",
                cursor: "pointer",
              }}
            >
              ▶ AL
            </button>
          </div>
        )}
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
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: "11px", color: "#4ade80", fontWeight: "bold" }}>{sat.name}</div>
    <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "1px" }}>
      TİER {sat.tier} · {sat.status === "launching"
        ? `🚀 ${sat.launchPad === "kennedy" ? "KENNEDY" : "BAIKONUR"}`
        : "AKTİF"}
    </div>
    {sat.status === "launching" && (
      <button
        onClick={async () => {
          const res = await fetch("/api/satellite/launch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ satelliteId: sat.id }),
          });
          if (res.ok) window.location.reload();
        }}
        style={{
          marginTop: "6px",
          background: "rgba(74,222,128,0.15)",
          border: "1px solid #4ade80",
          color: "#4ade80",
          padding: "3px 8px",
          borderRadius: "3px",
          fontSize: "8px",
          letterSpacing: "2px",
          cursor: "pointer",
        }}
      >
        ▶ FIRlat
      </button>
    )}
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
              satellites={satellites}
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
{showEdit && (
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
      <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>AYARLAR</div>
      <div style={{ fontSize: "18px", color: "#4ade80", letterSpacing: "2px", marginBottom: "28px" }}>PROFİLİ DÜZENLE</div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>KULLANICI ADI</div>
        <input
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(74,222,128,0.05)",
            border: "1px solid #1a3a1f",
            borderRadius: "4px",
            padding: "10px 12px",
            color: "#4ade80",
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>ŞİRKET ADI</div>
        <input
          value={editCompanyName}
          onChange={(e) => setEditCompanyName(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(74,222,128,0.05)",
            border: "1px solid #1a3a1f",
            borderRadius: "4px",
            padding: "10px 12px",
            color: "#4ade80",
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {editError && (
        <div style={{ fontSize: "11px", color: "#f87171", marginBottom: "16px" }}>{editError}</div>
      )}

      <button
        onClick={handleEdit}
        disabled={editLoading}
        style={{
          width: "100%",
          background: "rgba(74,222,128,0.15)",
          border: "1px solid #4ade80",
          color: "#4ade80",
          padding: "12px",
          borderRadius: "4px",
          fontSize: "10px",
          letterSpacing: "3px",
          cursor: editLoading ? "not-allowed" : "pointer",
          opacity: editLoading ? 0.6 : 1,
          marginBottom: "8px",
        }}
      >
        {editLoading ? "KAYDEDİLİYOR..." : "▶ KAYDET"}
      </button>
      <button
        onClick={() => { setShowEdit(false); setEditError(""); }}
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
