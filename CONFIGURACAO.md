# Configuração e manutenção

A configuração é código estático em `src/config/siteConfig.js`; não existe painel administrativo nem gravação remota. Toda mudança exige novo build. Não coloque segredos, senhas ou chaves de API nesse arquivo: ele é público no navegador.

| Campo | O que alterar |
|---|---|
| `demo` | Mantenha `true` durante a revisão comercial. Desative somente após substituir os exemplos. |
| `brand` | Nome, subtítulo, nome profissional, apresentação curta e logo local opcional. |
| `theme` | Cores principais, fundo e texto. As variáveis são aplicadas no carregamento do aplicativo. |
| `hero`, `about` | Título, fotografia, texto alternativo, história, especialidades e diferenciais. |
| `services` | Identificador único, nome, categoria, descrição, duração em minutos, preço de referência, preço atual e imagem. |
| `gallery` | Referências, legendas, categorias e descrições acessíveis. |
| `transformations` | Pares antes/depois e descrição honesta do material. Prefira fotos reais com pose, luz e enquadramento iguais. |
| `promotions` | Combos e condições verificadas; `validUntil` opcional no formato `AAAA-MM-DD`. |
| `reviews` | Nome, comentário, nota de 1 a 5 e data opcional; use somente avaliações autorizadas e reais fora da demonstração. |
| `features`, `faq`, `care` | Proposta de atendimento, respostas, guia de cuidados e protocolos reais. |
| `contact` | WhatsApp, Instagram, TikTok, email, endereço, cidade, horários, embed e URL de avaliações reais. |
| `seo` | Domínio HTTPS real, título e descrição. |
| `widget` | Texto e atraso do convite do WhatsApp. |

## Valores e promoções

Preços são números em reais: `175`, não `"R$ 175,00"`. O componente formata a moeda. O desconto é arredondado ao inteiro mais próximo: `(1 - price / original) × 100`. Economia é `original - price`, limitada a zero. Defina `original` igual a `price` para retirar o desconto de um serviço. Durações são estimativas; remova `duration` se não souber o tempo.

Todos os valores da entrega são demonstrativos. Não publique preços anteriores riscados sem verificar que eles representam uma referência comercial válida. O modo público não faz essa validação por você. Combos podem ter `services` com os IDs envolvidos; a descrição e o preço do combo continuam definidos explicitamente para permitir regras comerciais próprias.

Validades usam o calendário local do navegador. Ofertas vencidas não aparecem na página principal nem na bio. A validação final de valor e condições sempre ocorre com o estúdio; não existe backend de preços nem mecanismo antifraude comercial.

## WhatsApp e agenda

Exemplo de formato de número: `55` + DDD + número real do estúdio, sem espaços. O código aceita números brasileiros com 12 ou 13 dígitos no total. Não preencha um número fictício na produção.

A janela de agendamento compartilha o estado entre todos os CTAs. O resumo usa serviço, preço, nome opcional, data e período preferidos. As mensagens são codificadas com `encodeURIComponent`. Nenhum campo é enviado ao servidor do site nem salvo em localStorage. Ao abrir o WhatsApp, o texto é transmitido ao serviço externo; enviar a mensagem depende da ação da visitante.

A estrutura de `useBooking` e `BookingModal` pode receber um calendário real futuramente. Será necessário implementar disponibilidade no servidor, prevenção de conflitos e confirmação. Não transforme as preferências atuais em horários confirmados sem essa integração.

## Mídias e logo

Em serviços, galeria e promoções, o campo `image` é a chave do arquivo: `nude` resolve `/media/nude.webp`. Para imagens responsivas, mantenha também `/media/nude-thumb.webp` (256 px) e a imagem maior com aproximadamente 504 px. Se usar imagens maiores, atualize o descritor de largura no `srcset` de `ServiceCard.vue`. Fotografias do hero e da profissional aceitam caminhos completos em seus campos.

O logo tipográfico é local e não depende de uma imagem externa. Para usar seu logo, informe um arquivo em `brand.logo` e coloque-o em `public/`. Ajuste dimensões caso seu logo tenha outra proporção. Todos os textos alternativos devem descrever o conteúdo real da imagem.

## Mapa, redes e avaliações

`contact.mapEmbed` aceita somente uma URL HTTPS de Google Maps em `www.google.com` ou `maps.google.com`, caminho iniciado por `/maps`. Cole apenas o valor de `src` fornecido no compartilhamento do Google, sem copiar o HTML do iframe. O mapa carrega depois de a visitante solicitar. Sem embed, exibe-se uma mensagem clara; sem endereço, não se cria rota inventada.

`contact.reviewsUrl` é o link real para suas avaliações. Não há coleta automática nem scraping. Uma integração futura com Google Places precisa de backend, configuração de chave, atribuições e respeito às regras vigentes da API. Não inclua chave secreta no frontend.

## SEO e publicação

Enquanto `demo: true` ou sem domínio em `seo.url`, o build usa `noindex, nofollow`, `robots.txt` com bloqueio e sitemap vazio. Isso é intencional. Em modo público com domínio real, gera canonical, Open Graph, sitemap e dados `NailSalon`, sem nota agregada ou credenciais fictícias. O build exige telefone e endereço antes de ativar SEO público.

As fontes são hospedadas localmente. As únicas integrações externas potenciais são os canais configurados, o mapa sob demanda e o VLibras quando ativado. A leitura em voz alta depende das vozes disponíveis no navegador/sistema. Avalie os avisos de privacidade necessários conforme os serviços que você efetivamente configurar.
