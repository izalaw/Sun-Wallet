'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function DebugPanel() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

  if (process.env.NODE_ENV !== 'development') return null;

  const data = {
    ready,
    authenticated,
    userId: user?.id,
    email: user?.email?.address,
    createdAt: user?.createdAt,
    accessToken: token,
    wallets: wallets.map((wallet) => ({
      address: wallet.address,
      chainId: wallet.chainId,
      type: wallet.walletClientType,
    })),
    linkedAccounts: user?.linkedAccounts,
    user,
  };

  async function toggle() {
    if (!open) {
      try {
        setToken(await getAccessToken());
      } catch {
        setToken(null);
      }
    }
    setOpen((value) => !value);
  }

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1200);
  }

  return (
    <div className="debug-wrap">
      <button className="debug-trigger" onClick={() => void toggle()}>Debug</button>
      {open && (
        <section className="debug-panel">
          <div className="debug-head">
            <div><strong>Painel de debug</strong><span>Somente development</span></div>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="debug-actions">
            <button onClick={() => void copy('json', JSON.stringify(data, null, 2))}>
              {copied === 'json' ? 'JSON copiado ✓' : 'Copiar JSON'}
            </button>
            {user?.id && <button onClick={() => void copy('id', user.id)}>{copied === 'id' ? 'ID copiado ✓' : 'Copiar user ID'}</button>}
          </div>
          <div className="token-warning">Não compartilhe o access token em chats, prints ou issues.</div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
