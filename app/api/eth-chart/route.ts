import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart';

export async function GET(request: NextRequest) {
  const currencyParam = request.nextUrl.searchParams.get('currency')?.toLowerCase();
  const currency = currencyParam === 'usd' ? 'usd' : 'brl';

  try {
    const url = `${COINGECKO_BASE}?vs_currency=${currency}&days=7&interval=hourly`;
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 300 },
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
      { currency: currency.toUpperCase(), prices },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (error) {
    console.error('ETH chart error', error);
    return NextResponse.json({ error: 'Histórico indisponível' }, { status: 503 });
  }
}
