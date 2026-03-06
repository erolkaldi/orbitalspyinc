"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            setError("Tüm alanları doldur.");
            return;
        }
        setLoading(true);
        setError("");

        if (isRegister) {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Bir hata oluştu.");
                setLoading(false);
                return;
            }
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Email veya şifre hatalı.");
            setLoading(false);
            return;
        }

        router.push("/");
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
                <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#2d6a35", marginBottom: "4px" }}>CLASSIFIED</div>
                <div style={{ fontSize: "20px", color: "#4ade80", letterSpacing: "2px", marginBottom: "4px" }}>ORBITAL SPY INC</div>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2d6a35", marginBottom: "32px" }}>
                    {isRegister ? "YENİ HESAP OLUŞTUR" : "GİRİŞ YAP"}
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>EMAIL</div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email adresini gir"
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
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#2d6a35", marginBottom: "8px" }}>ŞİFRE</div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=""
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
                        marginBottom: "16px",
                    }}
                >
                    {loading ? "BEKLENIYOR..." : isRegister ? "▶ KAYIT OL" : "▶ GİRİŞ YAP"}
                </button>

                <div style={{ borderTop: "1px solid #1a3a1f", paddingTop: "16px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "9px", color: "#2d6a35", letterSpacing: "2px", marginBottom: "10px", textAlign: "center" }}>
                        VEYA
                    </div>
                    <button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        style={{
                            width: "100%",
                            background: "none",
                            border: "1px solid #1a3a1f",
                            color: "#a3c9a8",
                            padding: "10px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            letterSpacing: "2px",
                            cursor: "pointer",
                            marginBottom: "8px",
                        }}
                    >
                        GitHub İLE GİRİŞ
                    </button>
                </div>

                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(""); }}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#2d6a35",
                            fontSize: "10px",
                            letterSpacing: "2px",
                            cursor: "pointer",
                        }}
                    >
                        {isRegister ? "Zaten hesabın var mı? GİRİŞ YAP" : "Hesabın yok mu? KAYIT OL"}
                    </button>
                </div>
            </div>
        </div>
    );
}