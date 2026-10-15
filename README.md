# Luna Nails — Studio de Unhas

Projeto completo em Vue 3, reconstruído a partir do ZIP fornecido. A direção visual segue a referência enviada: creme, rosé, fotografia em destaque, títulos editoriais e uma Link na Bio própria. **Luna Nails e Luna são identidades demonstrativas editáveis.**

## Revisão 1.1 — navegação compacta

- Link na Bio agora aparece diretamente no cabeçalho, no menu e em um destaque na Home.
- A bio abre por `/links`, `/linkbio`, `/bio`, `/links.html` e `/linkbio.html`. O build inclui também os arquivos HTML e as pastas independentes da bio.
- Catálogo com três serviços por página no desktop e dois no celular, busca sem acentos e reinício de página ao trocar o filtro. No celular, os cards são horizontais e compactos; o botão Escolher mostra detalhes no agendamento.
- Galeria com quatro fotos por página, lightbox e navegação pelo conjunto completo.
- Ofertas em slider no celular, com deslize, setas, posição e navegação por teclado. Depoimentos continuam deslizáveis.
- Bio com abas Serviços, Portfólio, Ofertas e Avaliações, incluindo teclado e um único painel visível por vez.
- Apresentação curta e história expansível. Blocos redundantes foram retirados, mantendo as informações acessíveis.
- CSS reorganizado, imagens e espaçamentos menores no mobile, menu de tela inteira e barra de fechar fixa dentro dos diálogos.
- Fechar ou desmontar uma janela libera a rolagem. A inicialização espera a rota antes de montar o aplicativo, preservando o HTML enquanto o código carrega.

**Para atualizar uma publicação existente:** substitua o projeto anterior completo por esta versão e faça um novo deploy. Não misture os arquivos `dist/assets` de builds diferentes. Depois do deploy, abra `/links` diretamente e atualize a página para conferir o roteamento.

## Começar

Instale Node.js 22.12+ ou Node.js 24 LTS e abra um terminal nesta pasta:

```bash
npm ci
npm run dev
```

Abra a URL exibida no terminal. A página principal fica em `/` e a Link na Bio em `/links`. `/bio`, `/linkbio` e os antigos hashes de bio são compatíveis. Não abra `index.html` com duplo clique: o projeto usa módulos e rotas que precisam de um servidor HTTP.

```bash
npm test        # regras comerciais e interações dos componentes
npm run build   # build, pré-renderização de / e /links e SEO
npm run check   # mídias, páginas, seções e arquivos de produção
npm run preview # examinar o build local
```

O ZIP já inclui `dist/`, mas você deve gerar o build novamente depois de qualquer alteração de dados ou de código. Não precisa instalar um backend nem configurar variáveis de ambiente para esta versão.

## O que está incluído

- Home com apresentação da profissional, 9 serviços, categorias e busca.
- Preços centralizados, desconto percentual e economia calculados.
- Agendamento em janela nativa: serviço, nome opcional, preferência de data/período, resumo e link para o WhatsApp.
- Galeria com 7 categorias, lightbox, setas, navegação por teclado e gesto horizontal.
- Dois exemplos de comparação antes/depois por controle de intervalo nativo.
- Combos, ofertas com validade opcional e depoimentos demonstrativos em faixa deslizante.
- Diferenciais, FAQ pesquisável e guia de cuidados com checklist e download TXT.
- Localização configurável, mapa sob demanda, redes sociais e acesso à bio.
- Link na Bio com composição exclusiva, serviços, combo, referências, depoimento e compartilhar/copiar link.
- WhatsApp flutuante à direita; convite no máximo uma vez por sessão.
- Acessibilidade à esquerda: fonte de 100% a 200%, contraste, destaque de links, espaçamento, controle de movimento, leitura em voz alta e VLibras sob demanda.
- Fontes locais, fotografias WebP, rotas sob demanda e HTML pré-renderizado.

## Antes de publicar para clientes

Edite **`src/config/siteConfig.js`**. O estúdio está deliberadamente em `demo: true`, com telefone, redes, endereço e horários em branco. Todos os preços, descontos, durações, retrato, transformações e depoimentos são exemplos.

1. Substitua nome, logo, profissional, apresentação e diferenciais pelas informações reais.
2. Configure `contact.whatsapp` com **55 + DDD + número**, somente dígitos, sem `+`, espaços ou pontuação. O número não é coletado de visitantes.
3. Preencha Instagram, endereço, cidade, horários, mapa e avaliações reais, se disponíveis.
4. Valide serviços, preços anteriores, preços atuais, durações, condições e políticas. Remova as ofertas que não tiverem sido verificadas.
5. Troque as fotos e simulações por material autorizado do estúdio. Substitua os depoimentos por comentários reais autorizados ou remova a lista.
6. Configure `seo.url` com o domínio HTTPS real. Só depois da revisão altere `demo` para `false`.
7. Gere o build novamente e faça a revisão em navegador descrita em `ANALISE-E-VALIDACAO.md`.

Sem telefone válido, nenhum botão envia mensagem a um destinatário fictício: ele abre o fluxo demonstrativo e permite copiar o exemplo. Com telefone configurado, os links `wa.me` abrem o WhatsApp com o texto pronto; a visitante ainda precisa enviá-lo. **Não há reserva automática, confirmação de horário, pagamento ou disponibilidade de agenda nesta versão.**

## Publicar na Vercel

1. Extraia o ZIP e envie o conteúdo desta pasta a um repositório Git de sua conta. Não envie `node_modules/`.
2. Na Vercel, escolha **Add New → Project** e importe esse repositório.
3. Se o repositório contiver outras pastas, selecione esta pasta como **Root Directory**.
4. Use **Framework Preset: Vite**, **Install Command: `npm ci`**, **Build Command: `npm run build`**, **Output Directory: `dist`** e Node.js 22 ou 24.
5. Publique e confira a página inicial e a URL direta `/links`, inclusive após atualizar o navegador.
6. Depois de conectar seu domínio, ajuste `seo.url` e publique novamente.

O `vercel.json` já fornece o destino das rotas, cache de arquivos e cabeçalhos básicos. A implantação na Vercel não foi feita nesta entrega; nenhum acesso à sua conta foi necessário. Referências oficiais: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite), [configuração de build](https://vercel.com/docs/builds/configure-a-build) e [deploy estático do Vite](https://vite.dev/guide/static-deploy).

## Organização

```text
src/config/siteConfig.js   dados, preços, textos, contatos e mídia
src/utils/booking.js       moeda, descontos, data local e mensagens
src/composables/           estado de agendamento e observador de animações
src/components/            funções e seções reutilizáveis
src/views/                 Home, Links e página não encontrada
src/entry-server.js        renderização estática usada no build
src/style.css              sistema visual e adaptações responsivas
public/media/              fotografias locais e miniaturas
scripts/                   pré-renderização/SEO e verificação de arquivos
tests/                     regras e interações em DOM simulado
dist/                      build de produção pronto para servidor HTTP
```

Leia também `CONFIGURACAO.md`, `ANALISE-E-VALIDACAO.md` e `MIDIAS.md`.
