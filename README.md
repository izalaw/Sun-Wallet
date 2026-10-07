# SUN Wallet ☀️

Carteira Ethereum web construída com **Next.js**, **Privy** e **viem**, criada como projeto de residência/portfólio. A aplicação roda na **Sepolia testnet** e permite autenticar por e-mail, criar uma carteira embutida automaticamente, consultar saldo e enviar ETH de teste.

> **Technology in the background. People in the foreground.**  
> Tecnologia em segundo plano. Pessoas em primeiro plano.

## Funcionalidades

- Login por e-mail com Privy
- Carteira Ethereum embutida criada no primeiro login
- Rede fixa em Sepolia
- Saldo em ETH
- Conversão visual do saldo para BRL ou USD
- Cotação atual do ETH, variação de 24h e gráfico real de 7 dias (CoinGecko)
- Preferência BRL/USD salva no navegador
- Copiar endereço
- Receber: QR Code real, copiar e compartilhar o endereço público
- Enviar ETH com validações, revisão e confirmação
- Verificação de endereço zero, envio para si mesmo e saldo insuficiente
- Reserva simples para gas ao usar “Máx.”
- Atualização automática do saldo a cada 15s e da cotação a cada 60s
- Link da transação confirmada no Etherscan Sepolia
- Logout sempre acessível
- Painel de debug apenas em desenvolvimento
- Interface desktop-first, com fallback responsivo

## Stack

- Next.js (App Router)
- React + TypeScript
- Privy (`@privy-io/react-auth`)
- viem
- CoinGecko Simple Price API

## Rodar localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure a Privy

No [Privy Dashboard](https://dashboard.privy.io/):

1. Crie um app.
2. Habilite login por e-mail.
3. Adicione `http://localhost:3000` em allowed origins/domains.
4. Confirme que embedded Ethereum wallets estão habilitadas.
5. Copie o App ID e, se disponível, o Client ID.

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_PRIVY_APP_ID=seu_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=seu_client_id
```

O `.env.local` está ignorado pelo Git e não deve ser commitado.

### 3. Inicie

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Roteiro de teste exigido

1. Entre com o e-mail A e copie o endereço da carteira.
2. Envie ETH Sepolia de um faucet para A.
3. Abra uma janela anônima e entre com o e-mail B.
4. Copie o endereço de B.
5. Na conta A, envie `0.001 ETH` para B.
6. Confirme que:
   - o saldo de A caiu (valor + gas);
   - o saldo de B subiu;
   - a transação aparece no Etherscan Sepolia.
7. Teste também:
   - endereço inválido;
   - envio para a própria carteira;
   - valor zero;
   - valor maior que o saldo.

## Deploy na Vercel

1. Importe este repositório na Vercel.
2. Em **Project Settings → Environment Variables**, cadastre:
   - `NEXT_PUBLIC_PRIVY_APP_ID`
   - `NEXT_PUBLIC_PRIVY_CLIENT_ID`
3. Faça o deploy.
4. Copie a URL de produção da Vercel e adicione essa origem/domínio no Privy Dashboard.
5. Faça um novo deploy se necessário e teste login + envio em produção.

A cotação ETH usa uma rota server-side do próprio Next.js (`/api/eth-price`), então não exige chave de API neste MVP. Se o provedor de cotação estiver indisponível, a carteira continua funcionando e apenas omite a conversão fiat.

## Estrutura principal

```text
app/
├── api/eth-price/route.ts
├── components/
│   ├── DebugPanel.tsx
│   ├── SendForm.tsx
│   ├── SunMark.tsx
│   └── Wallet.tsx
├── globals.css
├── layout.tsx
├── page.tsx
└── providers.tsx
lib/
└── client.ts
```

## Segurança e escopo

- A aplicação usa **Sepolia testnet**, nunca mainnet.
- O painel de debug só renderiza em `development`.
- Nunca publique ou compartilhe access tokens da Privy.
- Este projeto é educacional e de portfólio; ETH Sepolia não possui valor real.

## Identidade e UX

A SUN Wallet usa uma direção **Solar Minimal**: fundo creme, amarelo solar como ação principal, verde sálvia como apoio e interface desktop-first. O sistema de mascote usa a versão **Friendly** completa em momentos principais, uma versão compacta no cabeçalho e estados próprios para carregamento e sucesso.

A referência conceitual é o universo visual do projeto autoral **Solana Punk 2050**, especialmente a ideia de tecnologia em segundo plano e experiência humana em primeiro plano. A interface deste repositório, porém, foi desenhada especificamente para o escopo Ethereum + Privy + Sepolia.

## Checklist de entrega

- [x] Estrutura Next.js + TypeScript
- [x] PrivyProvider e login por e-mail
- [x] Embedded wallet Ethereum automática
- [x] Sepolia como única rede suportada
- [x] Saldo + atualização
- [x] Envio de ETH + validações + confirmação
- [x] Receber com QR Code, copiar e compartilhar endereço
- [x] BRL/USD + cotação ETH + gráfico real de 7 dias
- [x] Logout
- [x] Debug somente em development
- [x] README + `.env.example`
- [ ] Teste end-to-end com duas contas (depende das credenciais Privy e ETH Sepolia)
- [ ] Prints/GIF da aplicação rodando
- [ ] Deploy Vercel
