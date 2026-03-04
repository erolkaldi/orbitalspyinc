"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

type Props = {
  missions: Mission[];
  activeMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
};

export default function WorldMap({ missions, activeMission, onSelectMission }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      style={{ height: "100%", width: "100%", background: "#080c0a" }}
      zoomControl={false}
      worldCopyJump={false}
      maxBounds={[[-90, -180], [90, 180]]}
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
      {missions.map((m) => (
        <CircleMarker
          key={m.id}
          center={[m.region[0], m.region[1]]}
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