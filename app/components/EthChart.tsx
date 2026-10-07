'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Currency = 'BRL' | 'USD';
type PricePoint = { timestamp: number; value: number };

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EthChart({ currency }: { currency: Currency }) {
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [error, setError] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [lastPointAt, setLastPointAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(false);
      const response = await fetch(
        `/api/eth-chart?currency=${currency}&t=${Date.now()}`,
        {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        },
      );

      if (!response.ok) throw new Error('chart');

      const data = await response.json();
      setPoints(data.prices ?? []);
      setFetchedAt(data.fetchedAt ?? Date.now());
      setLastPointAt(data.lastPointAt ?? null);
    } catch {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [currency]);

  useEffect(() => {
    void load();

    const timer = window.setInterval(() => void load(), 60_000);
    const onFocus = () => void load();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void load();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [load]);

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
    return (
      <div className="chart-unavailable">
        <p>Histórico temporariamente indisponível.</p>
        <button className="chart-retry" onClick={() => void load()}>Tentar novamente</button>
      </div>
    );
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
            <span>{new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }).format(hovered.timestamp)}</span>
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
          <path
            d={chart.path}
            fill="none"
            stroke="#5C8B70"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {hovered && (
            <>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1="0"
                y2={chart.height}
                stroke="#AFA898"
                strokeDasharray="4 5"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r="5"
                fill="#FFFDF8"
                stroke="#5C8B70"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
      </div>

      <div className="chart-status-row">
        <div>
          <span>Fonte: CoinGecko</span>
          {fetchedAt && (
            <span>
              Consulta: {new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).format(fetchedAt)}
            </span>
          )}
          {lastPointAt && (
            <span>
              Último ponto: {new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }).format(lastPointAt)}
            </span>
          )}
        </div>

        <button
          className="chart-refresh-button"
          onClick={() => void load()}
          disabled={refreshing}
        >
          {refreshing ? 'Atualizando…' : 'Atualizar'}
        </button>
      </div>

      {error && <p className="chart-soft-error">Não foi possível atualizar agora; exibindo o último histórico carregado.</p>}
    </div>
  );
}
