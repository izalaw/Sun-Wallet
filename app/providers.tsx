'use client';

import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';
import SunMark from './components/SunMark';

const PRIVY_BOOT_TIMEOUT = 10000;

function RecoveryScreen({ reason }: { reason: 'timeout' | 'error' }) {
  function retry() {
    window.location.reload();
  }

  return (
    <main className="center-screen startup-recovery">
      <SunMark variant="thinking" />
      <h1>Não foi possível iniciar a carteira.</h1>
      <p className="muted">
        {reason === 'timeout'
          ? 'A conexão com o serviço da carteira demorou mais do que o esperado.'
          : 'O navegador encontrou um problema ao iniciar a sessão da carteira.'}
      </p>
      <button className="primary-button" onClick={retry}>
        Tentar novamente
      </button>
      <p className="footnote">
        No celular, abra a SUN diretamente no Safari ou Chrome. Navegadores internos de outros aplicativos podem bloquear recursos necessários para o login.
      </p>
    </main>
  );
}

class PrivyErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Privy initialization error', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return <RecoveryScreen reason="error" />;
    }

    return this.props.children;
  }
}

function PrivyReadySignal({ onReady }: { onReady: () => void }) {
  const { ready } = usePrivy();

  useEffect(() => {
    if (ready) onReady();
  }, [ready, onReady]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
  const [privyReady, setPrivyReady] = useState(false);
  const [bootTimedOut, setBootTimedOut] = useState(false);

  useEffect(() => {
    if (privyReady) {
      setBootTimedOut(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setBootTimedOut(true);
    }, PRIVY_BOOT_TIMEOUT);

    return () => window.clearTimeout(timer);
  }, [privyReady]);

  if (!appId) {
    return (
      <main className="setup-screen">
        <div className="setup-card">
          <span className="network-pill">Configuração necessária</span>
          <h1>Conecte a SUN ao Privy</h1>
          <p>Crie <code>.env.local</code> na raiz do projeto a partir de <code>.env.example</code> e preencha as credenciais do seu app no Privy Dashboard.</p>
        </div>
      </main>
    );
  }

  if (bootTimedOut) {
    return <RecoveryScreen reason="timeout" />;
  }

  return (
    <PrivyErrorBoundary>
      <PrivyProvider
        appId={appId}
        clientId={clientId}
        config={{
          loginMethods: ['email'],
          embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } },
          defaultChain: sepolia,
          supportedChains: [sepolia],
          appearance: {
            theme: 'light',
            accentColor: '#e8b52d',
            showWalletLoginFirst: false,
          },
        }}
      >
        <PrivyReadySignal onReady={() => setPrivyReady(true)} />
        {children}
      </PrivyProvider>
    </PrivyErrorBoundary>
  );
}
