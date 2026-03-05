"use client";


type Props = {
  username: string;
  companyName: string;
  money: number;
  level: number;
  satellites: SatelliteData[];
  missions: MissionData[];
  assignments: MissionAssignment[];
}




const TIER_COLORS: Record<number, string> = {
  1: "#4ade80",
  2: "#facc15",
  3: "#f87171",
};


import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MissionData, SatelliteData, MissionAssignment } from "@/types/game";
import { TIER_LIMITS, SHOP_PRICES, SLOT_PER_LEVEL } from '@/lib/gameConfig';
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });







export default function OrbitalSpyInc({ username, companyName, money: initialMoney,
  level: initialLevel, satellites: initialSatellites, missions,
  assignments: initialAssignments }: Props) {
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [money, setMoney] = useState(initialMoney);
  const [level, setLevel] = useState(initialLevel);
  const [satellites, setSatellites] = useState(initialSatellites);
  const [selectedSat, setSelectedSat] = useState<SatelliteData | null>(null);
  const [activeTab, setActiveTab] = useState("missions");
  const [currentTime, setCurrentTime] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editCompanyName, setEditCompanyName] = useState(companyName);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showSatSelect, setShowSatSelect] = useState(false);
  const [pendingMission, setPendingMission] = useState<MissionData | null>(null);
