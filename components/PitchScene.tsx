// components/PitchScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";

import PitchMarkings from "@/components/PitchMarkings";

interface Shot {
  location: [number, number];
  player: { name: string };
  team: { name: string };
  minute: number;
  shot: { statsbomb_xg: number; outcome: { name: string } };
}

// StatsBomb pitch is 120 (x) by 80 (y). Center it around origin for the 3D scene.
function toSceneCoords(x: number, y: number): [number, number] {
  return [x - 60, y - 40]; // → roughly -60..60 on x, -40..40 on z
}

function outcomeColor(outcome: string): string {
  switch (outcome) {
    case "Goal":
      return "#FFD700"; // gold
    case "Saved":
      return "#4A90D9"; // blue
    case "Blocked":
      return "#D94A4A"; // red
    default:
      return "#999999"; // grey (off target etc.)
  }
}
function normalizeShotCoords(shot: Shot, homeTeamName: string): [number, number] {
  const [x, y] = shot.location;
  if (shot.team.name === homeTeamName) {
    return [x, y]; // home team attacks as-recorded
  }
  return [120 - x, 80 - y]; // away team mirrored to attack the opposite end
}


function ShotMarker({
  setSelectedShot,
  shot,
  homeTeamName
}: {
  setSelectedShot: (shot: Shot) => void;
  shot: Shot;
  homeTeamName: string;
}) {
  const [normX, normY] = normalizeShotCoords(shot, homeTeamName);
  const [x, z] = toSceneCoords(normX, normY);
  const color = outcomeColor(shot.shot.outcome.name);

  return (
    <mesh position={[x, 0.5, z]} onClick={() => setSelectedShot(shot)}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Add inside PitchScene, near the pitch plane
function Goal({
  position,
  rotation = [0, Math.PI / 2, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Posts */}
      <mesh position={[-3.66, 1.22, 0]}>
        <boxGeometry args={[0.15, 2.44, 0.15]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[3.66, 1.22, 0]}>
        <boxGeometry args={[0.15, 2.44, 0.15]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 2.44, 0]}>
        <boxGeometry args={[7.47, 0.15, 0.15]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

export default function PitchScene({ shots, homeTeamName }: { shots: Shot[]; homeTeamName: string }) {
  const [selected, setSelected] = useState<Shot | null>(null);
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <Canvas camera={{ position: [0, 60, 80], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />

        {/* Pitch plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[120, 80]} />
          <meshStandardMaterial color="#2d6a2d" />
        </mesh>

        {shots.map((shot, i) => (
          <ShotMarker setSelectedShot={setSelected} key={i} shot={shot} homeTeamName={homeTeamName} />
        ))}

        <OrbitControls />
        <Goal position={[60, 0, 0]} />
        <Goal position={[-60, 0, 0]} />
        <PitchMarkings />
      </Canvas>
      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "12px 16px",
          borderRadius: 8,
          fontFamily: "sans-serif",
          fontSize: 14,
        }}
      >
        <strong>Shot outcome</strong>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFD700",
            }}
          />
          Goal
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#4A90D9",
            }}
          />
          Saved
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#D94A4A",
            }}
          />
          Blocked
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#999999",
            }}
          />
          Off target / other
        </div>
      </div>
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "12px 16px",
            borderRadius: 8,
            fontFamily: "sans-serif",
          }}
        >
          <strong>{selected.player.name}</strong> ({selected.team.name})<br />
          Minute {selected.minute} — {selected.shot.outcome.name}
          <br />
          xG: {selected.shot.statsbomb_xg.toFixed(2)}
          <button onClick={() => setSelected(null)} style={{ marginLeft: 12 }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
