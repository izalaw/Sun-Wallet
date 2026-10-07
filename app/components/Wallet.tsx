'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { formatEther } from 'viem';
import { QRCodeSVG } from 'qrcode.react';
import { publicClient } from '@/lib/client';
import SendForm from './SendForm';
import SunMark from './SunMark';
import EthChart from './EthChart';

type Currency = 'BRL' | 'USD';

type PriceData = {
  usd: number;
  brl: number;
  usd24h: number | null;
  brl24h: number | null;
  updatedAt: number;
};

const shorten = (address: string) => `${address.slice(0, 8)}…${address.slice(-6)}`;

function formatEth(balance: bigint | null) {
  if (balance === null) return '—';
  const value = Number(formatEther(balance));
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Wallet() {
  const { wallets, ready } = useWallets();
  const wallet = useMemo(
    () => wallets.find((item) => item.walletClientType === 'privy') ?? wallets[0],
    [wallets],
  );

  const [balance, setBalance] = useState<bigint | null>(null);
  const [price, setPrice] = useState<PriceData | null>(null);
  const [currency, setCurrency] = useState<Currency>('BRL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [readError, setReadError] = useState('');
  const [priceError, setPriceError] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('sun-wallet-currency');
    if (saved === 'USD' || saved === 'BRL') setCurrency(saved);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet?.address) return;
    try {
      setReadError('');
      const value = await publicClient.getBalance({
        address: wallet.address as `0x${string}`,
      });
      setBalance(value);
    } catch {
      setReadError('Não foi possível atualizar o saldo agora.');
    }
  }, [wallet]);

  const refreshPrice = useCallback(async () => {
    try {
      setPriceError(false);
      const response = await fetch(`/api/eth-price?t=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      if (!response.ok) throw new Error('price');
      setPrice(await response.json());
    } catch {
      setPriceError(true);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refreshBalance(), refreshPrice()]);
    setIsRefreshing(false);
  }, [refreshBalance, refreshPrice]);

  useEffect(() => {
    void refreshAll();
    const balanceTimer = window.setInterval(() => void refreshBalance(), 15_000);
    const priceTimer = window.setInterval(() => void refreshPrice(), 60_000);
    return () => {
      window.clearInterval(balanceTimer);
      window.clearInterval(priceTimer);
    };
  }, [refreshAll, refreshBalance, refreshPrice]);

  function chooseCurrency(value: Currency) {
    setCurrency(value);
    window.localStorage.setItem('sun-wallet-currency', value);
  }

  async function copyAddress() {
    if (!wallet?.address) return;
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function shareAddress() {
    if (!wallet?.address) return;

    const shareText = `Meu endereço SUN Wallet para receber ETH de teste na rede Sepolia: ${wallet.address}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SUN Wallet · Receber ETH',
          text: shareText,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 1600);
      } else {
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        window.setTimeout(() => setShared(false), 1600);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    }
  }

  const ethAmount = balance === null ? null : Number(formatEther(balance));
  const selectedPrice = price ? (currency === 'BRL' ? price.brl : price.usd) : null;
  const selectedChange = price ? (currency === 'BRL' ? price.brl24h : price.usd24h) : null;
  const fiatBalance = ethAmount !== null && selectedPrice !== null ? ethAmount * selectedPrice : null;

  if (!ready) {
    return <section className="wallet-card"><p className="muted">Carregando carteira…</p></section>;
  }

  if (!wallet) {
    return (
      <section className="wallet-card empty-wallet">
        <SunMark variant="loading" />
        <p className="eyebrow">Sua carteira</p>
        <h2>Criando sua carteira…</h2>
        <p className="muted">A Privy ainda está preparando a carteira embutida deste usuário.</p>
      </section>
    );
  }

  return (
    <>
      <div className="dashboard-grid">
        <section className="wallet-card hero-card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Seu saldo</p>
              <div className="balance-line">
                <strong>{formatEth(balance)}</strong>
                <span>ETH</span>
              </div>
              <div className="fiat-balance">
                {fiatBalance === null ? 'Cotação indisponível' : `≈ ${money(fiatBalance, currency)}`}
              </div>
              <p className="balance-disclaimer">Conversão informativa com base no preço de mercado do ETH.</p>
            </div>
            <div className="currency-switch" aria-label="Moeda de visualização">
              <button className={currency === 'BRL' ? 'active' : ''} onClick={() => chooseCurrency('BRL')}>BRL</button>
              <button className={currency === 'USD' ? 'active' : ''} onClick={() => chooseCurrency('USD')}>USD</button>
            </div>
          </div>

          <div className="wallet-actions">
            <SendForm
              fromAddress={wallet.address}
              balance={balance}
              walletChainId={wallet.chainId}
              switchChain={wallet.switchChain}
              onSent={refreshAll}
              currency={currency}
              ethPrice={selectedPrice}
            />
            <button className="secondary-button action-secondary" onClick={() => setReceiveOpen(true)}>Receber</button>
            <button className="icon-button action-refresh" onClick={() => void refreshAll()} disabled={isRefreshing} aria-label="Atualizar saldo e cotação">
              <span className={isRefreshing ? 'spin' : ''}>↻</span>
              <span>Atualizar</span>
            </button>
          </div>

          <div className="address-block">
            <div>
              <span className="field-label">Seu endereço público</span>
              <code title={wallet.address}>{shorten(wallet.address)}</code>
            </div>
            <button className="copy-button" onClick={() => void copyAddress()}>
              {copied ? 'Copiado ✓' : 'Copiar endereço'}
            </button>
          </div>

          {readError && <p className="inline-error">{readError}</p>}
        </section>

        <aside className="side-stack">
          <section className="info-card price-card">
            <div className="price-head">
              <div>
                <p className="eyebrow">Ethereum agora</p>
                <h3>{selectedPrice === null ? '—' : money(selectedPrice, currency)}</h3>
              </div>
              <span className="eth-badge">ETH</span>
            </div>

            {selectedChange !== null && (
              <p className={selectedChange >= 0 ? 'market-change positive' : 'market-change negative'}>
                {selectedChange >= 0 ? '↑' : '↓'} {Math.abs(selectedChange).toFixed(2)}% nas últimas 24h
              </p>
            )}

            <EthChart currency={currency} />

            {priceError && <p className="mini-value">Cotação temporariamente indisponível. A carteira continua funcionando normalmente.</p>}
            {price?.updatedAt && (
              <p className="price-update">Preço atualizado às {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(price.updatedAt)}</p>
            )}
          </section>

          <section className="info-card network-card">
            <div className="network-icon"><SunMark compact /></div>
            <div>
              <p className="eyebrow">Rede</p>
              <h3>Sepolia testnet</h3>
              <p>ETH de teste, sem valor real. Ideal para experimentar transferências com segurança.</p>
            </div>
          </section>
        </aside>
      </div>

      {receiveOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setReceiveOpen(false)}>
          <section className="modal-card receive-modal" role="dialog" aria-modal="true" aria-labelledby="receive-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-mark receive-mascot"><SunMark /></div>
            <button className="close-button modal-close" onClick={() => setReceiveOpen(false)} aria-label="Fechar">×</button>
            <p className="eyebrow">Receber ETH</p>
            <h2 id="receive-title">Compartilhe seu endereço</h2>
            <p className="muted">Use este endereço somente para receber ETH de teste na rede Sepolia.</p>

            <div className="receive-grid">
              <div className="qr-card" aria-label="QR Code do endereço da carteira">
                <QRCodeSVG
                  value={wallet.address}
                  size={164}
                  bgColor="#fffdf8"
                  fgColor="#282b29"
                  level="M"
                  marginSize={2}
                  title="Endereço SUN Wallet na rede Sepolia"
                />
              </div>

              <div className="receive-address-panel">
                <span className="field-label">Seu endereço público</span>
                <code className="full-address">{wallet.address}</code>
                <span className="receive-network-label"><span className="status-dot" /> Rede: Sepolia</span>
              </div>
            </div>

            <div className="receive-actions">
              <button className="secondary-button" onClick={() => void copyAddress()}>
                {copied ? 'Endereço copiado ✓' : 'Copiar endereço'}
              </button>
              <button className="primary-button" onClick={() => void shareAddress()}>
                {shared ? 'Compartilhado ✓' : 'Compartilhar'}
              </button>
            </div>

            <p className="warning-text">Não envie ETH de mainnet ou outros ativos para este endereço durante o teste.</p>
          </section>
        </div>
      )}
    </>
  );
}
