'use client';

import { useMemo, useState } from 'react';
import { useSendTransaction } from '@privy-io/react-auth';
import { formatEther, getAddress, isAddress, parseEther, zeroAddress } from 'viem';
import { sepolia } from 'viem/chains';
import { publicClient } from '@/lib/client';
import SunMark from './SunMark';

type Currency = 'BRL' | 'USD';

type Props = {
  fromAddress: string;
  balance: bigint | null;
  walletChainId?: string;
  switchChain?: (chainId: number) => Promise<void>;
  onSent: () => void | Promise<void>;
  currency: Currency;
  ethPrice: number | null;
};

type Stage = 'closed' | 'edit' | 'review' | 'sending' | 'success';

const GAS_RESERVE = parseEther('0.0005');
const shorten = (address: string) => `${address.slice(0, 8)}…${address.slice(-6)}`;

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

export default function SendForm({
  fromAddress,
  balance,
  walletChainId,
  switchChain,
  onSent,
  currency,
  ethPrice,
}: Props) {
  const { sendTransaction } = useSendTransaction();
  const [stage, setStage] = useState<Stage>('closed');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const normalizedTo = useMemo(() => to.trim(), [to]);
  const numericAmount = Number(amount.replace(',', '.'));
  const fiatAmount = Number.isFinite(numericAmount) && numericAmount > 0 && ethPrice !== null ? numericAmount * ethPrice : null;

  function reset() {
    setStage('closed');
    setTo('');
    setAmount('');
    setError('');
    setTxHash('');
  }

  function validate() {
    setError('');
    if (!normalizedTo || !isAddress(normalizedTo)) return 'Esse endereço parece inválido. Confira e tente novamente.';

    const checksummed = getAddress(normalizedTo);
    if (checksummed === zeroAddress) return 'O endereço zero não pode receber esta transferência.';
    if (checksummed.toLowerCase() === fromAddress.toLowerCase()) return 'Você não pode enviar para sua própria carteira.';
    if (!amount || !Number.isFinite(Number(amount)) || !(Number(amount) > 0)) return 'Informe um valor maior que zero.';

    let value: bigint;
    try {
      value = parseEther(amount);
    } catch {
      return 'Informe uma quantidade de ETH válida.';
    }

    if (balance !== null && value > balance) return 'Seu saldo não é suficiente para esse valor.';
    if (balance !== null && value + GAS_RESERVE > balance) return 'Deixe uma pequena margem para a taxa da rede.';
    return '';
  }

  function handleReview() {
    const message = validate();
    if (message) return setError(message);
    setStage('review');
  }

  function setMax() {
    if (balance === null || balance <= GAS_RESERVE) {
      setError('Seu saldo não é suficiente para reservar a taxa da rede.');
      return;
    }
    setAmount(formatEther(balance - GAS_RESERVE));
    setError('');
  }

  async function handleConfirm() {
    const message = validate();
    if (message) {
      setError(message);
      setStage('edit');
      return;
    }

    try {
      setError('');
      setStage('sending');

      if (walletChainId !== `eip155:${sepolia.id}` && switchChain) await switchChain(sepolia.id);

      const destination = getAddress(normalizedTo);
      const value = parseEther(amount);
      const { hash } = await sendTransaction(
        { to: destination, value, chainId: sepolia.id },
        { address: fromAddress },
      );

      await publicClient.waitForTransactionReceipt({ hash });
      setTxHash(hash);
      setStage('success');
      await onSent();
    } catch (e) {
      setError(readableError(e));
      setStage('edit');
    }
  }

  if (stage === 'closed') {
    return <button className="primary-button action-primary" onClick={() => setStage('edit')}>Enviar ETH</button>;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={stage === 'sending' ? undefined : reset}>
      <section className="modal-card send-modal" role="dialog" aria-modal="true" aria-labelledby="send-title" onMouseDown={(event) => event.stopPropagation()}>
        {stage !== 'sending' && <button className="close-button modal-close" onClick={reset} aria-label="Fechar">×</button>}

        {stage === 'edit' && (
          <>
            <div className="modal-mark modal-friendly"><SunMark /></div>
            <p className="eyebrow">Enviar ETH</p>
            <h2 id="send-title">Para quem você quer enviar?</h2>

            <label>
              <span>Endereço da carteira</span>
              <input value={to} onChange={(e) => setTo(e.target.value)} onBlur={() => setTo((value) => value.trim())} placeholder="0x…" autoComplete="off" autoFocus />
            </label>

            <label>
              <span>Quanto você quer enviar?</span>
              <div className="amount-input">
                <input value={amount} onChange={(e) => setAmount(e.target.value.replace(',', '.'))} placeholder="0.001" inputMode="decimal" />
                <button type="button" onClick={setMax}>Máx.</button>
                <b>ETH</b>
              </div>
              <small className="conversion-hint">{fiatAmount === null ? 'O equivalente aparecerá aqui.' : `≈ ${money(fiatAmount, currency)}`}</small>
            </label>

            <p className="network-note">Rede: Sepolia · uma pequena taxa da rede é paga em ETH de teste.</p>
            {error && <p className="inline-error">{error}</p>}

            <div className="button-row">
              <button className="secondary-button" onClick={reset}>Cancelar</button>
              <button className="primary-button" onClick={handleReview}>Revisar envio</button>
            </div>
          </>
        )}

        {stage === 'review' && (
          <>
            <div className="modal-mark modal-friendly"><SunMark /></div>
            <p className="eyebrow">Revisão</p>
            <h2 id="send-title">Confira antes de enviar</h2>

            <div className="review-box">
              <div className="review-line">
                <span>Valor</span>
                <div>
                  <strong>{amount} ETH</strong>
                  {fiatAmount !== null && <b>≈ {money(fiatAmount, currency)}</b>}
                </div>
              </div>

              <div className="review-divider" />

              <div className="review-line">
                <span>Destino</span>
                <div>
                  <code>{isAddress(normalizedTo) ? shorten(getAddress(normalizedTo)) : normalizedTo}</code>
                  <small>{normalizedTo}</small>
                </div>
              </div>

              <div className="review-divider" />

              <div className="review-line">
                <span>Rede</span>
                <div>
                  <strong className="review-network">Sepolia testnet</strong>
                  <small>A taxa final é calculada pela rede no momento da confirmação.</small>
                </div>
              </div>
            </div>

            <p className="warning-text">Confira o endereço com atenção. Transações em blockchain não podem ser desfeitas.</p>

            <div className="button-row">
              <button className="secondary-button" onClick={() => setStage('edit')}>Voltar</button>
              <button className="primary-button" onClick={() => void handleConfirm()}>Confirmar envio</button>
            </div>
          </>
        )}

        {stage === 'sending' && (
          <div className="transaction-state">
            <SunMark variant="loading" />
            <div className="loader" />
            <h2>Confirmando sua transação…</h2>
            <p>A Privy assina o envio e a SUN aguarda a confirmação na Sepolia.</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="transaction-state success-state">
            <SunMark variant="success" />
            <div className="success-icon">✓</div>
            <h2>Pronto! Seu ETH foi enviado.</h2>
            <p>A transação foi confirmada na Sepolia e seu saldo foi atualizado.</p>
            <a className="etherscan-link" href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">Ver transação no Etherscan ↗</a>
            <button className="secondary-button full" onClick={reset}>Voltar para a carteira</button>
          </div>
        )}
      </section>
    </div>
  );
}

function readableError(error: unknown) {
  if (!(error instanceof Error)) return 'Não foi possível enviar a transação.';
  const text = error.message.toLowerCase();
  if (text.includes('reject') || text.includes('denied') || text.includes('cancel')) return 'A transação foi cancelada.';
  if (text.includes('insufficient funds')) return 'Seu saldo não cobre o valor e a taxa da rede.';
  return error.message.length > 180 ? 'Não foi possível enviar. Confira o saldo, o endereço e a rede e tente novamente.' : error.message;
}
