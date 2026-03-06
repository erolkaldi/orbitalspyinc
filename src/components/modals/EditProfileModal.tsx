"use client";

type Props = {
  editUsername: string;
  editCompanyName: string;
  editError: string;
  editLoading: boolean;
  onUsernameChange: (v: string) => void;
  onCompanyNameChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function EditProfileModal({
  editUsername,
  editCompanyName,
  editError,
  editLoading,
  onUsernameChange,
  onCompanyNameChange,
  onSave,
  onClose,
}: Props) {
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
        <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>AYARLAR</div>
        <div style={{ fontSize: "18px", color: "#4ade80", letterSpacing: "2px", marginBottom: "28px" }}>PROFİLİ DÜZENLE</div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>KULLANICI ADI</div>
          <input
            value={editUsername}
            onChange={(e) => onUsernameChange(e.target.value)}
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
            onChange={(e) => onCompanyNameChange(e.target.value)}
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
          onClick={onSave}
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