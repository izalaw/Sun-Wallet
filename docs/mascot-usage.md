# SUN Wallet — Guia de uso do mascote Friendly

Este documento define o sistema oficial do mascote da SUN Wallet para manter consistência entre produto, portfólio e materiais de comunicação.

## Princípio visual

O mascote é **Friendly**, simples e reconhecível. Ele deve transmitir proximidade sem parecer infantil.

### Olhos oficiais

- dois olhos ovais verticais;
- cor carvão `#2B2B2B`;
- acabamento fosco;
- sem brilho branco;
- sem pupilas;
- sem cílios;
- sem olhos grandes de estilo anime;
- não alterar tamanho ou distância entre os olhos entre estados equivalentes.

## Assets oficiais

### `sun-friendly-full.svg`
Versão completa principal.

**Usar em:**
- login;
- onboarding;
- boas-vindas;
- telas vazias;
- comunicação principal da marca.

### `sun-friendly-compact.svg`
Mesma identidade em proporção reduzida.

**Usar em:**
- cards;
- modais;
- áreas médias da interface;
- elementos auxiliares em que a versão principal ocuparia espaço demais.

### `sun-friendly-icon.svg`
Símbolo compacto do personagem.

**Usar em:**
- app icon;
- favicon;
- avatar;
- espaços muito pequenos;
- navegação que exija leitura imediata em tamanho reduzido.

Não usar esta versão como substituta do mascote completo em telas de destaque.

### `sun-friendly-success.svg`
Estado positivo do mesmo personagem, acompanhado de raios discretos.

**Usar em:**
- transação confirmada;
- carteira criada;
- ação concluída com sucesso.

Não usar como decoração permanente.

### `sun-friendly-loading.svg`
Estado de espera com indicador de três pontos.

**Usar em:**
- criação da carteira;
- confirmação de transação;
- carregamentos relevantes que precisam de contexto humano.

Para carregamentos muito curtos, preferir apenas um loader simples.

## Regras de consistência

1. Manter corpo, cor e olhos consistentes.
2. Não esticar ou distorcer o personagem.
3. Não substituir a cor principal por cores aleatórias.
4. Não adicionar boca, pupilas, acessórios ou expressões sem criar uma nova versão oficial.
5. Manter área de respiro em torno do mascote.
6. Evitar sombras excessivas, neon e estética cripto/cassino.
7. Em tamanhos muito pequenos, usar a versão `icon` em vez de reduzir a versão completa indefinidamente.

## Paleta do mascote

- amarelo claro: `#FFD95B`
- amarelo principal: `#F6C344`
- sombra solar: `#EAA82B`
- olhos: `#2B2B2B`
- verde de apoio em estados positivos: `#8FAE8D`

## Aplicação atual na SUN Wallet

- Login: `full`
- Header: `compact`
- Criando carteira: `loading`
- Modal de envio: `full`
- Modal de receber: `full`
- Confirmando transação: `loading`
- Transação concluída: `success`
- App icon / favicon: `icon`

## Arquivos

Todos ficam em:

`public/mascot/`

Esses arquivos são a fonte oficial para aplicação no produto.
