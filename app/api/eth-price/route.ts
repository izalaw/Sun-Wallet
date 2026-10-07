import { NextResponse } from 'next/server';

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,brl&include_24hr_change=true&include_last_updated_at=true';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(COINGECKO_URL, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
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
        fetchedAt: Date.now(),
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
    console.error('ETH price error', error);
    return NextResponse.json(
      { error: 'Cotação indisponível' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
