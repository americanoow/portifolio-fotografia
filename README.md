# PERFESTUDIO · Fotografia Newborn

Website responsivo de apresentação e escolha de pacotes. HTML, CSS e JavaScript, sem dependências de execução ou etapa de build.

## Abrir localmente

Execute `npm run dev` e acesse `http://localhost:4173`. Para conferir a sintaxe, execute `npm run check`.

## Conteúdo e contato

- `dist/index.html`: textos, preços, itens dos pacotes, portfólio, ensaios de temporada, perguntas frequentes e metadados de compartilhamento.
- `dist/styles.css`: identidade Terracota Editorial em versão portfólio, tokens de cores e layout para celular e desktop.
- `dist/config.js`: WhatsApp em formato internacional, atualmente `5521920025877`, lista de fotografias e intervalo do carrossel.
- `dist/script.js`: mensagens com o pacote escolhido, menu mobile, comparação de pacotes, carrossel, visualizador de fotos e sombra do cabeçalho fixo.
- `dist/assets/1.jpg` a `dist/assets/5.jpg`: fotografias fornecidas pelo estúdio, exibidas na ordem numérica no carrossel inicial e também no portfólio (1, 3 e 2) e na seção de temporada (4 e 5).
- `dist/assets/logo.svg`, `favicon.svg` e `apple-touch-icon.png`: logo P&B em vetor (completo, ícone da aba e ícone do iPhone/iPad).
- `dist/assets/feed-1.jpg` a `feed-4.jpg`: fotos das publicações do Instagram mostradas no feed.

Os botões abrem uma conversa com o estúdio. A contratação e a reserva são confirmadas no WhatsApp. O website não processa pagamentos e não envia mensagens automaticamente.

## Publicação

A pasta `dist` pode ser hospedada em qualquer serviço de sites estáticos. A configuração do Sites é mantida em `.openai/hosting.json`. Não há formulário de coleta de dados nem cookies próprios de rastreamento. As fontes usam Google Fonts, com fontes locais de fallback.

## Fotografias do carrossel

Adicione suas imagens em `dist/assets/`. Configure cada imagem em `heroPhotos` no arquivo `dist/config.js`:

```js
{ src: 'assets/1.jpg', alt: 'Descrição da fotografia', position: '50% 50%' }
```

`src` usa o caminho relativo à página, sem `dist/`. `alt` descreve a fotografia para leitores de tela. `position` ajusta o enquadramento na moldura. Você pode trocar os arquivos mantendo os mesmos nomes ou adicionar/remover itens da lista.

O carrossel troca as fotos a cada 5 segundos (`carouselInterval: 5000`) com uma dissolução de 1,2 segundo. Os controles abaixo da foto permitem selecionar uma imagem e pausar/retomar. Ele interrompe temporariamente o avanço durante interação, quando está fora de vista e quando a aba fica oculta. Com `prefers-reduced-motion`, inicia pausado e sem animações.

Fotos que não carregam são ignoradas. Uma lista vazia ou indisponibilidade de todas as fotos mostra um placeholder discreto, sem ícone de imagem quebrada. Nenhuma imagem externa ou gerada por IA integra esta versão.

Ao trocar a primeira fotografia, atualize também a imagem inicial no HTML e a referência `og:image` em `dist/index.html`, para manter a apresentação sem JavaScript e a prévia de compartilhamento coerentes.

## Portfólio e temporada

As fotos do portfólio (`.gallery`) e da temporada (`.season-photos`) ficam diretamente em `dist/index.html`. Cada uma é um link para o próprio arquivo: com JavaScript, abre o visualizador com setas, contador, teclado (← →) e Esc; sem JavaScript, abre a imagem. Para trocar uma foto, altere o `href` do link e o `src`/`alt` da imagem; o estilo `--pos` ajusta o enquadramento no recorte. A chamada final usa `assets/2.jpg` como fundo, definida em `.contact-section` no CSS.

## Logo P&B

O logo foi vetorizado a partir do PNG do estúdio, um `<path>` por elemento (P, &, B, duas linhas, estrela e o texto), e fica em `<defs>` no início do `dist/index.html`. O cabeçalho usa a marca compacta e o rodapé e a chamada final usam o logo completo, sempre com `<use>`, então a cor vem de `--logo-ink` e `--logo-accent` no CSS (`.pb-logo`). Interações: na entrada as letras sobem, o "&" gira e a estrela abre; ao passar o mouse ou focar na marca, o "&" e a estrela giram; o logo grande da chamada final acompanha o ponteiro e o "&" dá uma volta a cada clique ou toque. Com `prefers-reduced-motion`, fica parado.

## Instagram

O perfil `@pebestudiofotografico` está linkado no feed, na chamada final, no rodapé e no menu. O feed (`#instagram`) tem 4 publicações com curtir, comentar e compartilhar:

- **Curtir** (coração ou duplo clique na foto) soma 1 ao número, mas fica salvo só no aparelho do visitante (`localStorage`). Não curte no Instagram de verdade, e a página avisa isso.
- **Comentar** e o ícone do Instagram abrem a publicação, onde o comentário vale de fato.
- **Compartilhar** usa o menu de compartilhar do aparelho ou copia o link.

As curtidas, os comentários, as legendas e as datas foram copiados do Instagram em 08/10/2026 e estão fixos no HTML (`data-likes` e o texto "Ver o comentário"). Para atualizar, edite esses valores. Para trocar uma publicação, altere `data-post`, `data-url`, os links, o `alt` e a foto `assets/feed-N.jpg`. As fotos atuais são as miniaturas de 640 px que o Instagram entrega, e duas delas vêm com recorte quadrado automático; para mais qualidade, substitua os arquivos `feed-N.jpg` por originais quadrados (1080 px).

## Validação e publicação

O projeto permanece em HTML/CSS/JavaScript e não tem etapa de build; `dist/` já é a saída estática. Use `npm run check` para verificar os scripts e `npm run dev` para revisar em um navegador. Esta atualização é local; não publicar nem alterar configurações de produção sem aprovação do proprietário.