const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const satSlots = level * SLOT_PER_LEVEL;
  useEffect(() => {
    setCurrentTime(new Date().toUTCString().slice(0, 25).toUpperCase());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(0, 25).toUpperCase());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleAccept = (mission: MissionData) => {
    setPendingMission(mission);
    setShowSatSelect(true);
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
          }}
          >
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
                    <div style={{ cursor: sat && sat.status === 'active' ? 'pointer' : 'default', fontSize: "11px", color: "#4ade80", fontWeight: "bold" }}
                      onClick={() => sat && sat.status === 'active' && setSelectedSat(sat)}
                    >{sat.name}</div>
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
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  background: "none",
                  border: "1px solid #f87171",
                  color: "#f87171",
                  padding: "6px",
                  borderRadius: "4px",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  cursor: "pointer",
                }}
              >
                ✕ İPTAL ET
              </button>
            </div>
          ) : (
            <div style={{ fontSize: "10px", color: "#1a3a1f", letterSpacing: "1px", textAlign: "center", padding: "20px 0" }}>
              — GÖREV YOK —
            </div>
          )}
        </div>

        {/* Alt buton */}
        <div style={{ padding: "16px 24px" }}>
          <button onClick={() => setShowShop(true)}
            style={{
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

      {/* Merkez — Harita + İlanlar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
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
                const assignment = assignments.find(a => a.missionId === m.id);
                const isActive = !!assignment;
                return (
                  <div
                    key={m.id}
                    onClick={() => !locked && setSelectedMission(m)}
                    style={{
                      background: isActive ? "rgba(74,222,128,0.1)" : locked ? "rgba(255,255,255,0.02)" : "rgba(74,222,128,0.05)",
                      border: `1px solid ${isActive ? "#4ade80" : locked ? "#111f14" : selectedMission?.id === m.id ? "#4ade80" : "#1a3a1f"}`,
                      borderRadius: "4px",
                      padding: "16px 20px",
                      cursor: locked || isActive ? "not-allowed" : "pointer",
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
                    {isActive && (
                      <span style={{ fontSize: "8px", color: "#4ade80", letterSpacing: "2px", border: "1px solid #4ade80", padding: "1px 5px", borderRadius: "2px" }}>
                        AKTİF
                      </span>
                    )}
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
      {selectedSat && (
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
            <div style={{ fontSize: "18px", color: "#4ade80", letterSpacing: "2px", marginBottom: "28px" }}>{selectedSat.name}</div>

            {/* Orbit Type */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "10px" }}>YÖRÜNGE TİPİ</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["LEO", "MEO", "GEO"].map((type) => {
                  const limits = TIER_LIMITS[selectedSat.tier as keyof typeof TIER_LIMITS];
                  const locked = !limits.orbitTypes.includes(type as any);
                  return (
                    <button
                      key={type}
                      onClick={() => !locked && setSelectedSat({ ...selectedSat, orbitType: type })}
                      style={{
                        flex: 1,
                        background: selectedSat.orbitType === type ? "rgba(74,222,128,0.2)" : "none",
                        border: `1px solid ${locked ? "#111f14" : selectedSat.orbitType === type ? "#4ade80" : "#1a3a1f"}`,
                        color: locked ? "#1a3a1f" : selectedSat.orbitType === type ? "#4ade80" : "#2d6a35",
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
                {selectedSat.orbitType === "LEO" && "Alçak yörünge · Hızlı · Dar kapsama"}
                {selectedSat.orbitType === "MEO" && "Orta yörünge · Dengeli kapsama"}
                {selectedSat.orbitType === "GEO" && "Sabit yörünge · Geniş kapsama · Sadece ekvator"}
              </div>
            </div>

            {/* Inclination */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "10px" }}>
                EĞİM (INCLINATION) — {selectedSat.inclination}°
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={selectedSat.inclination}
                onChange={(e) => setSelectedSat({ ...selectedSat, inclination: Number(e.target.value) })}
                style={{ width: "100%", accentColor: "#4ade80" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#2d6a35", marginTop: "4px" }}>
                <span>0° Ekvator</span>
                <span>45° Orta</span>
                <span>90° Kutup</span>
              </div>
              <div style={{ fontSize: "9px", color: "#a3c9a8", marginTop: "8px" }}>
                {selectedSat.inclination < 30 && "Kapsama: Ekvator bölgesi (Afrika, G. Amerika, G.D. Asya)"}
                {selectedSat.inclination >= 30 && selectedSat.inclination < 60 && "Kapsama: Orta enlemler (Avrupa, ABD, Çin, Japonya)"}
                {selectedSat.inclination >= 60 && "Kapsama: Tüm enlemler dahil kutup bölgeleri"}
              </div>
            </div>
            {selectedSat.orbitType === "GEO" && (
              <div style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "10px" }}>
                  SABİT KONUM (BOYLAM) — {selectedSat.geoLongitude}°
                </div>
                <input
                  type="range"
                  min={0}
                  max={TIER_LIMITS[selectedSat.tier as keyof typeof TIER_LIMITS].maxInclination}
                  value={selectedSat.inclination}
                  onChange={(e) => setSelectedSat({ ...selectedSat, inclination: Number(e.target.value) })}
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
              onClick={async () => {
                const res = await fetch("/api/satellite/update-orbit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    satelliteId: selectedSat.id,
                    inclination: selectedSat.inclination,
                    orbitType: selectedSat.orbitType,
                    geoLongitude: selectedSat.geoLongitude,
                  }),
                });
                if (res.ok) {
                  setSatellites(satellites.map(s => s.id === selectedSat.id ? selectedSat : s));
                  setSelectedSat(null);
                }
              }}
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
              onClick={() => setSelectedSat(null)}
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
      {showShop && (
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
            width: "420px",
          }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>MAĞAZA</div>
            <div style={{ fontSize: "18px", color: "#4ade80", letterSpacing: "2px", marginBottom: "8px" }}>UYDU MAĞAZASI</div>
            <div style={{ fontSize: "11px", color: "#2d6a35", marginBottom: "28px" }}>BAKİYE: ${money.toLocaleString()}</div>

            {/* Yeni Uydu */}
            <div style={{
              background: "rgba(74,222,128,0.05)",
              border: "1px solid #1a3a1f",
              borderRadius: "4px",
              padding: "16px",
              marginBottom: "12px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#a3c9a8" }}>Yeni Uydu — Tier 1</div>
                  <div style={{ fontSize: "9px", color: "#2d6a35", marginTop: "4px" }}>LEO · Max 30° inclination</div>
                </div>
                <div style={{ fontSize: "16px", color: "#4ade80" }}>${SHOP_PRICES.newSatellite.toLocaleString()}</div>
              </div>
              <button
                onClick={async () => {
                  if (money < SHOP_PRICES.newSatellite) return;
                  if (satellites.length >= level * SLOT_PER_LEVEL) return;
                  const res = await fetch("/api/shop/buy-satellite", { method: "POST" });
                  if (res.ok) window.location.reload();
                }}
                disabled={money < SHOP_PRICES.newSatellite || satellites.length >= level * SLOT_PER_LEVEL}
                style={{
                  width: "100%",
                  background: "rgba(74,222,128,0.15)",
                  border: "1px solid #4ade80",
                  color: "#4ade80",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  cursor: "pointer",
                  opacity: money < SHOP_PRICES.newSatellite || satellites.length >= level * SLOT_PER_LEVEL ? 0.4 : 1,
                }}
              >
                {satellites.length >= level * SLOT_PER_LEVEL ? "🔒 SLOT DOLU" : "▶ SATIN AL"}
              </button>
            </div>

            {/* Yükseltme */}
            {satellites.filter(s => s.tier < 3).map(sat => (
              <div key={sat.id} style={{
                background: "rgba(74,222,128,0.05)",
                border: "1px solid #1a3a1f",
                borderRadius: "4px",
                padding: "16px",
                marginBottom: "12px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#a3c9a8" }}>{sat.name} — Tier {sat.tier} → {sat.tier + 1}</div>
                    <div style={{ fontSize: "9px", color: "#2d6a35", marginTop: "4px" }}>
                      {sat.tier === 1 ? "LEO+MEO · Max 60° inclination" : "LEO+MEO+GEO · Max 90° inclination"}
                    </div>
                  </div>
                  <div style={{ fontSize: "16px", color: "#4ade80" }}>
                    ${SHOP_PRICES.upgrade[sat.tier as keyof typeof SHOP_PRICES.upgrade].toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const price = SHOP_PRICES.upgrade[sat.tier as keyof typeof SHOP_PRICES.upgrade];
                    if (money < price) return;
                    const res = await fetch("/api/shop/upgrade-satellite", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ satelliteId: sat.id }),
                    });
                    if (res.ok) window.location.reload();
                  }}
                  disabled={money < SHOP_PRICES.upgrade[sat.tier as keyof typeof SHOP_PRICES.upgrade]}
                  style={{
                    width: "100%",
                    background: "rgba(74,222,128,0.15)",
                    border: "1px solid #4ade80",
                    color: "#4ade80",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "9px",
                    letterSpacing: "2px",
                    cursor: "pointer",
                    opacity: money < SHOP_PRICES.upgrade[sat.tier as keyof typeof SHOP_PRICES.upgrade] ? 0.4 : 1,
                  }}
                >
                  ▶ YÜKSELt
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowShop(false)}
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
              KAPAT
            </button>
          </div>
        </div>
      )}
      {showSatSelect && pendingMission && (
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
              {pendingMission.flag} {pendingMission.country}
            </div>
            <div style={{ fontSize: "11px", color: "#a3c9a8", marginBottom: "24px" }}>{pendingMission.title}</div>

            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "12px" }}>UYDU SEÇ</div>

            {satellites.filter(s => s.status === 'active').length === 0 && (
              <div style={{ fontSize: "11px", color: "#f87171", marginBottom: "16px" }}>
                Aktif uydu yok. Önce bir uydu fırlat.
              </div>
            )}

            {satellites.filter(s => s.status === 'active').map(sat => {
              const isBusy = assignments.some(a => a.satelliteId === sat.id);
              return (
                <div
                  key={sat.id}
                  onClick={async () => {
                    if (isBusy) return;
                    const res = await fetch("/api/mission/start", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ missionId: pendingMission.id, satelliteId: sat.id }),
                    });
                    if (res.ok) {
                      const newAssignment = await res.json();
                      setAssignments([...assignments, newAssignment]);
                      setActiveMission(pendingMission);
                      setShowSatSelect(false);
                      setPendingMission(null);
                    }
                  }}
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
              onClick={() => { setShowSatSelect(false); setPendingMission(null); }}
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
      )}
      {showCancelConfirm && activeMission && (
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
        {activeMission.flag} {activeMission.country} — {activeMission.title}
      </div>
      <div style={{
        background: "rgba(248,113,113,0.1)",
        border: "1px solid #f87171",
        borderRadius: "4px",
        padding: "12px",
        marginBottom: "24px",
      }}>
        <div style={{ fontSize: "9px", color: "#f87171", letterSpacing: "2px", marginBottom: "4px" }}>CEZA</div>
        <div style={{ fontSize: "18px", color: "#f87171" }}>-${Math.floor(activeMission.reward / 2).toLocaleString()}</div>
      </div>

      <button
        onClick={async () => {
          const assignment = assignments.find(a => a.missionId === activeMission.id);
          if (!assignment) return;
          const res = await fetch("/api/mission/cancel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignmentId: assignment.id }),
          });
          if (res.ok) {
            const data = await res.json();
            setAssignments(assignments.filter(a => a.id !== assignment.id));
            setMoney(data.newMoney);
            setActiveMission(null);
            setShowCancelConfirm(false);
          }
        }}
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
        onClick={() => setShowCancelConfirm(false)}
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
