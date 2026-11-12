// Grafico cartesiano interattivo in SVG, con parametri regolabili tramite slider.
import { useMemo, useState } from 'react';
import type { P, PlotParam, Shape } from '../lib/types';
import { Md } from './ui';

const W = 340;
const H = 260;
const COLORS = ['var(--plot-1)', 'var(--plot-2)', 'var(--plot-3)', 'var(--plot-4)'];

function niceStep(range: number): number {
  const raw = range / 8;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * pow;
}

function ticks(a: number, b: number, s: number): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(Math.abs(v) < 1e-9 ? 0 : v);
  return out;
}

const fmt = (v: number) => `${Math.round(v * 100) / 100}`.replace('.', ',');

interface Props {
  view: [number, number, number, number];
  params?: PlotParam[];
  draw: (p: P) => Shape[];
  readout?: (p: P) => string;
}

export function Plot({ view, params = [], draw, readout }: Props) {
  const [vals, setVals] = useState<P>(() => Object.fromEntries(params.map((p) => [p.name, p.value])));
  const [x0, x1, y0, y1] = view;
  const sx = (x: number) => ((x - x0) / (x1 - x0)) * W;
  const sy = (y: number) => H - ((y - y0) / (y1 - y0)) * H;

  const shapes = useMemo(() => {
    try {
      return draw(vals);
    } catch {
      return [];
    }
  }, [draw, vals]);

  /** Costruisce il tracciato di una curva spezzandolo dove non è definita o ha un salto. */
  const path = (pts: [number, number][]) => {
    let d = '';
    let pen = false;
    let prevY = 0;
    const span = y1 - y0;
    for (const [x, y] of pts) {
      const ok = Number.isFinite(x) && Number.isFinite(y) && y > y0 - span * 2 && y < y1 + span * 2;
      if (!ok) {
        pen = false;
        continue;
      }
      if (pen && Math.abs(y - prevY) > span * 1.5) pen = false;
      d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
      pen = true;
      prevY = y;
    }
    return d;
  };

  const axisY = Math.min(Math.max(sy(0), 0), H);
  const axisX = Math.min(Math.max(sx(0), 0), W);
  let ci = 0;

  return (
    <div className="plot">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafico interattivo">
        {ticks(x0, x1, niceStep(x1 - x0)).map((v) => (
          <g key={`x${v}`}>
            <line x1={sx(v)} y1={0} x2={sx(v)} y2={H} className="grid" />
            {v !== 0 && (
              <text x={sx(v)} y={Math.min(axisY + 12, H - 2)} className="tick" textAnchor="middle">
                {fmt(v)}
              </text>
            )}
          </g>
        ))}
        {ticks(y0, y1, niceStep(y1 - y0)).map((v) => (
          <g key={`y${v}`}>
            <line x1={0} y1={sy(v)} x2={W} y2={sy(v)} className="grid" />
            {v !== 0 && (
              <text x={Math.max(axisX - 4, 14)} y={sy(v) + 3} className="tick" textAnchor="end">
                {fmt(v)}
              </text>
            )}
          </g>
        ))}
        <line x1={0} y1={axisY} x2={W} y2={axisY} className="axis" />
        <line x1={axisX} y1={0} x2={axisX} y2={H} className="axis" />
        {shapes.map((s, i) => {
          if (s.k === 'fn' || s.k === 'param') {
            const color = s.color ?? COLORS[ci++ % COLORS.length];
            const N = 400;
            const pts: [number, number][] = [];
            for (let j = 0; j <= N; j++) {
              if (s.k === 'fn') {
                const x = x0 + ((x1 - x0) * j) / N;
                pts.push([x, s.f(x)]);
              } else {
                const t = s.t0 + ((s.t1 - s.t0) * j) / N;
                pts.push([s.x(t), s.y(t)]);
              }
            }
            return <path key={i} d={path(pts)} fill="none" stroke={color} strokeWidth={2.2} strokeDasharray={s.dash ? '5 4' : undefined} strokeLinejoin="round" />;
          }
          if (s.k === 'seg') return <line key={i} x1={sx(s.x1)} y1={sy(s.y1)} x2={sx(s.x2)} y2={sy(s.y2)} stroke={s.color ?? 'var(--plot-3)'} strokeWidth={2} strokeDasharray={s.dash ? '5 4' : undefined} />;
          if (s.k === 'vline') return <line key={i} x1={sx(s.x)} y1={0} x2={sx(s.x)} y2={H} stroke={s.color ?? 'var(--plot-3)'} strokeWidth={1.5} strokeDasharray={s.dash ? '5 4' : undefined} />;
          if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) return null;
          return (
            <g key={i}>
              <circle cx={sx(s.x)} cy={sy(s.y)} r={4} fill={s.color ?? 'var(--plot-2)'} />
              {s.label && (
                <text x={sx(s.x) + 7} y={sy(s.y) - 7} className="pt-label">
                  {s.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {params.map((p) => (
        <label key={p.name} className="slider">
          <span>
            {p.label} = <b>{fmt(vals[p.name])}</b>
          </span>
          <input type="range" min={p.min} max={p.max} step={p.step} value={vals[p.name]} onChange={(e) => setVals((v) => ({ ...v, [p.name]: Number(e.target.value) }))} />
        </label>
      ))}
      {readout && <Md src={readout(vals)} className="readout" />}
    </div>
  );
}
