"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MissionData, SatelliteData } from "@/types/game";





type Props = {
  missions: MissionData[];
  activeMission: MissionData | null;
  onSelectMission: (mission: MissionData) => void;
  satellites: SatelliteData[];
};

const LAUNCH_PADS: Record<string, [number, number]> = {
  kennedy: [28.5721, -80.648],
  baikonur: [45.9646, 63.3052],
};

function getSatellitePosition(orbitOffset: number): [number, number] {
  const speed = 0.02;
  const angle = ((orbitOffset + Date.now() * speed) % 360) * (Math.PI / 180);
  const lat = Math.sin(angle) * 60;
  const lng = ((orbitOffset + Date.now() * speed) % 360) - 180;
  return [lat, lng];
}

const satIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 10px; height: 10px;
    background: #4ade80;
    border: 2px solid #080c0a;
    border-radius: 50%;
    box-shadow: 0 0 6px #4ade80;
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const launchIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 8px; height: 8px;
    background: #facc15;
    border: 2px solid #080c0a;
    border-radius: 2px;
    box-shadow: 0 0 6px #facc15;
  "></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

export default function WorldMap({ missions, activeMission, onSelectMission, satellites }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  return (
 <MapContainer
  center={[20, 0]}
  zoom={2}
  minZoom={2.7}
  maxZoom={6}
  style={{ height: "100%", width: "100%", background: "#080c0a" }}
  zoomControl={false}
  worldCopyJump={false}
  maxBounds={[[-85, -180], [85, 180]]}
  maxBoundsViscosity={1.0}
>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
        attribution=""
      />

      {/* Fırlatma Rampaları */}
      {Object.entries(LAUNCH_PADS).map(([key, pos]) => (
        <Marker key={key} position={pos} icon={launchIcon}>
          <Tooltip permanent={false}>
            <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
              🚀 {key === "kennedy" ? "Kennedy Space Center" : "Baikonur Cosmodrome"}
            </span>
          </Tooltip>
        </Marker>
      ))}

      {/* Uydular */}
      {satellites.map((sat) => {
        if (sat.status === "launching") {
          const pad = LAUNCH_PADS[sat.launchPad] ?? LAUNCH_PADS.kennedy;
          return (
            <Marker key={sat.id} position={pad} icon={satIcon}>
              <Tooltip>
                <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
                  ⬡ {sat.name} — FIRLATMA RAMPASINDA
                </span>
              </Tooltip>
            </Marker>
          );
        }
        const pos = getSatellitePosition(sat.orbitOffset);
        return (
          <Marker key={`${sat.id}-${tick}`} position={pos} icon={satIcon}>
            <Tooltip>
              <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
                ⬡ {sat.name} — AKTİF
              </span>
            </Tooltip>
          </Marker>
        );
      })}

      {/* Görev Noktaları */}
      {missions.map((m) => (
        <CircleMarker
          key={m.id}
          center={[m.latitude, m.longitude]}
          radius={m.urgent ? 10 : 7}
          pathOptions={{
            color: activeMission?.id === m.id ? "#4ade80" : m.urgent ? "#f87171" : "#2d6a35",
            fillColor: activeMission?.id === m.id ? "#4ade80" : m.urgent ? "#f87171" : "#2d6a35",
            fillOpacity: 0.6,
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSelectMission(m),
          }}
        >
          <Tooltip sticky>
            <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
              {m.flag} {m.country} — ${m.reward.toLocaleString()}
            </span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}