"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!username.trim() || !companyName.trim()) {
            setError("Tüm alanları doldur.");
            return;
        }
        setLoading(true);
        const res = await fetch("/api/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, companyName }),
        });
        if (res.ok) {
            router.push("/");
        } else {
            const data = await res.json();
            setError(data.message || "Bir hata oluştu.");
        }
        setLoading(false);
    };

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            background: "#080c0a",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Courier New', monospace",
            color: "#a3c9a8",
        }}>
            <div style={{
                background: "#0d1a0f",
                border: "1px solid #1a3a1f",
                borderRadius: "6px",
                padding: "48px",
                width: "400px",
            }}>
                <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "8px" }}>KAYIT</div>
                <div style={{ fontSize: "20px", color: "#4ade80", letterSpacing: "2px", marginBottom: "32px" }}>
                    ŞİRKETİNİ KUR
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>KULLANICI ADI</div>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="agent_zero"
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

                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>ŞİRKET ADI</div>
                    <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Dark Horizon Intelligence"
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

                {error && (
                    <div style={{ fontSize: "11px", color: "#f87171", marginBottom: "16px" }}>{error}</div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "rgba(74,222,128,0.15)",
                        border: "1px solid #4ade80",
                        color: "#4ade80",
                        padding: "12px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        letterSpacing: "3px",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading ? "KAYDEDILIYOR..." : "▶ BAŞLA"}
                </button>
            </div>
        </div>
    );
}