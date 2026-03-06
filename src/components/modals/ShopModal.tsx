"use client";

import { SHOP_PRICES, SLOT_PER_LEVEL } from '@/lib/gameConfig'
import type { SatelliteData } from '@/types/game'

type Props = {
  money: number;
  level: number;
  satellites: SatelliteData[];
  onClose: () => void;
}

export default function ShopModal({ money, level, satellites, onClose }: Props) {
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
              ▶ YÜKSELT
            </button>
          </div>
        ))}

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
          KAPAT
        </button>
      </div>
    </div>
  );
}