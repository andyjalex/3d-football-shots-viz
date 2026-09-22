// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getWorldCup2022FinalShots } from "@/lib/statsbomb";
import PitchScene from "@/components/PitchScene";


export default function Home() {
  const [shots, setShots] = useState<any[]>([]);
  const [homeTeamName, setHomeTeamName] = useState<string>("");

  useEffect(() => {
    getWorldCup2022FinalShots().then(({ shots, homeTeamName }) => {
      setShots(shots);
      setHomeTeamName(homeTeamName);
    });
  }, []);

  return <PitchScene shots={shots} homeTeamName={homeTeamName}  />;
}