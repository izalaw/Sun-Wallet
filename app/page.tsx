'use client';

import { usePrivy } from '@privy-io/react-auth';
import Wallet from './components/Wallet';
import DebugPanel from './components/DebugPanel';
import SunMark from './components/SunMark';

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) {
    return (
      <main className="center-screen">
        <SunMark />
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
