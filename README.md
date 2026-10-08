# SUN Wallet

**Sua carteira digital, sem complicação.**

A **SUN Wallet** é uma carteira Ethereum experimental criada para explorar uma ideia simples: blockchain pode ser poderosa sem parecer complicada.

A aplicação combina **Next.js**, **Privy** e **viem** para oferecer login por e-mail, criação automática de uma carteira embutida, consulta de saldo, recebimento e envio de ETH na **Sepolia testnet**.

> **Technology in the background. People in the foreground.**  
> **Tecnologia em segundo plano. Pessoas em primeiro plano.**

## A ideia por trás da SUN

O nome **SUN** nasce de uma visão de futuro inspirada na estética **solarpunk / solar futurista**: uma perspectiva mais positiva, humana e sustentável sobre tecnologia.

Aqui, “solar” não significa apenas uma escolha visual. É também uma escolha de produto.

A proposta é imaginar interfaces em que a tecnologia deixe de dominar a experiência e passe a funcionar de forma mais silenciosa, compreensível e integrada à vida cotidiana.

Em vez de começar por seed phrase, extensão de navegador, RPC, gas ou jargões técnicos, a SUN começa por algo familiar: **um e-mail**.

A tecnologia continua existindo — carteira, blockchain, assinatura, transação, rede e explorer — mas aparece apenas quando ajuda o usuário a entender o que está acontecendo.

## Demo

**Aplicação publicada:**  
https://sun-wallet-bay.vercel.app/

A SUN funciona exclusivamente na **Sepolia testnet**. O ETH utilizado não possui valor real.

## Experimente a carteira

Uma pequena atividade prática para entender o fluxo de uma carteira Web3:

1. Entre na SUN Wallet usando seu e-mail.
2. Aguarde a criação automática da carteira.
3. Copie seu endereço público.
4. Receba ETH de teste da rede Sepolia.
5. Abra uma segunda sessão com outro e-mail.
6. Copie o endereço da segunda carteira.
7. Envie uma pequena quantidade de ETH entre as duas contas.
8. Acompanhe a confirmação da transação.
9. Abra a transação no Etherscan.
10. Volte à SUN e observe a atualização do saldo.

Ao completar esse fluxo, você exercita na prática alguns conceitos fundamentais de Web3:

- endereço público;
- carteira embutida;
- saldo on-chain;
- envio e recebimento de ativos;
- taxa de rede;
- assinatura de transação;
- confirmação em blockchain;
- explorer;
- diferença entre a interface de uma carteira e a infraestrutura que funciona por trás dela.

## O que a experiência tenta demonstrar

A SUN não busca apenas provar que uma transferência funciona.

Ela explora como decisões de **UX, linguagem e identidade visual** podem mudar a percepção de produtos Web3.

A hipótese é simples: muitas barreiras de entrada não estão apenas na tecnologia, mas na forma como ela é apresentada.

Por isso, a interface evita estética de trading, neon, excesso de informação e linguagem excessivamente técnica. A direção visual segue uma proposta **Solar Minimal**, com tons creme, amarelo solar, verde sálvia e um mascote Friendly que ajuda a comunicar estados da aplicação de forma mais humana.

## Funcionalidades

- Login por e-mail com Privy
- Carteira Ethereum embutida criada automaticamente
- Rede fixa em Sepolia
- Saldo em ETH
- Conversão visual do saldo para BRL ou USD
- Cotação atual do ETH
- Variação de 24h
- Gráfico real de 7 dias via CoinGecko
- Preferência BRL/USD salva no navegador
- Copiar endereço público
- Receber ETH com QR Code
- Compartilhar endereço
- Enviar ETH
- Revisão antes da confirmação
- Validação de endereço
- Bloqueio de envio para a própria carteira
- Validação de saldo insuficiente
- Reserva simples para gas ao usar “Máx.”
- Atualização automática do saldo
- Link da transação confirmada no Etherscan Sepolia
- Logout
- Painel de debug somente em desenvolvimento
- Interface desktop-first com fallback responsivo

## Estados do mascote

O mascote Friendly funciona como parte da linguagem da interface:

- **normal** → contexto neutro, envio e revisão;
- **loading** → criação da carteira ou transação em processamento;
- **feliz** → ação concluída com sucesso;
- **pensando** → algo precisa ser revisto, como endereço inválido ou saldo insuficiente;
- **compacto** → navegação e espaços menores.

A proposta é comunicar estados sem transformar erro em punição visual.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Privy (`@privy-io/react-auth`)
- viem
- CoinGecko Simple Price API
- Vercel

## Como funciona

```text
E-mail
  ↓
Privy
  ↓
Embedded Ethereum Wallet
  ↓
SUN Wallet
  ↓
Sepolia
  ↓
Etherscan
```

O usuário interage com uma interface simples, enquanto autenticação, carteira e infraestrutura blockchain permanecem em segundo plano.

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

## Teste end-to-end

O fluxo principal foi validado em Sepolia com duas contas distintas:

- login por e-mail em duas sessões;
- criação de duas embedded wallets;
- conta A financiada com ETH Sepolia;
- envio de `0.001 ETH` da conta A para a conta B;
- confirmação da transação;
- atualização do saldo após o recebimento;
- persistência do saldo após recarregar a aplicação.

**Transação de teste:**  
https://sepolia.etherscan.io/tx/0xcecd1564d9bd04aa9d54b7d570498748043894689c02f3b0d96260390550d348

> Este teste utiliza somente ETH de testnet, sem valor real.

## Casos de teste sugeridos

Além do fluxo principal, vale testar:

- endereço inválido;
- endereço zero;
- envio para a própria carteira;
- valor zero;
- valor maior que o saldo;
- uso do botão “Máx.”;
- cancelamento da assinatura;
- atualização do saldo após confirmação.

## Estrutura principal

```text
app/
├── api/eth-price/route.ts
├── components/
│   ├── DebugPanel.tsx
│   ├── EthChart.tsx
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
- Variáveis de ambiente sensíveis não devem ser commitadas.
- ETH Sepolia não possui valor real.
- O projeto é experimental, educacional e de portfólio.

## Identidade

A SUN Wallet segue uma direção **Solar Minimal**: fundo creme, amarelo solar como ação principal, verde sálvia como apoio e uma interface visualmente calma.

A referência conceitual vem de uma visão **solar futurista / solarpunk**, em que tecnologia, sustentabilidade, comunidade e experiência humana convivem sem transformar o futuro em algo frio ou distópico.

A aplicação traduz essa ideia para um produto financeiro experimental: **menos fricção, menos intimidação e mais compreensão.**

## Status do projeto

- [x] Next.js + TypeScript
- [x] PrivyProvider
- [x] Login por e-mail
- [x] Embedded wallet Ethereum automática
- [x] Sepolia como única rede suportada
- [x] Consulta e atualização de saldo
- [x] Envio de ETH
- [x] Validações e revisão antes do envio
- [x] Receber com QR Code
- [x] Copiar e compartilhar endereço
- [x] Conversão BRL/USD
- [x] Cotação ETH
- [x] Gráfico real de 7 dias
- [x] Link Etherscan
- [x] Teste end-to-end com duas contas
- [x] Deploy na Vercel
- [ ] Prints/GIF da aplicação

---

**SUN Wallet**  
Sua carteira digital, sem complicação.
