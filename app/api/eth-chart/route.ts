import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const currencyParam = request.nextUrl.searchParams.get('currency')?.toLowerCase();
  const currency = currencyParam === 'usd' ? 'usd' : 'brl';

  try {
    const url = `${COINGECKO_BASE}?vs_currency=${currency}&days=7`;
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`CoinGecko respondeu ${response.status}`);
    }

    const data = await response.json();
    const prices = Array.isArray(data?.prices)
      ? data.prices
          .filter((point: unknown) =>
            Array.isArray(point) &&
            typeof point[0] === 'number' &&
            typeof point[1] === 'number',
          )
          .map(([timestamp, value]: [number, number]) => ({ timestamp, value }))
      : [];

    if (!prices.length) throw new Error('Histórico de preço vazio');

    return NextResponse.json(
      {
        currency: currency.toUpperCase(),
        prices,
        fetchedAt: Date.now(),
        lastPointAt: prices.at(-1)?.timestamp ?? null,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );
  } catch (error) {
    console.error('ETH chart error', error);
    return NextResponse.json(
      { error: 'Histórico indisponível' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
