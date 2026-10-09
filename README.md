# PERFESTUDIO · Fotografia Newborn

Website responsivo de apresentação e escolha de pacotes. HTML, CSS e JavaScript, sem dependências de execução ou etapa de build.

## Abrir localmente

Execute `npm run dev` e acesse `http://localhost:4173`. Para conferir a sintaxe, execute `npm run check`.

## Conteúdo e contato

- `dist/index.html`: textos, preços, itens dos pacotes, perguntas frequentes e metadados de compartilhamento.
- `dist/styles.css`: identidade visual e layout para celular e desktop.
- `dist/config.js`: WhatsApp em formato internacional, atualmente `5521920025877`.
- `dist/script.js`: mensagens com o pacote escolhido, menu mobile e comparação de pacotes.
- `dist/assets/newborn-hero.jpg`: imagem ilustrativa, identificada como tal no website. Substitua por uma fotografia autorizada do estúdio antes de divulgar como portfólio; ajuste também o texto alternativo e retire a legenda ilustrativa quando fizer essa substituição.

Os botões abrem uma conversa com o estúdio. A contratação e a reserva são confirmadas no WhatsApp. O website não processa pagamentos e não envia mensagens automaticamente.

## Publicação

A pasta `dist` pode ser hospedada em qualquer serviço de sites estáticos. A configuração do Sites é mantida em `.openai/hosting.json`. Não há formulário de coleta de dados nem cookies próprios de rastreamento. As fontes usam Google Fonts, com fontes locais de fallback.

## Imagem da proposta

Imagem produzida com a ferramenta integrada imagegen. Prompt: fotografia editorial vertical de recém-nascido dormindo com segurança em manta de linho marfim, luz natural suave, cores bege e taupe, textura realista, composição intimista, sem texto, marca ou adereços. O prompt completo está em `design-notes.md`.
