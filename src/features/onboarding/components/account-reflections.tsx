"use client";

import { Heart, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { reflectionPhrases } from "@/features/onboarding/reflection-phrases";

const DISPLAY_DURATION = 10_000;

function shufflePhrases(previous?: string) {
  const order = [...reflectionPhrases];
  // Fisher–Yates visita todas as posições, sem repetir ou descartar frases no ciclo.
  for (let index = order.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [order[index], order[target]] = [order[target], order[index]];
  }
  if (order.length > 1 && order[0] === previous) {
    [order[0], order[1]] = [order[1], order[0]];
  }
  return order;
}

export function AccountReflections() {
  const [deck, setDeck] = useState<{ order: string[]; index: number; phase: number }>({ order: [], index: 0, phase: 0 });
  const [paused, setPaused] = useState(false);
  const remaining = useRef(DISPLAY_DURATION);

  useEffect(() => {
    // Sorteia só no navegador: cada montagem tem sua ordem, sem divergência de hidratação.
    setDeck({ order: shufflePhrases(), index: 0, phase: 0 });
  }, []);

  useEffect(() => {
    if (paused || deck.order.length === 0) return;
    const started = performance.now();
    let completed = false;
    const timer = window.setTimeout(() => {
      completed = true;
      remaining.current = DISPLAY_DURATION;
      const finished = deck.index === deck.order.length - 1;
      const phase = (deck.phase + 1) % 3;
      // Ao completar a lista, inicia outro sorteio sem repetir a frase na fronteira dos ciclos.
      setDeck(finished
        ? { order: shufflePhrases(deck.order[deck.index]), index: 0, phase }
        : { order: deck.order, index: deck.index + 1, phase });
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      // Pausa o relógio junto da animação; retomar preserva o tempo que ainda faltava.
      if (!completed) remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [deck, paused]);

  const phrase = deck.order[deck.index] ?? reflectionPhrases[0];
  return (
    <section aria-label="Uma reflexão para começar" className="account-reflections" data-paused={paused}>
      <div className="public-story-mark">
        <span className="color-icon"><Heart size={24} aria-hidden="true" /></span>
        {/* Uma única frase no documento; sem anúncios automáticos que interrompam o formulário. */}
        <span key={phrase} data-reflection-phrase className="reflection-phrase" aria-live="off">{phrase}</span>
      </div>
      <div className="reflection-track" data-phase={deck.phase} aria-hidden="true">
        <span key={`${deck.order.length}:${deck.index}:${phrase}`} className="reflection-progress" />
      </div>
      {phrase && <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar frases" : "Pausar frases"} className="reflection-pause mx-auto mt-1 flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-[11px] text-muted hover:text-leaf">
        {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
        {paused ? "Retomar" : "Pausar"}
      </button>}
    </section>
  );
}
