'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Wallet from './components/Wallet';
import DebugPanel from './components/DebugPanel';
import SunMark from './components/SunMark';

const PRIVY_READY_TIMEOUT = 8000;

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [startupTimedOut, setStartupTimedOut] = useState(false);

  useEffect(() => {
    if (ready) {
      setStartupTimedOut(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStartupTimedOut(true);
    }, PRIVY_READY_TIMEOUT);

    return () => window.clearTimeout(timer);
  }, [ready]);

  function retryStartup() {
    setStartupTimedOut(false);
    window.location.reload();
  }

  if (!ready) {
    if (startupTimedOut) {
      return (
        <main className="center-screen startup-recovery">
          <SunMark variant="thinking" />
          <h1>A carteira demorou para iniciar.</h1>
          <p className="muted">
            Isso pode acontecer quando o navegador interrompe a inicialização da sessão. Tente carregar a SUN novamente.
          </p>
          <button className="primary-button" onClick={retryStartup}>
            Tentar novamente
          </button>
          <p className="footnote">
            Se você abriu o link dentro de outro aplicativo, tente também abrir diretamente no Safari ou Chrome.
          </p>
        </main>
      );
    }

    return (
      <main className="center-screen">
        <SunMark variant="loading" />
        <div className="loader" aria-label="Carregando" />
        <p className="muted">Preparando sua carteira…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="login-brand">
            <SunMark />
            <div className="wordmark">sun</div>
          </div>
          <span className="network-pill"><span className="status-dot" />Sepolia · ambiente de teste</span>
          <h1>Sua carteira digital, sem complicação.</h1>
          <p className="lead">
            Entre com seu e-mail para acessar sua carteira Ethereum de teste. A Privy cria e protege sua carteira para você.
          </p>
          <button className="primary-button full login-button" onClick={login}>
            Entrar com e-mail
          </button>
          <p className="footnote">A SUN usa somente ETH de teste na rede Sepolia. Nenhum dinheiro real é movimentado.</p>
        </section>
        <aside className="login-art" aria-hidden="true">
          <div className="sun-orbit large" />
          <SunMark />
          <p>Technology in the background.<br />People in the foreground.</p>
        </aside>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-row">
          <SunMark compact />
          <div className="wordmark small">sun</div>
        </div>
        <div className="header-center">
          <span className="network-pill"><span className="status-dot" />Sepolia testnet</span>
        </div>
        <div className="header-actions">
          <span className="user-email">{user?.email?.address ?? 'Usuário autenticado'}</span>
          <button className="ghost-button" onClick={logout}>Sair</button>
        </div>
      </header>

      <div className="content-wrap">
        <Wallet />
      </div>

      <DebugPanel />
    </main>
  );
}
