type VisualInterval = { id: string; start: number; end: number };
type Lane = { lane: number; total: number };

// Recebe intervalos em pixels, incluindo a altura mínima real dos cartões.
// Grupos conectados usam a mesma largura, mesmo se a faixa for reutilizada.
export function calendarEventLanes(intervals: VisualInterval[]): Map<string, Lane> {
  const result = new Map<string, Lane>();
  const sorted = [...intervals].sort((a, b) => a.start - b.start || a.end - b.end || a.id.localeCompare(b.id));
  let group: { id: string; lane: number }[] = [];
  let laneEnds: number[] = [];
  let groupEnd = -Infinity;
  function finishGroup() {
    for (const item of group) result.set(item.id, { lane: item.lane, total: laneEnds.length });
    group = [];
    laneEnds = [];
  }
  for (const interval of sorted) {
    if (interval.start >= groupEnd) finishGroup();
    let lane = laneEnds.findIndex(end => end <= interval.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = interval.end;
    group.push({ id: interval.id, lane });
    groupEnd = group.length === 1 ? interval.end : Math.max(groupEnd, interval.end);
  }
  finishGroup();
  return result;
}
