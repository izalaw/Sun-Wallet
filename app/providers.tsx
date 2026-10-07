'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

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

  return (
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
      {children}
    </PrivyProvider>
  );
}
