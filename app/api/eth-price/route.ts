import { NextResponse } from 'next/server';

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,brl&include_24hr_change=true&include_last_updated_at=true';

export async function GET() {
  try {
    const response = await fetch(COINGECKO_URL, {
      headers: { accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko respondeu ${response.status}`);
    }

    const data = await response.json();
    const ethereum = data?.ethereum;

    if (!ethereum?.usd || !ethereum?.brl) {
      throw new Error('Resposta de cotação incompleta');
    }

    return NextResponse.json(
      {
        usd: ethereum.usd,
        brl: ethereum.brl,
        usd24h: ethereum.usd_24h_change ?? null,
        brl24h: ethereum.brl_24h_change ?? null,
        updatedAt: ethereum.last_updated_at
          ? ethereum.last_updated_at * 1000
          : Date.now(),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    );
  } catch (error) {
    console.error('ETH price error', error);
    return NextResponse.json({ error: 'Cotação indisponível' }, { status: 503 });
  }
}
