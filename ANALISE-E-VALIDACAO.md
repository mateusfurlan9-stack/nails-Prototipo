# Análise do original e validação da entrega

## Projeto recebido

O ZIP original continha 81 arquivos, cerca de 39 MB descompactados. Era um projeto Vue 3 com Vite 6, Vuetify, GSAP, Leaflet, Swiper, ícones MDI, Pinia e plugins de geração automática de rotas/importações. O ponto de entrada montava diretamente o App, enquanto o App fazia navegação manual por hash. Havia ainda uma configuração de router automático que não era utilizada pelo ponto de entrada.

A interface estava distribuída em site institucional, cabeçalho, serviços ao cliente, equipe, perfis, mapa, rodapé, Link na Bio e acessibilidade. Os recursos relevantes incluíam busca, FAQ, preparação de mensagem WhatsApp, preferência de agendamento, checklist baixável, compartilhamento da bio, carrossel, leitura em voz alta, contraste, ajuste de fonte e VLibras.

Foram identificados contatos/endereço de exemplo, link de agenda alheio à nova operação, depoimentos sem marcação de demonstração, imagens/logos jurídicos e vídeo de aproximadamente 14 MB. O mapa montava um popup HTML diretamente com valores de configuração, o que seria um risco de injeção caso futuramente esses valores viessem de conteúdo não confiável. Isso não significa que tenha sido encontrada uma exploração no site original. Não foi executada auditoria de dependências da versão antiga.

## Decisões de implementação

- Vue 3 e Vite foram mantidos. A entrada, o router e os componentes foram reorganizados para uma única navegação coerente.
- Vue Router fornece `/`, `/links`, aliases e página não encontrada. As duas páginas principais são carregadas em chunks separados e pré-renderizadas no build.
- Vuetify, Pinia, Leaflet, Swiper, MDI e os plugins automáticos saíram do projeto novo porque suas funções não exigem essas bibliotecas aqui. Não há estado global complexo que justifique Pinia; somente o agendamento compartilha dois refs.
- O movimento usa CSS e Intersection Observer, com desconexão no unmount, preferência do sistema e controle manual. Não há parallax pesado nem dependência de GSAP para revelar conteúdo simples.
- O fluxo de preparação e revisão de mensagem foi preservado e adaptado a serviço, preço e preferências. Os checklists jurídicos viraram guia de cuidados; busca em FAQ e compartilhamento da bio continuam presentes.
- O widget de acessibilidade preserva as funções de leitura e carregamento do VLibras do original, com nova interface em dialog nativo. Os controles de fonte alcançam 200%.
- Menus, agendamento e lightbox usam dialog nativo, Escape e devolução de foco. O navegador provê contenção de foco e fundo inerte; esse comportamento precisa de teste em navegadores reais.
- O comparador é um range nativo com valor acessível e teclado. Depoimentos usam scroll-snap e controles, sem reprodução automática.
- O mapa agora usa embed validado por origem, sem montagem de HTML a partir de dados configuráveis. Campos do visitante são renderizados como texto, sem `v-html`.
- As imagens jurídicas e os vídeos foram removidos da entrega. As novas mídias são locais, geradas e identificadas como demonstrações.

## Verificações executadas

Ambiente: Node.js 24.19.0, npm 11.9.0, Linux. Versões instaladas estão no package-lock.json. Vue 3.5.44, Vue Router 5.4.0, Vite 8.3.4 e plugin-vue 6.0.10 foram resolvidos como versões estáveis pelo registro npm. A combinação compilou sem erros. As fontes Cormorant Garamond e DM Sans estão empacotadas localmente.

| Verificação | Resultado |
|---|---|
| Regras de desconto, economia, moeda, validação de telefone e mensagens | Testes automatizados em Node |
| Filtros/busca de serviços e estado vazio | Testes de componentes em jsdom |
| Detalhes, preferências, resumo e proteção sem telefone | Testes de componentes em jsdom |
| Geração de link WhatsApp com telefone de teste | Verificada sem abrir WhatsApp nem enviar mensagens |
| Filtro de galeria, ampliar, navegar, gesto e evento de cancelamento | Testes de componentes em jsdom |
| Range antes/depois e troca de pares | Testes de componentes em jsdom |
| Menu mobile, Link na Bio e CTAs de agendamento | Testes de componentes em jsdom |
| Fonte, contraste, movimento e restauração | Testes de componentes em jsdom |
| Convite uma vez por sessão e fechamento | Testes de componentes em jsdom |
| Mapa inválido, mapa sob demanda e ofertas expiradas | Testes de componentes em jsdom |
| Carrossel de depoimentos e identificação fictícia | Testes de componentes em jsdom |
| Build e pré-renderização | Compilação efetiva de produção |
| Mídias, seções, metadados, chunks e remoção da identidade jurídica do HTML | Verificação estática do build |
| Auditoria de dependências | `npm audit`: nenhuma vulnerabilidade conhecida reportada no momento da verificação |

O relatório de saída `qa-resultados.txt` registra a última execução dos comandos. Testes em jsdom verificam estado e eventos de componentes; não medem layout, gestos nativos, foco nativo ou comportamento de leitor de tela.

## Validações que ainda precisam de navegador real

O ambiente desta entrega não disponibiliza a capacidade de navegador exigida pelo fluxo de QA. Portanto não foram executados screenshots da interface, medições de Lighthouse, Core Web Vitals, inspeção visual em larguras reais nem monitoramento do console durante navegação real. Nenhuma pontuação 90+, conformidade WCAG integral ou ausência de erro em todo navegador é declarada.

O CSS inclui ajustes para telas abaixo de 360 px, até 650, 950, 1150 e acima de 1440 px. Isso representa a implementação das adaptações; não substitui a verificação visual.

Antes da publicação comercial, executar:

1. Em 320, 375, 390, 768, 1024 e 1440 px: verificar enquadramento, altura dos cards, quebra dos títulos e ausência de rolagem horizontal. Repetir com zoom e fonte a 200%.
2. Abrir `/` e `/links` diretamente e atualizar cada URL na Vercel. Conferir aliases e a página não encontrada.
3. Navegar com Tab/Shift+Tab/Escape e setas nos diálogos e no range; testar VoiceOver ou NVDA, foco de retorno e todos os campos.
4. Conferir filtros, busca, fotos, arraste de comparação, swipe de lightbox e rolagem de depoimentos em iOS e Android.
5. Testar o número real no WhatsApp de celular e desktop e revisar integralmente a mensagem antes de enviar. Os testes não enviaram mensagens reais.
6. Ativar e desativar o movimento pelo sistema e pelo menu. Conferir alto contraste em todas as seções e na bio.
7. Testar VLibras, leitura em voz alta, mapa e compartilhar/copiar em navegadores compatíveis e em contexto HTTPS. As integrações externas dependem de rede e não foram carregadas nos testes.
8. Em Chrome, executar Lighthouse em produção no perfil mobile para Performance, Acessibilidade, Boas Práticas e SEO. Registrar os valores reais e corrigir os pontos encontrados; não tomar o tamanho do bundle como pontuação de desempenho.
9. Conferir console e aba Network, títulos, descrições, canonical, Open Graph e sitemap após ativar o domínio e os dados reais.

## Evolução futura

O estado de agendamento e os dados de configuração estão separados da interface, permitindo trocar a origem por uma API/painel real. Não foram criados login falso, reserva simulada, avaliações Google inventadas, checkout, newsletters sem backend nem painel que aparenta salvar alterações.
