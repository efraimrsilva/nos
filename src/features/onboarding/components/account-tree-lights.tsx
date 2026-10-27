"use client";

import { useEffect, useState, type AnimationEvent, type CSSProperties } from "react";

type LightStyle = CSSProperties & Record<`--light-${string}`, string>;

const palettes = [
  "#edc975",
  "#c8e39e",
  "#ffe6ab",
];

function randomLight(): LightStyle {
  return {
    "--light-level": `${76 + Math.random() * 15}%`,
    "--light-left": `${20 + Math.random() * 60}%`,
    "--light-size": `${3 + Math.random() * 3}px`,
    "--light-sway": `${3 + Math.random() * 5}cqw`,
    "--light-drift": `${-12 + Math.random() * 24}cqw`,
    "--light-pulse-duration": `${2.8 + Math.random() * 1.8}s`,
    "--light-opacity": `${.65 + Math.random() * .25}`,
    "--light-color": palettes[Math.floor(Math.random() * palettes.length)],
  };
}

export function AccountTreeLights() {
  const [lights, setLights] = useState<LightStyle[]>([]);

  useEffect(() => {
    // Sorteia após a hidratação e novamente a cada passagem, sem relógio adicional.
    setLights(Array.from({ length: 5 }, randomLight));
  }, []);

  function renewLight(event: AnimationEvent<HTMLSpanElement>, index: number) {
    if (event.target !== event.currentTarget || event.animationName !== "account-light-drift") return;
    const next = randomLight();
    setLights(current => current.map((light, position) => position === index ? next : light));
  }

  return <span className="account-tree-lights" aria-hidden="true">
    {lights.map((light, index) => <span key={index} className="account-light-flight"
      style={{ ...light, "--light-delay": `${index * .45}s` } as LightStyle}
      onAnimationIteration={event => renewLight(event, index)}>
      <span className="account-light-mote" />
    </span>)}
  </span>;
}
