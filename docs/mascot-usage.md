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

## Mapa oficial de estados

| Situação | Estado | Asset |
| --- | --- | --- |
| Login, dashboard e contexto neutro | normal | `sun-friendly-full.webp` |
| Header e espaços pequenos | compacto | `sun-friendly-compact.webp` |
| Preenchimento do envio | normal | `sun-friendly-full.webp` |
| Revisão antes de enviar | normal | `sun-friendly-full.webp` |
| Confirmando a transação | loading | `sun-friendly-loading.webp` |
| Transação concluída | feliz / success | `sun-friendly-success.webp` |
| Endereço inválido | pensando | `sun-friendly-loading.webp` |
| Envio para a própria carteira | pensando | `sun-friendly-loading.webp` |
| Valor inválido ou zero | pensando | `sun-friendly-loading.webp` |
| Saldo insuficiente | pensando | `sun-friendly-loading.webp` |
| Transação cancelada ou falhou | pensando | `sun-friendly-loading.webp` |
| Criação da carteira em andamento | loading | `sun-friendly-loading.webp` |
| App icon / favicon | icon | `sun-friendly-icon.webp` |

## Linguagem emocional

- **Normal:** a SUN está disponível e neutra.
- **Loading:** algo está acontecendo e o usuário só precisa aguardar.
- **Feliz:** a ação terminou corretamente.
- **Pensando:** algo precisa ser revisto; a interface deve orientar, não alarmar.

O estado **pensando** é propositalmente amigável. Ele não deve usar ícones de erro agressivos, vermelho excessivo ou expressão triste.

## Assets oficiais

### `sun-friendly-full.webp`
Versão completa principal.

Usar em login, onboarding, boas-vindas, revisão e comunicação principal da marca.

### `sun-friendly-compact.webp`
Mesma identidade em proporção reduzida.

Usar no header, cards pequenos e elementos auxiliares.

### `sun-friendly-icon.webp`
Símbolo compacto.

Usar em app icon, favicon e espaços muito pequenos.

### `sun-friendly-success.webp`
Estado feliz.

Usar somente quando uma ação foi concluída com sucesso, especialmente após a confirmação de uma transação.

### `sun-friendly-loading.webp`
Estado com indicador de espera/pensamento.

Usar como **loading** enquanto a aplicação processa algo e como **thinking** quando existe um problema que o usuário precisa corrigir.

## Regras de consistência

1. Manter corpo, cor e olhos consistentes.
2. Não esticar ou distorcer o personagem.
3. Não substituir a cor principal por cores aleatórias.
4. Não adicionar boca, pupilas ou acessórios sem criar uma nova versão oficial.
5. Manter área de respiro em torno do mascote.
6. Evitar sombras excessivas, neon e estética cripto/cassino.
7. Em tamanhos muito pequenos, usar a versão `icon`.
8. Erros devem parecer orientativos, não punitivos.

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
- Modal de envio sem erro: `full`
- Modal de envio com erro: `thinking`
- Revisão: `full`
- Confirmando transação: `loading`
- Transação concluída: `success`
- Modal de receber: `full`
- App icon / favicon: `icon`

## Arquivos

Todos ficam em:

`public/mascot/`

Esses arquivos são a fonte oficial para aplicação no produto.
