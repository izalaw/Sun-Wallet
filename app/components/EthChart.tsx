'use client';

import { useEffect, useMemo, useState } from 'react';

type Currency = 'BRL' | 'USD';
type PricePoint = { timestamp: number; value: number };

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'BRL' ? 2 : 2,
  }).format(value);
}

export default function EthChart({ currency }: { currency: Currency }) {
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [error, setError] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setError(false);
        const response = await fetch(`/api/eth-chart?currency=${currency}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('chart');
        const data = await response.json();
        if (active) setPoints(data.prices ?? []);
      } catch {
        if (active) setError(true);
      }
    }

    void load();
    const timer = window.setInterval(() => void load(), 5 * 60_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [currency]);

  const chart = useMemo(() => {
    if (points.length < 2) return null;
    const width = 560;
    const height = 170;
    const padX = 8;
    const padY = 12;
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const coordinates = points.map((point, index) => {
      const x = padX + (index / (points.length - 1)) * (width - padX * 2);
      const y = padY + ((max - point.value) / range) * (height - padY * 2);
      return { ...point, x, y };
    });

    const path = coordinates
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(' ');

    const area = `${path} L ${coordinates.at(-1)!.x.toFixed(2)} ${height} L ${coordinates[0].x.toFixed(2)} ${height} Z`;
    return { width, height, min, max, coordinates, path, area };
  }, [points]);

  const hovered = hoverIndex !== null && chart ? chart.coordinates[hoverIndex] : null;

  if (error && !chart) {
    return <p className="chart-unavailable">Histórico temporariamente indisponível.</p>;
  }

  if (!chart) {
    return <div className="chart-loading" aria-label="Carregando histórico do Ethereum" />;
  }

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    const index = Math.max(0, Math.min(points.length - 1, Math.round(ratio * (points.length - 1))));
    setHoverIndex(index);
  }

  return (
    <div className="eth-chart-wrap">
      <div className="chart-meta-row">
        <span>Últimos 7 dias</span>
        <span>{money(chart.min, currency)} — {money(chart.max, currency)}</span>
      </div>

      <div className="chart-canvas">
        {hovered && (
          <div
            className="chart-tooltip"
            style={{ left: `${(hovered.x / chart.width) * 100}%` }}
          >
            <strong>{money(hovered.value, currency)}</strong>
            <span>{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(hovered.timestamp)}</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          preserveAspectRatio="none"
          onPointerMove={handleMove}
          onPointerLeave={() => setHoverIndex(null)}
          role="img"
          aria-label="Histórico real do preço do Ethereum nos últimos sete dias"
        >
          <defs>
            <linearGradient id="ethArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6E9C7E" stopOpacity=".28" />
              <stop offset="100%" stopColor="#6E9C7E" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chart.area} fill="url(#ethArea)" />
          <path d={chart.path} fill="none" stroke="#5C8B70" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          {hovered && (
            <>
              <line x1={hovered.x} x2={hovered.x} y1="0" y2={chart.height} stroke="#AFA898" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
              <circle cx={hovered.x} cy={hovered.y} r="5" fill="#FFFDF8" stroke="#5C8B70" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>
      </div>
      <p className="chart-source">Dados reais de mercado · atualização aproximada a cada 5 min</p>
    </div>
  );
}
