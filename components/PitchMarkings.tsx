// components/PitchMarkings.tsx
import { Line } from "@react-three/drei";

const LINE_COLOR = "white";
const Y = 0.02; // tiny lift above pitch plane to avoid z-fighting

function LineSegment({ points }: { points: [number, number, number][] }) {
  return <Line points={points} color={LINE_COLOR} lineWidth={2} />;
}

export default function PitchMarkings() {
  return (
    <group>
      {/* Outer boundary */}
      <LineSegment points={[
        [-60, Y, -40], [60, Y, -40], [60, Y, 40], [-60, Y, 40], [-60, Y, -40]
      ]} />

      {/* Halfway line */}
      <LineSegment points={[[0, Y, -40], [0, Y, 40]]} />

      {/* Center circle (radius ~9.15, StatsBomb units) */}
      <Line
        points={Array.from({ length: 65 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return [Math.cos(angle) * 9.15, Y, Math.sin(angle) * 9.15] as [number, number, number];
        })}
        color={LINE_COLOR}
        lineWidth={2}
      />

      {/* Left penalty box (18-yard box), width 44, depth 18 */}
      <LineSegment points={[
        [-60, Y, -22], [-42, Y, -22], [-42, Y, 22], [-60, Y, 22]
      ]} />
      {/* Left six-yard box */}
      <LineSegment points={[
        [-60, Y, -10], [-54, Y, -10], [-54, Y, 10], [-60, Y, 10]
      ]} />

      {/* Right penalty box */}
      <LineSegment points={[
        [60, Y, -22], [42, Y, -22], [42, Y, 22], [60, Y, 22]
      ]} />
      {/* Right six-yard box */}
      <LineSegment points={[
        [60, Y, -10], [54, Y, -10], [54, Y, 10], [60, Y, 10]
      ]} />
    </group>
  );
}