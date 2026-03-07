"use client";


type Props = {
  username: string;
  companyName: string;
  money: number;
  level: number;
  satellites: SatelliteData[];
  missions: MissionData[];
  assignments: MissionAssignment[];
  gameDate: Date;
}




const TIER_COLORS: Record<number, string> = {
  1: "#4ade80",
  2: "#facc15",
  3: "#f87171",
};


import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MissionData, SatelliteData, MissionAssignment } from "@/types/game";
import { SLOT_PER_LEVEL } from '@/lib/gameConfig';
import EditProfileModal from '@/components/modals/EditProfileModal'
import ShopModal from '@/components/modals/ShopModal'
import OrbitModal from '@/components/modals/OrbitModal'
import SatSelectModal from '@/components/modals/SatSelectModal'
import CancelConfirmModal from '@/components/modals/CancelConfirmModal'
import MissionDetailPanel from "./modals/MissionDetailPanel";
import { advanceGameDate, formatGameDate } from '@/lib/gameTime';
import MissionReportModal from '@/components/modals/MissionReportModal';
import { useRouter } from 'next/navigation';
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });







export default function OrbitalSpyInc({ username, companyName, money: initialMoney,
  level: initialLevel, satellites: initialSatellites, missions,
  assignments: initialAssignments, gameDate: initialGameDate }: Props) {
  const [gameDate, setGameDate] = useState(new Date(initialGameDate));
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
  const [activeMission, setActiveMission] = useState<MissionData | null>(
    missions.find(m => initialAssignments.some(a => a.missionId === m.id)) ?? null
  );
  const router = useRouter();
  const [missionReport, setMissionReport] = useState<{ report: any; reward: number; mission: MissionData } | null>(null);
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
  const [timeLeft, setTimeLeft] = useState<string>("");


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
  useEffect(() => {
    const activeAssignment = assignments.find(a => a.missionId === activeMission?.id);
    if (!activeAssignment?.endsAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(activeAssignment.endsAt!);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("TAMAMLANDI");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMission, assignments]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newDate = advanceGameDate(gameDate, 2);
      setGameDate(newDate);

      await fetch("/api/game/sync-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameDate: newDate.toISOString() }),
      });
    }, 2 * 60 * 1000); // 2 gerçek dakika

    return () => clearInterval(interval);
  }, [gameDate]);
  useEffect(() => {
    const handleBeforeUnload = () => {
      navigator.sendBeacon("/api/game/sync-time", JSON.stringify({ gameDate: gameDate.toISOString() }));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [gameDate]);
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
                marginBottom: "6px",
              }}>
                <div style={{
                  height: "100%",
                  width: timeLeft === "TAMAMLANDI" ? "100%" : "45%",
                  background: "linear-gradient(90deg, #2d6a35, #4ade80)",
                  animation: timeLeft === "TAMAMLANDI" ? "none" : "pulse 2s infinite",
                }} />
              </div>

              <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "1px", marginBottom: "10px" }}>
                {timeLeft === "TAMAMLANDI" ? "✓ GÖREV TAMAMLANDI" : `⏱ ${timeLeft} kaldı`}
              </div>

              {timeLeft === "TAMAMLANDI" && (
                <button
                  onClick={async () => {
                    const assignment = assignments.find(a => a.missionId === activeMission.id);
                    if (!assignment) return;
                    const res = await fetch("/api/mission/complete", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ assignmentId: assignment.id }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setMoney(data.newMoney);
                      setAssignments(assignments.filter(a => a.id !== assignment.id));
                      setMissionReport({ report: data.report, reward: data.reward, mission: activeMission });
                      setActiveMission(null);
                      setTimeLeft("");
                    }
                  }}
                  style={{
                    width: "100%",
                    background: "rgba(74,222,128,0.15)",
                    border: "1px solid #4ade80",
                    color: "#4ade80",
                    padding: "6px",
                    borderRadius: "4px",
                    fontSize: "9px",
                    letterSpacing: "2px",
                    cursor: "pointer",
                    marginBottom: "8px",
                  }}
                >
                  ▶ ÖDÜLÜ AL
                </button>
              )}

              {timeLeft!="TAMAMLANDI" && (<button
                onClick={() => setShowCancelConfirm(true)}
                style={{
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
              </button>)}
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
            {formatGameDate(gameDate)}
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
                    onClick={() => !locked && !isActive && setSelectedMission(m)}
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
                        <span style={{ fontSize: "12px", color: "#2d6a35", letterSpacing: "1px" }}>{m.type.toUpperCase()}</span>
                        <span style={{ fontSize: "12px", color: "#2d6a35", letterSpacing: "1px" }}>⏱ {m.duration}sa</span>
                        {locked && <span style={{ fontSize: "8px", color: "#2d6a35", letterSpacing: "2px" }}>🔒 KİLİTLİ</span>}
                        {isActive && <span style={{ fontSize: "8px", color: "#4ade80", letterSpacing: "2px", border: "1px solid #4ade80", padding: "1px 5px", borderRadius: "2px" }}>AKTİF</span>}
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
      {showEdit && (
        <EditProfileModal
          editUsername={editUsername}
          editCompanyName={editCompanyName}
          editError={editError}
          editLoading={editLoading}
          onUsernameChange={setEditUsername}
          onCompanyNameChange={setEditCompanyName}
          onSave={handleEdit}
          onClose={() => { setShowEdit(false); setEditError(""); }}
        />
      )}

      {showShop && (
        <ShopModal
          money={money}
          level={level}
          satellites={satellites}
          onClose={() => setShowShop(false)}
        />
      )}

      {selectedSat && (
        <OrbitModal
          satellite={selectedSat}
          onChange={setSelectedSat}
          onSave={async () => {
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
          onClose={() => setSelectedSat(null)}
        />
      )}

      {showSatSelect && pendingMission && (
        <SatSelectModal
          mission={pendingMission}
          satellites={satellites}
          assignments={assignments}
          onSelect={async (satelliteId) => {
            const res = await fetch("/api/mission/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ missionId: pendingMission.id, satelliteId }),
            });
            if (res.ok) {
              const newAssignment = await res.json();
              setAssignments([...assignments, newAssignment]);
              setActiveMission(pendingMission);
              setShowSatSelect(false);
              setPendingMission(null);
            }
          }}
          onClose={() => { setShowSatSelect(false); setPendingMission(null); }}
        />
      )}

      {showCancelConfirm && activeMission && (
        <CancelConfirmModal
          mission={activeMission}
          onConfirm={async () => {
            const assignment = assignments.find(a => a.missionId === activeMission.id);
            if (!assignment) return;
            const res = await fetch("/api/mission/cancel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ assignmentId: assignment.id }),
            });
            if (res.ok) {
              const data = await res.json();
              setMoney(data.newMoney);
              setActiveMission(null);
              setShowCancelConfirm(false);
            }
          }}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
      {selectedMission && (
        <MissionDetailPanel
          mission={selectedMission}
          onAccept={handleAccept}
          onClose={() => setSelectedMission(null)}
        />
      )}
      {missionReport && (
        <MissionReportModal
          mission={missionReport.mission}
          report={missionReport.report}
          reward={missionReport.reward}
          onClose={() => {
            setAssignments(assignments.filter(a => a.missionId !== missionReport.mission.id));
            setMissionReport(null);
            router.refresh();
          }}
        />
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
