# Especificação Técnica — Redesign do Site Institucional e Catálogo Digital
## Tintas Maestria (tintasmaestria.com.br)

| Campo | Valor |
|---|---|
| Versão | 1.0 |
| Data | 15/09/2026 |
| Status | Para revisão |
| Escopo | Diagnóstico, IA, Design System, wireframes, stack, SEO, performance e plano de implementação |
| Base da análise | Inspeção direta do site em produção (home, `/categoria/tintas-decorativas/`, `/produtos/formula-decosinal-amarelo/`) em 15/09/2026 |

---

## Sumário

0. [Resumo executivo](#0-resumo-executivo)
1. [Diagnóstico e Arquitetura de Informação](#1-diagnóstico-e-arquitetura-de-informação)
2. [Design System e Identidade Visual (Tokens)](#2-design-system-e-identidade-visual)
3. [Wireframes Textuais das Páginas-Chave](#3-wireframes-textuais-das-páginas-chave)
4. [Stack Tecnológica e Performance](#4-stack-tecnológica-e-performance)
5. [Plano de Implementação](#5-plano-de-implementação)
6. [Critérios de Aceitação Globais](#6-critérios-de-aceitação-globais)
- [Anexo A — Contratos de dados](#anexo-a--contratos-de-dados)
- [Anexo B — Fórmula da calculadora de rendimento](#anexo-b--fórmula-da-calculadora-de-rendimento)
- [Anexo C — Mapa de eventos de analytics](#anexo-c--mapa-de-eventos-de-analytics)

---

## 0. Resumo executivo

- O site atual é um WordPress institucional com catálogo de ~40 SKUs em 6 linhas (Decorativas, Demarcação Viária, Demarcação de Grama, Pisos Industriais, Anticorrosivas, Revestimentos). A conversão se resume a um formulário genérico de orçamento e um botão flutuante de WhatsApp sem contexto de produto.
- Falhas estruturais centrais: nenhuma navegação por atributos de produto (ambiente, superfície, acabamento, litragem); FISPQ atrás de formulário (fricção inaceitável para o público profissional); cartela de cores inexistente como entidade de navegação; mapa global de distribuidores sem busca por cidade; sem calculadora de rendimento; sem dados estruturados; `<title>` vazio em home e PDP.
- Proposta: **Next.js 15 (App Router, SSG/ISR) + Tailwind CSS v4 + Sanity (CMS headless) + Postgres (leads, lojas) + Meilisearch**, design system com tokens auditáveis contra WCAG 2.1 AA, SEO técnico com `schema.org` completo (Product, BreadcrumbList, LocalBusiness, FAQPage) e orçamentos de Core Web Vitals aplicados em CI.
- Três fluxos prioritários: (1) B2C — calcular quantidade e localizar revenda; (2) Profissional — FISPQ/BT em download direto; (3) B2B — cotação de atacado e representação comercial.
- Duração: **14 semanas até o go-live** + janela de 30 dias de otimização guiada por KPIs.
- KPIs-alvo: conversão de cotação, downloads de FISPQ, conclusão da calculadora (≥40% das iniciadas), LCP/CLS/INP p75 no verde (CrUX/RUM).

---

## 1. Diagnóstico e Arquitetura de Informação

### 1.1 Modelo de negócio e segmentos

Atendimento híbrido com três segmentos e jobs distintos no site:

| Segmento | Quem | Jobs principais no site | Situação atual | CTA principal pós-redesign |
|---|---|---|---|---|
| **B2C — consumidor residencial** | Proprietário, pequena obra | Calcular quantidade de tinta, escolher cor, localizar revendedor | WhatsApp flutuante global + form de orçamento sem contexto de produto | "Calcular quantidade" → "Onde comprar" / WhatsApp com SKU e volume |
| **Profissional** | Pintor, especificador, engenheiro | Validar especificação (rendimento, secagem, diluição), obter FISPQ/BT, assistência técnica | FISPQ exige formulário; BT em PDF mas sem tabela estruturada de specs; Decosinal descrito como "para demarcação de estacionamentos" dentro da categoria Decorativas | Download direto de BT/FISPQ + form de assistência técnica com produto pré-preenchido |
| **B2B — revenda / construção / indústria** | Lojista, construtora, contratante industrial | Cotação de atacado, catálogo completo, representação comercial, amostras | Canal inexistente; "onde estamos" lista distribuidores globais sem busca e sem página de revenda | `/b2b/cotacao-atacado` e `/b2b/representacao` com SLA de resposta declarado |

**Linhas de produto reais (evidenciadas no catálogo atual):** Decorativas (FORMULA), Demarcação Viária (AXION), Demarcação de Grama/Esportes (STADIUM), Pisos Industriais (SOLS), Anticorrosivas (JULIEN), Revestimentos (CREPI). O texto institucional menciona "tintas hospitalares" como segmento de aplicação.

Mapeamento para a classificação solicitada:

| Grupo pedido | Mapeamento real | Observação |
|---|---|---|
| Imobiliária | Decorativas + Revestimentos | Cobertura residencial/comercial |
| Industrial | Pisos Industriais + Anticorrosivas | MAN, galpões, manutenção |
| Automotiva | **Não existe linha automotiva no catálogo** | AXION é demarcação viária, não automotiva. Não criar categoria vazia |
| Especial | Demarcação Viária + Demarcação Grama + Hospitalar | Aplicações reguladas/altas exigências |

### 1.2 Diagnóstico do estado atual (com evidência)

| ID | Área | Achado (evidência) | Severidade | Impacto | Correção |
|---|---|---|---|---|---|
| D01 | SEO | `<title>` vazio em home e PDP; sem meta description estruturada | Crítica | Desindexação parcial, CTR baixo em SERP | Templates de title/desc por página (item 4.3) |
| D02 | Catálogo | `/categoria/tintas-decorativas/`: grade plana, 0 filtros, card com apenas nome + "Mais detalhes" | Crítica | Usuário não filtra por ambiente/superfície/acabamento/litragem; abandono | Facets + card com dados técnicos (seções 2.5.1, 3.2) |
| D03 | Profissional | "Solicitar FISQP" abre formulário; o PDF não é baixável diretamente | Crítica | Friction nos 3 fluxos profissionais; perda de leads qualificados | Download direto + captura progressiva opcional (item 3.3 P07) |
| D04 | PDP | Sem tabela de especificações (rendimento, secagem, diluição, demãos); texto literal "Produto não classificado"; sem litragens (1L/3.6L/18L); sem preço | Crítica | PDP não sustenta decisão de compra nem especificação | Contrato de dados obrigatório por produto (2.6) + spec table (P06) |
| D05 | Dados | `FORMULA DECOSINAL` está em Decorativas, mas a descrição diz "tinta acrílica a base de solvente ... para demarcação de estacionamentos" | Alta | Categoria errada = funil B2C mostrando produto industrial; confiança | Auditoria de categorias em P0 (item 5); campo `line` obrigatório no CMS |
| D06 | Cores | "Cores prontas" como lista de imagens por produto; sem código/hex/LRV; sem cartela global; texto morto "NÃO DISPONÍVEL NO SISTEMA TINTOMÉTRICO" | Alta | Cor — principal gatilho de compra B2C — não é navegável | Entidade `Color` + `/cores` + seletor em PDP (2.5.2, 3.4) |
| D07 | Lojas | "Onde estamos": mapa Leaflet com pins estáticos globais, sem busca por cidade/CEP; tiles carregadas via **http://** (mixed content) | Alta | B2C não acha revenda; erro de segurança/performance | `/onde-comprar` com busca geográfica + tiles auto-hospedadas https (3.4, 4.2) |
| D08 | Home | Hero em carrossel com 5 banners (LCP degradado, UX imprevisível); linhas de produto em tabs abaixo da dobra | Alta | LCP > 4s provável; primeira dobra sem CTA de ação | Hero estático com 1 CTA primário + seletor de linhas (3.1) |
| D09 | Conteúdo | Slugs com cor embutida (`/produtos/formula-decosinal-amarelo/`) gerando páginas duplicadas por cor; bloco "Descrição do produto" repetido 2× na PDP | Alta | Duplicate content; risco de desindexação | Slug por produto + cor como variante (`?cor=`); 301s (4.3) |
| D10 | Conversão | Único CTA "Solicitar orçamento" em toda a jornada; WhatsApp apenas flutuante, sem pré-preenchimento de produto/quantidade | Alta | Lead genérico, sem contexto → baixa taxa de fechamento | CTA segmentado por página + `wa.me` com SKU/volume (3.x, 4.2) |
| D11 | Calculadora | Ausência de simulador de rendimento (area → demãos → embalagens) | Alta | Job #1 do B2C/profissional sem ferramenta; pesquisa migra para concorrentes | Calculadora como componente obrigatório (2.5.3) |
| D12 | SEO técnico | Sem schema.org (Product, BreadcrumbList, LocalBusiness), sem breadcrumbs visíveis, sem OG image gerada por produto | Alta | Rich results inexistentes; CTR social/serp abaixo | Bloco 4.3 integral |
| D13 | LGPD | Cookie banner genérico (template GDPR) sem política de privacidade localizada, sem consent mode para analytics | Média | Risco regulatório (LGPD) + tracking inelegível | Política `/lgpd` + consent v2 (4.2) |
| D14 | Assets | Imagens de uploads/2020, placeholders 350×350 nos carrosséis, alts ausentes, sem padrão de litragem nas fotos | Média | Percepção de desatualização; SEO de imagens inexistente | Política de assets (4.4) + fotos de lata por litragem |
| D15 | Busca | Sem busca de produtos/cores/documentos | Média | Catálogo cresce e a navegação linear não escala | Meilisearch (4.2) |
| D16 | B2B | Sem página de revenda/representação, sem cotação de atacado segmentada | Média | Canal B2B orquestrado fora do site (telefone) | `/b2b` com 3 subfuns (1.5, 3.4) |
| D17 | Plataforma | WordPress monolítico com plugins (cookie, mapa, carrossel); sem CI, sem orçamento de performance, sem infraestrutura de A/B | Estrutural | Tech debt; velocidade de iteração limitada | Migração para stack SSG/ISR com CI + Lighthouse CI (4.x, 5) |

### 1.3 Sitemap recomendado

```
/                                        Home
├── /produtos                            Índice de linhas (6 cards) + busca
│   ├── /produtos/tintas-decorativas     Linha: residencial/comercial
│   │   ├── /produtos/tintas-decorativas/acrilicas
│   │   ├── /produtos/tintas-decorativas/texturas
│   │   ├── /produtos/tintas-decorativas/esmaltes-sinteticos
│   │   ├── /produtos/tintas-decorativas/seladores-primers
│   │   └── /produtos/tintas-decorativas/vernizes
│   ├── /produtos/demarcacao-viaria
│   ├── /produtos/demarcacao-esportes
│   ├── /produtos/pisos-industriais
│   ├── /produtos/tintas-anticorrosivas
│   ├── /produtos/revestimentos
│   └── /produtos/[slug]                 PDP (cor = variante, não página)
├── /cores                               Cartela global (filtros: família, LRV, produto)
│   └── /cores/[codigo]                  Detalhe da cor (preview + produtos compatíveis)
├── /calculadora                         Calculadora de rendimento (autônoma + embutida em PDP)
├── /onde-comprar                        Localização de revendedores (busca cidade/CEP/UF)
│   └── /onde-comprar/[slug]             Detalhe da loja
├── /b2b                                 Canal profissional (hub)
│   ├── /b2b/cotacao-atacado
│   ├── /b2b/representacao               Tornar-se revendedor
│   ├── /b2b/assistencia-tecnica
│   └── /b2b/documentos                  Hub de BT/FISPQ por produto/marca
├── /institucional
│   ├── /a-maestria
│   ├── /cases
│   └── /imprensa                        (opcional, fase 2)
├── /contato
└── /lgpd                                Privacidade, cookies, DPO
```

| Rota | Template | Renderização | Fonte de dados | Nota |
|---|---|---|---|---|
| `/` | Home | SSG + ISR (revalidação 3600s) | Sanity | LCP image priority |
| `/produtos/[linha]` (+ sublinhas) | Category | SSG | Sanity + Postgres (contagem) | Facets via query string |
| `/produtos/[slug]` | PDP | SSG (revalidação por webhook Sanity) | Sanity + PDFs em S3 | Cor por `?cor=` |
| `/cores`, `/cores/[codigo]` | Collection / Detail | SSG | Sanity (`Color`) | Preview de cena pré-renderizada |
| `/calculadora` | App | CSR | Static (consumo por produto do CMS) | Debounce, sem rede |
| `/onde-comprar` | App | CSR + API | Postgres (lojas) | Geo-busca p95 < 300ms |
| `/b2b/*` | Forms | SSG + API | Postgres (`leads`) | Webhook CRM |
| `/a-maestria`, `/cases`, `/contato` | CMS page | SSG | Sanity (Portable Text) | — |

### 1.4 Navegação

**Header (desktop):** `Logo | Produtos ▾ | Cores | Calculadora | Onde Comprar | Profissionais ▾ | Institucional ▾ | (busca) (WhatsApp) [Solicitar orçamento]`

- `Produtos ▾`: mega menu com as 6 linhas (thumbnail 64px + nome + contagem) + "Ver todos os produtos".
- `Profissionais ▾`: Cotação de atacado · Representação · Assistência técnica · Documentos.
- `Institucional ▾`: A Maestria · Cases · Imprensa.
- Máximo: 7 itens de topo, 2 níveis. Breadcrumb em todas as páginas internas.
- CTA primário "Solicitar orçamento" no header em todas as páginas (exceto `/b2b/cotacao-atacado`, onde vira âncora do form).

**Mobile:** hamburger (Produtos, Cores, Calculadora, Onde Comprar, Profissionais, Institucional) + ícone de busca + WhatsApp fixo. Barra sticky inferior em PDP: `[Orçar] [WhatsApp]` (ver P12). Sem topbar — reduz altura de navegação.

**Regras:**
- Nenhum item de menu aponta para página sem template próprio (elimina o padrão "tudo para /cases/").
- Busca cobre produtos, cores, linhas e documentos (BT/FISPQ).
- Atalho de teclado: `/` foca a busca; `Esc` fecha off-canvas.

### 1.5 Fluxos de usuário prioritários

#### Fluxo 1 — Consumidor residencial: calcular quantidade + achar revenda

**Meta:** sair com volume de tinta, embalagem e loja (ou conversa de WhatsApp) com o produto correto.

| Passo | Ação | Decisão/elemento | Evento |
|---|---|---|---|
| 1 | Chega em `/` (busca orgânica "calcular tinta para 60m²" / Google) | Hero: `[Calcular quantidade]` | `page_view` |
| 2 | Abre `/calculadora` (ou mini-calc da home) | Informa área (m² ou L×A×n° paredes), superfície, linha | `calc_started` |
| 3 | Calculadora devolve litros + embalagens (18L/3.6L/1L) | Resultado com `aria-live` | `calc_completed` |
| 4 | CTA "Ver produtos compatíveis" → `/produtos/tintas-decorativas` com filtro pré-aplicado | Facet `?superficie=` ativo | `calc_to_catalog` |
| 5 | Seleciona produto → PDP; calculadora inline já pré-preenchida com o consumo do produto | Escolhe cor + litragem | `pdp_view` |
| 6a | `[Onde comprar]` → `/onde-comprar` com busca por cidade/CEP | Encontra loja com o produto (quando dados de estoque permitirem; senão, loja da região) | `store_opened` |
| 6b | `[Chamar no WhatsApp]` com mensagem pré-preenchida: produto, litragem, volume calculado | Conversa com contexto | `wa_click` |
| 6c | `[Solicitar orçamento]` → modal com produto/litragem/volume pré-preenchidos | Envio do form | `quote_submitted` |

**Fallback:** sem loja na cidade → card "Não encontramos revenda perto de você" + CTA "Solicitar indicação do revendedor mais próximo" (form leve) + WhatsApp.
**Métricas de funil:** `calc_started → calc_completed ≥ 40%`; `calc_completed → (quote_submitted | wa_click | store_opened) ≥ 50%`.

#### Fluxo 2 — Pintor/especificador profissional: FISPQ/BT sem fricção

**Meta:** obter o PDF do documento em ≤ 2 cliques a partir de qualquer ponto de entrada.

| Passo | Ação | Elemento | Evento |
|---|---|---|---|
| 1a | PDP → bloco Documentos | `[Baixar Boletim Técnico]` `[Baixar FISPQ]` — download direto, sem form | `doc_download {doc: bt\|fisqp, sku}` |
| 1b | Busca: "FISPQ Julien Ferrocote" → resultado do documento | Busca Meilisearch indexando documentos | `search_result_click` |
| 1c | `/b2b/documentos` → tabela por marca com colunas BT/FISPQ | Filtros por linha/marca | `doc_download` |
| 2 | Captura progressiva: após o **2º** download na sessão, toast discreto "Quer receber atualizações de fichas por e-mail?" (opt-in, nunca bloqueante) | Opcional, ignora em 1 clique | `doc_capture_optin` |
| 3 | Dúvida de aplicação → `/b2b/assistencia-tecnica` com produto pré-selecionado (deep-link `?produto=`) | Form: nome, empresa, telefone, descrição | `support_submitted` |

**Regra de UX:** nenhum documento é gateado por cadastro. A fricção atual (D03) é o principal motivo de perda desse segmento.
**Métricas:** `doc_download` por SKU/mês; tempo mediano PDP→download ≤ 8s.

#### Fluxo 3 — Lojista/construtora: cotação de atacado ou representação

**Meta:** lead qualificado com CNPJ e volume estimado no CRM em ≤ 1 dia útil de resposta (SLA declarado na página).

| Passo | Ação | Elemento | Evento |
|---|---|---|---|
| 1 | Entrada: header `Profissionais ▾` ou faixa B2B da home | Hubs claros por intenção | `b2b_hub_view` |
| 2a | **Cotação de atacado** (`/b2b/cotacao-atacado`): form com empresa, CNPJ, contato, linhas de interesse (multi-select), volume estimado, prazo | Validação de CNPJ em tempo real; consentimento LGPD explícito | `b2b_quote_submitted` |
| 2b | **Representação** (`/b2b/representacao`): benefícios, critérios territoriais, form (empresa, território, canais atuais) | — | `b2b_repr_submitted` |
| 3 | Confirmação com SLA ("resposta em até 1 dia útil") + WhatsApp do time comercial como alternativa | Page de sucesso rastreável | `b2b_quote_thanks` |
| 4 | Backend: grava em `leads` (Postgres) → webhook Pipedrive/HubSpot + e-mail transacional | ≤ 5s após o envio | — |

**Métricas:** CVR da página do form ≥ 12%; leads com CNPJ válido ≥ 80%; tempo de resposta comercial medido no CRM.

---

## 2. Design System e Identidade Visual

### 2.1 Princípios de design

- **Dado técnico é conteúdo de hero.** A parede pintada, a textura e a lata em contexto substituem fotos de banco genéricas; números (rendimento, secagem, m²) aparecem próximos dos CTAs.
- **Uma cor primária de ação por viewport.** O CTA primário da página é o único elemento em `accent`/`primary` com peso máximo; CTAs técnicos (ficha, BT) usam ghost/outline.
- **Cor como navegação de primeira classe.** A cartela não é aba de PDP: `/cores` é rota própria, e o seletor de cor é o mesmo componente em home, PDP e cartela.
- **Consistência token-driven.** Nenhum hex fora do token set; contraste validado em CI (axe + script de par de cores).

### 2.2 Paleta de cores — tokens e papéis semânticos

**Primary (azul Maestria) — ações, links, estados de foco:**

| Token | Hex | Uso |
|---|---|---|
| `primary-50` | `#EEF4FC` | Fundo de badges/seleção suave |
| `primary-100` | `#DCE7F8` | Fundo de chips ativos |
| `primary-300` | `#8FB0E4` | Bordas de campos ativos |
| `primary-500` | `#3A68BE` | Foco (outline), ícones |
| `primary-600` | `#275AA5` | Hover de links, hover de botões secundários |
| `primary-700` | `#1D478A` | **Botão primário (texto branco)**, links |
| `primary-800` | `#173A70` | Hover do botão primário |
| `primary-900` | `#122D58` | Superfícies dark (faixas) |
| `primary-950` | `#0A1B38` | Rodapé, bandas escuras, hero técnico |

**Secondary (slate) — apoio, bordas, superfícies neutras frias:**

| Token | Hex |
|---|---|
| `slate-50` | `#F4F6F9` |
| `slate-100` | `#E7EBF1` |
| `slate-200` | `#CDD6E2` (borda padrão) |
| `slate-400` | `#7D8FA8` |
| `slate-600` | `#465872` |
| `slate-800` | `#22304A` (cartões sobre dark) |
| `slate-900` | `#16203A` |

**Accent (laranja) — CTA de conversão, destaques de resultado:**

| Token | Hex |
|---|---|
| `accent-50` | `#FFF3EA` |
| `accent-100` | `#FFE3CF` |
| `accent-500` | `#EA580C` (grande/ícones apenas — ver regras) |
| `accent-600` | `#C2410C` (**CTA "Orçar", texto branco**) |
| `accent-700` | `#9A3412` (hover) |

**Surface:**

| Token | Hex | Papel |
|---|---|---|
| `surface-bg` | `#FFFFFF` | Fundo de página |
| `surface-alt` | `#F6F8FA` | Faixas alternadas, sidebar de filtros |
| `surface-inset` | `#EEF1F4` | Campos, wells |
| `surface-dark` | `#0A1B38` / `#122D58` | Bandas, rodapé |

**Neutros (texto) e semânticos:**

| Token | Hex | Papel |
|---|---|---|
| `text-primary` | `#1A2233` | Títulos, corpo |
| `text-secondary` | `#47546A` | Texto de apoio |
| `text-tertiary` | `#64748B` | Metadados (apenas sobre branco) |
| `text-on-dark` | `#FFFFFF` / `#9FB0C7` | Texto sobre dark / subtexto dark |
| `text-disabled` | `#94A3B8` | Estados inativos (não interativo) |
| `border` | `#D8DEE6` | Bordas decorativas |
| `success-700` | `#15803D` | WhatsApp, validações (fundo `#EAF6EE`) |
| `warning-700` | `#B45309` | Avisos (fundo `#FDF1E2`) |
| `danger-700` | `#B91C1C` | Erros (fundo `#FDECEC`) |
| `info-600` | `#275AA5` | Infos |

**Contraste (WCAG 2.1) — pares calculados e auditados:**

| Par | Razão | Requisito | Status |
|---|---|---|---|
| `text-primary` sobre `surface-bg` | **15.90:1** | AA ≥ 4.5:1 | AAA |
| `text-primary` sobre `surface-alt` | **14.94:1** | AA ≥ 4.5:1 | AAA |
| `text-secondary` sobre `surface-bg` | **7.65:1** | AA ≥ 4.5:1 | AAA |
| `text-secondary` sobre `surface-alt` | **7.19:1** | AA ≥ 4.5:1 | AAA |
| `text-tertiary` sobre `surface-bg` | **4.76:1** | AA ≥ 4.5:1 | AA (proibido sobre `surface-alt`: 4.47:1) |
| Link `primary-700` sobre branco / `surface-alt` | **9.05:1 / 8.50:1** | AA ≥ 4.5:1 | AAA |
| Branco sobre `primary-700` (botão primário) | **9.05:1** | AA ≥ 4.5:1 | AAA |
| Branco sobre `accent-600` (CTA Orçar) | **5.18:1** | AA ≥ 4.5:1 | AA |
| Branco sobre `success-700` (CTA WhatsApp) | **5.02:1** | AA ≥ 4.5:1 | AA |
| Branco sobre `danger-700` (mensagens de erro) | **6.47:1** | AA ≥ 4.5:1 | AA |
| `warning-700` sobre `#FDF1E2` | ≥ 4.5:1 (texto) | AA | Validar por par em CI |
| Branco sobre `primary-950` (faixa dark) | **17.12:1** | AA | AAA |
| `#9FB0C7` sobre `primary-950` (subtexto dark) | **7.75:1** | AA | AAA |
| `accent-500` (`#EA580C`) sobre branco | **3.56:1** | Não-texto ≥ 3:1 | **Apenas** ícones, gráficos, texto ≥ 24px |
| `text-disabled` sobre branco | 2.56:1 | Fora de escopo WCAG | Somente estados inativos (elementos não interativos) |

**Regras de uso:**
- CTA primário de conversão em página = `accent-600` ou `primary-700` — nunca `accent-500`.
- Cor nunca é o único indicador de estado/acabamento (pin de mapa, chip de acabamento): sempre ícone ou texto.
- Fundos de cores da cartela são a **cor real do produto** (dados, não design): contraste é tratado no rótulo sobreposto (texto branco com sombra quando LRV < 50; `#1A2233` quando LRV ≥ 50).

### 2.3 Tipografia

**Famílias:** `Sora` (600/700 — display e títulos) + `Inter` (400/500/600/700 — corpo, UI). Variável, servida via `next/font` (self-hosted, subset latin, `display: swap`). Números de fichas técnicas: `font-variant-numeric: tabular-nums`.

| Token | Desktop | Mobile | Peso | Leading | Uso |
|---|---|---|---|---|---|
| `display` | `clamp(40px, 6vw, 60px)` | `36px` | Sora 700 | 1.05 | Hero da home |
| `h1` | `clamp(32px, 4.5vw, 40px)` | `28px` | Sora 700 | 1.15 | Título de página |
| `h2` | `clamp(26px, 3vw, 32px)` | `24px` | Sora 700 | 1.2 | Seções |
| `h3` | `22px` | `20px` | Sora 600 | 1.3 | Blocos, cards grandes |
| `h4` | `18px` | `17px` | Inter 600 | 1.4 | Títulos de card/bloco |
| `body-lg` | `18px` | `17px` | Inter 400 | 1.6 | Introdução de PDP/categoria |
| `body` | `16px` | `16px` | Inter 400 | 1.6 | Corpo padrão |
| `small` | `14px` | `14px` | Inter 400 | 1.5 | Tabelas de specs, metadados |
| `label` | `12px` | `12px` | Inter 600 | 1.4 | Labels de form, chips (uppercase, `letter-spacing: .06em`) |

- Medida de parágrafo: 60–75ch (limite `max-width: 68ch` em prosa).
- Tabela de especificações: corpo `14px/1.5`, linhas com `border-bottom: slate-200`, rótulo em `text-secondary`.
- Hierarquia numérica: 1 família por papel; proibido misturar pesos acima de 700.

### 2.4 Espaçamento, raio, elevação, movimento

- **Grid de espaçamento:** base 4px; escala de uso `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`. Gutters de container: 24px (mobile) / 32px (≥1024px); container máx. 1200px.
- **Raio:** `sm 4px` (inputs de tabela) · `md 8px` (botões, chips) · `lg 12px` (cards, modais) · `full` (CTA de WhatsApp, avatares).
- **Elevação:**
  - `e1`: `0 1px 2px rgba(16,24,40,.06)` — cards em repouso
  - `e2`: `0 4px 8px -2px rgba(16,24,40,.10)` — cards em hover, dropdowns
  - `e3`: `0 12px 24px -8px rgba(16,24,40,.16)` — modais, off-canvas
- **Foco visível (obrigatório em todo interativo):** `outline: 2px solid primary-500; outline-offset: 2px`.
- **Movimento:** transições 150–200ms `ease-out` (hover, expandir filtros); nada de animação em primeira carga; `prefers-reduced-motion: reduce` zera transições e o parallax de preview de cor.

### 2.5 Componentes modulares obrigatórios

#### 2.5.1 Card de produto (`ProductCard`)

**Contrato de dados (subset):**

```ts
interface ProductCardProps {
  slug: string;            // rota da PDP
  subline: string;         // "FORMULA" | "JULIEN" | "SOLS" | "AXION" | "CREPI"
  name: string;            // nome comercial
  finish: Finish;          // "fosco" | "acetinado" | "semibrilho" | "brilhante" | null
  base: "agua" | "solvente";
  formats: string[];       // ["1L", "3.6L", "18L", "200L"]
  image: { src: string; alt: string; width: number; height: number }; // 4:3
  price?: number;          // opcional (BRL); ausente = "sob consulta"
}
```

**Estrutura (ordem DOM):**
1. Imagem 4:3 (lata sobre fundo branco, `loading="lazy"` fora do LCP), badge de subline (topo-esquerda, `primary-50`).
2. Nome do produto (`h4`, truncado em 2 linhas).
3. Linha de atributos: `base` · `finish` (chips `slate-100`, 12px) — ex.: "Base água · Fosco".
4. Litragens: "1L · 3.6L · 18L" em `small`/`text-secondary`.
5. Preço (se público) em `tabular-nums` + "ou sob consulta" — ou apenas "Sob consulta".
6. Ações: `[Ficha técnica]` (ghost, outline `slate-200`) → âncora na spec table da PDP; `[Orçar]` (primary `primary-700`) → PDP com scroll ao painel de compra.

**Estados:** default / hover (elevação `e2` + borda `primary-300`) / focus-visible (outline padrão do sistema) / indisponível (imagem em escala de cinza + selo "Esgotado", CTAs desabilitados em `text-disabled`).
**A11y:** o card é **um** link (imagem + nome, mesmo `href`); os dois CTAs são botões fora do `<a>` (proibido nested interactive). `aria-label` do card: "Ver {name}, base {base}, acabamento {finish}".
**Eventos:** `card_click {sku}`, `card_cta_bt {sku}`, `card_cta_quote {sku}`.

#### 2.5.2 Seletor de cores (`ColorSelector`)

**Contrato de dados:**

```ts
interface Color {
  code: string;        // "MST-1004"
  name: string;        // "Verde Sálvia"
  family: ColorFamily; // 8–12 famílias (Neutros, Terrosos, Azuis, Verdes, ...)
  hex: string;         // "#8A9A7B"
  lrv: number;         // 0–100 (luminância refletida)
  reference?: string;  // código NCS/interColor quando mapeado
  productIds: string[];
}
```

**Comportamento:**
- Lista virtualizada (se > 60 cores) com filtros: família (chips), LRV (claras/medias/escuras), produto (quando usado em PDP — lista já filtrada).
- Seleção (1 clique): aplica a cor na cena de preview (quarto/superfície) via **cenas pré-renderizadas por família** (fallback: camada CSS `mix-blend-mode: multiply` sobre foto de parede) — sem recarga de imagem por cor.
- Painel lateral mostra: amostra 64px, nome, `code`, `hex` (monoespaçada), LRV, referência, botão `[Copiar HEX]` (Clipboard API + toast "copiado"), CTA `[Ver {n} produtos com esta cor]` (em home/cartela) ou lista de produtos compatíveis (em PDP).
- Persistência da cor em `sessionStorage` (mantém a cor ao navegar PDP→PDP).

**A11y:** grupo `role="radiogroup"` com setas ←→↑↓ para navegação, `aria-checked` na seleção, label visível no focus (nome da cor), swatches com `title` e `aria-label="{name}, código {code}, hexadecimal {hex}"`. Preview anuncia mudança via `aria-live="polite"`.
**Performance:** cena por família = 1 AVIF ≤ 80KB (max 12); cores renderizadas por CSS.
**Eventos:** `color_view {code}`, `color_select {code}`, `color_copy {code}`, `color_products_cta {code, n}`.

#### 2.5.3 Calculadora de rendimento (`YieldCalculator`)

**Entradas:**

| Campo | Tipo | Padrão | Restrição |
|---|---|---|---|
| Área | m² (ou Largura × Altura × nº de paredes) | — | 1–100.000 m², 2 casas |
| Superfície | select | Alvenaria | Alvenaria, Concreto, Gesso, Madeira, Metal, Asfalto |
| Linha/Produto | select (quando embutida: pré-selecionado) | Decorativa | Afeta `consumo_m2_por_l_demao` |
| Demãos | stepper | 2 (1 para selador/primers; 3 para madeira/metal novos) | 1–6 |
| Perda | percentual | 10% (fixo, exibido) | não editável na v1 |

**Fórmula e saída** (detalhada no Anexo B):

```
litros = (area × demãos × 1.10) / m2_por_l_por_demao
```

Saída (bloco `aria-live="polite"`):
- Volume total em litros (1 casa, `tabular-nums`).
- **Embalagens recomendadas** (greedy do maior formato, ex.: "1× 18L + 1× 3.6L = 21.6L para 19.4L necessários") — formatos do produto; se não houver formato que feche, sugere próximo superior.
- Custo estimado (somente se preço público).
- CTA1 `[Orçar com esta quantidade]` (modal/WhatsApp com volume + produto) · CTA2 `[Ver ficha técnica]`.

**Qualidade:**
- Validations com mensagem inline (`danger-700`), foco no primeiro erro.
- Debounce 300ms no recálculo; cálculo 100% client-side (zero rede).
- Testes: unitários do kernel de cálculo (≥ 10 casos, incluindo formatos não divisíveis) + property test (volume sugerido ≥ volume necessário, sempre).
- A11y: labels visíveis, `aria-describedby` com a fórmula resumida, resultado em região anunciada.

**Eventos:** `calc_started`, `calc_completed {litros, formatos, produto}`, `calc_quote_click`, `calc_wa_click`.

#### 2.5.4 Componentes de suporte (breve)

- **Button:** variantes `primary` (700), `accent` (600 — conversão), `ghost`, `whatsapp` (success-700 + ícone); tamanhos 40/48px; estados complete (inclui `:focus-visible`, `:disabled`, loading com spinner).
- **Breadcrumb:** `<nav aria-label="breadcrumb">`, `ol` semântico, item atual `aria-current="page"` não clicável; truncagem central em mobile (ex.: `Início / … / Formula Decosinal`).
- **StoreLocator:** busca (cidade/CEP/UF, debounce 300ms) → lista com UF, cidade, bairro, telefone, "ver rota" (Google Maps deep-link) + mapa com tiles auto-hospedadas; estado vazio com CTA de indicação.
- **Toast:** 4s, `role="status"`, posicionamento bottom (mobile) / top-right (desktop).

### 2.6 Contrato de dados obrigatório por produto (governança de conteúdo)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| `sku` | string (único) | Sim | `FRM-DECOSINAL-18L` |
| `name` | string | Sim | "Formula Decosinal" |
| `subline` | enum | Sim | "FORMULA" |
| `line` | slug de linha | Sim | `tintas-decorativas` |
| `base` | enum | Sim | "solvente" |
| `finishes` | enum[] | Sim | ["semibrilho"] |
| `surfaces` | enum[] | Sim | ["concreto", "asfalto"] |
| `environments` | enum[] | Sim | ["interno", "externo"] |
| `formats` | {size, code}[] | Sim | [{size:"18L", code:"FRM-DEC-18"}] |
| `consumo_m2_por_l_por_demao` | number | Sim | 10 |
| `demao_padrao` | int (1–6) | Sim | 2 |
| `diluir` | string | Sim | "Até 10% com solvente específico" |
| `secagem` | {ao_toque_h, entre_demao_h, total_h} | Sim | {1, 4, 24} |
| `voc_g_l` | number? | Recomendado | 320 |
| `normas` | string[]? | Recomendado | ["NBR 11702"] |
| `prazo_validade_meses` | int | Sim | 24 |
| `bt_pdf` / `fisqp_pdf` | URL S3 | **Sim (B2B/industrial) / Recomendado (decorativas)** | — |
| `colors` | Color[] | Sim (decorativas/revestimentos) | [MST-1004] |
| `images` | {lata, aplicacao, textura, acabamento} | lata + aplicação | — |
| `meta_title` / `meta_desc` | string (≤60/≤160) | Sim | — |
| `featured` | bool | — | Curadoria de home |

**Regra de publicação:** o script de validação do CMS (webhook + CI) rejeita produto sem os campos "Sim". Elimina o "Produto não classificado" (D04/D05) estruturalmente.

---

## 3. Wireframes Textuais das Páginas-Chave

Convenção: cada bloco traz `ID | Conteúdo/elementos | Interação | Objetivo (conversão/SEO/performance)`. Bloco 01 (Header) e 00 (Footer) são os definidos em 1.4 e 3.1 e se repetem em todas as páginas — referenciados como `[H]` e `[F]`.

### 3.1 Homepage

| ID | Bloco | Conteúdo / elementos | Interação | Objetivo |
|---|---|---|---|---|
| 01 | **Hero (acima da dobra)** | Imagem única LCP (aplicação real de produto em parede, AVIF 1600px, sem carrossel). H1: "Tintas e sistemas para cada superfície" (≤ 60px). Sub (1 linha): "Calcule a quantidade, veja a cor na sua parede e encontre o revendedor mais próximo." CTAs: `[Calcular quantidade]` (accent-600, primário) · `[Ver catálogo]` (ghost). Faixa de confiança abaixo: "15+ anos · Demarcação do SPFC · Distribuidores em N países" (texto puro, sem logos sem licenciamento) | CTA1 → `/calculadora`; CTA2 → `/produtos`. Imagem: `fetchpriority="high"` + `preload` | LCP ≤ 2.5s; primeira ação = job do usuário; elimina o carrossel (D08) |
| 02 | **Seletor rápido de linhas** | 6 cards (imagem 4:3 + nome + contagem + 1 linha de descrição): Tintas Decorativas · Demarcação Viária · Demarcação de Grama · Pisos Industriais · Anticorrosivas · Revestimentos. Grid 6/3/2 | Card inteiro é link para `/produtos/[linha]` | Navegação por linha em 1 clique; cada card = landing page indexável |
| 03 | **Demonstrador de cores** | Cena de quarto (AVIF ≤ 80KB) + 5 swatches (`ColorSelector` compacto). Lado: nome + código + hex da cor ativa + `[Ver cartela completa (N)]` | Clique em swatch troca a cena (sem rede); hover mostra nome | Cor como navegação de 1ª classe (D06); evento `color_select` |
| 04 | **Produtos em destaque** | 8 `ProductCard` (curadoria via `featured`, 2–3 por linha principal) + `[Ver todos os produtos]` | Scroll horizontal em mobile com snap; grid em desktop | Exposição do catálogo com dados técnicos no card |
| 05 | **Faixa calculadora** (banda `primary-950`) | H2 "Quanta tinta você precisa?" + mini-form: área (m²) + linha de produto + `[Calcular]`. Resultado inline (litros + embalagens) + `[Detalhes no simulador]` | Cálculo client-side; resultado `aria-live` | Reduz atrito: responde o job em 2 campos, no meio da jornada |
| 06 | **Prova social / cases** | 3 cards de case (foto do projeto + setor + 1 métrica factual, ex.: "Gramado do CT: demarcação 100% Stadium Plus") + player de YouTube (thumbnail com botão play, **sem autoplay**, embed só após clique) | Link para `/cases` | Criação de confiança para o público industrial (B2B) sem autoplay de vídeo (CLS/performance) |
| 07 | **Pontos de venda** | H2 "Onde comprar" + busca por cidade/CEP + lista com 3 resultados (cidade, bairro, telefone) + mapa (tiles https) + `[Abrir mapa completo]` | Busca com debounce; fallback "não encontramos" com CTA de indicação | Fecha o funil B2C (fluxo 1, passo 6a) sem sair da home |
| 08 | **Faixa B2B** (banda `slate-900`) | "É revenda, construtora ou indústria?" + 2 CTAs: `[Solicitar cotação de atacado]` (accent) · `[Quero representar a Maestria]` (ghost claro) | Links para `/b2b/cotacao-atacado` e `/b2b/representacao` | Qualifica o canal B2B (fluxo 3) |
| 09 | **FAQ** | 4 perguntas (ex.: "Quanta tinta preciso para 80 m²?", "Qual a diferença entre fosco e acetinado?", "Vocês atendem por atacado?", "Como obter a FISPQ?") — `<details>/<summary>` nativo | Expansão sem JS | `FAQPage` schema; captura de long-tail orgânico |
| 10 | **Footer** | 4 colunas: Linhas (6) · Ferramentas (Cores, Calculadora, Onde comprar, Documentos) · Profissionais (Cotação, Representação, Assistência técnica) · Contato (endereço, CNPJ, WhatsApp, e-mail) + linha legal (LGPD, políticas) + social | — | SEO interno; confiança; LGPD (D13) |

**Notas de home:**
- Uma única CTA accent por viewport (regra 2.1): hero = calcular; faixa B2B = cotação.
- Mobile: barra sticky inferior `[Calcular] [WhatsApp]` aparece após 600px de scroll.
- SEO: `WebSite` + `Organization` JSON-LD; title template "Tintas e Revestimentos para Obras, Indústria e Demarcação | Maestria".

### 3.2 Página de Categoria / Catálogo (`/produtos/[linha]`)

Layout: sidebar de filtros 288px (sticky, `top: 80px`) + grid de 3 colunas (2 em tablet, 1 em mobile). Mobile: botão `[Filtrar (n)]` abre painel off-canvas à direita.

| ID | Bloco | Conteúdo / elementos | Interação | Objetivo |
|---|---|---|---|---|
| C01 | Breadcrumb | `Início / Produtos / Tintas Decorativas` | — | `BreadcrumbList` schema |
| C02 | Cabeçalho da linha | H1 (nome da linha) + descrição 120–160 chars (keyword primária da linha) + contagem "N produtos" | — | SEO da landing page da linha |
| C03 | **Facets** (sidebar) | Grupo "Ambiente": Interno, Externo · Grupo "Superfície": Alvenaria, Concreto, Gesso, Madeira, Metal, Asfalto · Grupo "Acabamento": Fosco, Acetinado, Semibrilho, Brilhante · Grupo "Base": Água, Solvente · Grupo "Litragem": 1L, 3.6L, 18L, 200L · Grupo "Submarca": FORMULA, JULIEN, SOLS, AXION, CREPI · Grupo "Segmento": Econômica, Standard, Premium. Cada opção com contagem. Ordenação dos grupos por uso (ambiente/superfície primeiro) | Checkboxes; URL `/produtos/[linha]?ambiente=interno&superficie=alvenaria`; chips ativos no toolbar com × para remover; `[Limpar tudo]` | Filtragem sem recarga (client-side sobre payload SSG da linha — linhas ≤ 60 SKUs); canonical para a categoria raiz (evita thin duplicates) |
| C04 | Toolbar | "N produtos" (atualiza com filtros) + ordenação: Relevância (padrão) · Nome A–Z · Novos | Select `<label>` visível | Controle de expectativa; ordenação por relevância = priorizar `featured` |
| C05 | Grid de produtos | `ProductCard` (2.5.1), 3 colunas, 24 por página + botão `[Carregar mais]` (não infinito scroll) | Cards linkam PDP | CLS controlado (altura fixa por card); INP preservado |
| C06 | Estado vazio | Ilustração neutra + "Nenhum produto com esses filtros" + `[Limpar filtros]` + WhatsApp de suporte | — | Evita dead-end |
| C07 | Rodapé SEO | 400–600 palavras otimizadas (keyword da linha + superfícies + aplicações) + links para 3 linhas relacionadas + FAQ da linha (3 itens) | — | Conteúdo indexável por linha; interlinking |

**Regras técnicas:**
- Renderização SSG da linha completa (JSON do CMS incluído na página) → filtros 100% client-side, zero requisições extras.
- URL com filtros é **noindex** (canonical → categoria raiz); as 3 sublinhas decorativas (3.3 do sitemap) são páginas SSG próprias com o mesmo template.
- `ItemList` schema com os produtos; breadcrumbs `BreadcrumbList`.
- Sublinhas: `/produtos/tintas-decorativas/acrilicas` usa o mesmo template com `line` + `subline` fixos.

### 3.3 Página de Produto — PDP (`/produtos/[slug]`)

Layout: 2 colunas (55/45) acima da tabela de specs; coluna esquerda com galeria, direita com painel de compra. Mobile: 1 coluna (galeria → painel → calculadora → specs), com barra sticky `[Orçar] [WhatsApp]`.

| ID | Bloco | Conteúdo / elementos | Interação | Objetivo |
|---|---|---|---|---|
| P01 | Breadcrumb | `Início / Tintas Decorativas / Formula Decosinal` | — | `BreadcrumbList` |
| P02 | Cabeçalho | Badge de subline + H1 (nome) + chips: base · acabamento(s) · ambiente(s) · superfície(s). Abaixo: meta description (body-lg) | — | Escaneabilidade técnica em 3 segundos |
| P03 | **Galeria** | Imagem principal: lata na litragem selecionada (1200px, fundo branco, LCP). Thumbnails: lata, aplicação em superfície real, textura/acabamento, foto da BT (página 1) | Clique troca imagem; zoom por clique (lightbox com `Esc`); litragem selecionada troca a lata (3.6L/18L/200L têm foto própria) | LCP = lata (`priority`); prova de acabamento (foto comparando fosco/acetinado quando houver) |
| P04 | **Painel de compra** | a) Cores: swatches `ColorSelector` compacto (quando > 1 cor) com código. b) Acabamento: segmented control (quando > 1). c) **Litragem**: radio cards (1L / 3.6L / 18L / 200L) com preço público ou "sob consulta". d) Stepper de quantidade. e) **CTA primário** `[Solicitar orçamento]` (accent-600) → modal com campos: nome, WhatsApp, e-mail, cidade, mensagem (pré-preenchida com produto + cor + litragem + qtd + área, se calculada). f) **CTA WhatsApp** `[Chamar no WhatsApp]` (success-700, ícone) → `wa.me/5514998351483` com texto pré-preenchido: "Olá! Quero orçar {nome} {litragem} × {qtd} ({site})". g) CTA ghost `[Onde comprar]` → âncora no bloco P13. h) Confiança: 3 ícones com texto ("Secagem ao toque: 1h", "Rendimento: 10 m²/L/demão", "ABNT NBR 11702") | Modal fecha com `Esc`/overlay; envio → página de sucesso + `quote_submitted` | Conversão primária com contexto completo (corrige D10); WhatsApp com SKU resolve a dor de lead genérico |
| P05 | **Calculadora inline** | `YieldCalculator` (2.5.3) pré-preenchida: produto atual, consumo do produto, demãos padrão do produto. Saída: litros + embalagens + `[Orçar com esta quantidade]` (abre o modal P04e com volume) | Cálculo client-side | Job #1 do B2C/profissional no ponto de decisão |
| P06 | **Especificações técnicas** (tabela) | Linhas obrigatórias (2.6): composição/base, acabamento, rendimento (m²/L/demão), diluição, secagem (ao toque / entre demãos / total), demãos recomendadas, VOC, normas ABNT, validade, armazenamento, litragens disponíveis | Estática | Tabela estruturada = referência do profissional; corrige D04 |
| P07 | **Documentos** | `[Baixar Boletim Técnico (PDF)]` · `[Baixar FISPQ (PDF)]` — **download direto** (link para S3 com `Content-Disposition: attachment`), tamanho do arquivo exibido. Se FISPQ não existir para o SKU: link para `/b2b/assistencia-tecnica?produto=` com aviso "FISPQ em elaboração — solicite por e-mail" (nunca gate em form). Captura progressiva: após o 2º download na sessão, toast opt-in de e-mail (2.5, fluxo 2) | Download dispara `doc_download` | Remove a fricção crítica D03; hub de documentos para o fluxo profissional |
| P08 | **Modo de aplicação** | 4 passos numerados: Preparação da superfície → Aplicação (ferramenta, diluição, demãos) → Secagem → Limpeza. Ícone + texto curto por passo | Estático | Conteúdo de apoio à decisão e a long-tail ("como aplicar esmalte sintético em madeira") |
| P09 | Cores do produto | `ColorSelector` completo das cores compatíveis + nota do sistema tintométrico (quando aplicável: "Tonalizável no sistema X — N cores") | — | Substitui o texto morto "NÃO DISPONÍVEL NO SISTEMA TINTOMÉTRICO" (D06) |
| P10 | Produtos relacionados | 4 `ProductCard` da mesma linha (mesma superfície primeiro) | — | Interlinking; reduz abandono |
| P11 | FAQ do produto | 3–5 perguntas (preparo, tempo de obra, compatibilidade) via `<details>` | — | `FAQPage` schema; long-tail |
| P12 | **Barra sticky mobile** | `[Orçar]` (accent) + `[WhatsApp]` (success), aparecem após a galeria | — | CTA sempre acessível no funil mobile |
| P13 | Onde comprar | Lista de revendedores da região do visitante (IP geo coarse, com opt-out) ou por busca, 3 resultados + `[Abrir mapa completo]` | Busca local | Fecha o funil B2C dentro da PDP |

**JSON-LD da PDP:** `Product` (nome, SKU, descrição, imagem; `offers` **somente** quando houver preço público — sem preço, o campo é omitido, não preenchido com dummies), `BreadcrumbList`, `FAQPage` (quando P11 existir).
**Title template:** `{Produto} {Litragem padrão} {Acabamento} — {Linha} | Maestria` (≤ 60 chars).
**OG image:** gerada por Satori (lata + swatch de cor + nome), 1200×630.

### 3.4 Outras páginas-chave (condensado)

| Página | Blocos essenciais |
|---|---|
| `/cores` | H1 "Cartela de Cores Maestria" + busca por nome/código + filtros (família, LRV, produto/linha) + grid de `ColorCard` (swatch 64px, nome, código, hex, LRV, "N produtos") |
| `/cores/[codigo]` | Preview em cena (2 ambientes: parede lisa + textura) + meta (família, LRV, referência, hex) + produtos compatíveis (`ProductCard`) + cores próximas da família |
| `/onde-comprar` | Busca cidade/CEP/UF + mapa (tiles https) + lista de lojas (nome, endereço, telefone, "ver rota") + página própria `/onde-comprar/[slug]` (endereço completo, horários, `LocalBusiness`/`Store` schema com geo) + fallback "solicitar indicação" |
| `/b2b/cotacao-atacado` | H1 + texto de SLA ("resposta em até 1 dia útil") + form (empresa, CNPJ com validação, contato, telefone, e-mail, linhas de interesse multi-select, volume estimado, prazo, observações, consentimento LGPD) + WhatsApp comercial ao lado + FAQ de atacado (frete, prazos, volume mínimo) |
| `/b2b/representacao` | Benefícios de revenda (preço, marketing, suporte técnico), critérios territoriais, form (empresa, CNPJ, território, canais que atende hoje) + próximo passo declarado |
| `/b2b/documentos` | Busca por produto/marca + tabela (produto · linha · BT ↓ · FISPQ ↓) com filtros por subline; título de busca: "FISPQ e Boletins Técnicos Maestria" |
| `/b2b/assistencia-tecnica` | Form (produto, tipo de problema: aplicação/qualidade/outro, descrição, contatos) + produtos pré-selecionáveis; SLA declarado |
| `/calculadora` | Versão completa da calculadora (todas as superfícies + linhas) + explicação da fórmula (transparência) + produtos compatíveis no resultado |
| `/a-maestria` | História (fundação, origem francesa), números (anos, países, cases), fotos reais de fábrica/laboratório, certificações |
| `/cases` | Grid de cases com setor (esporte, industrial, hospitalar, viário) + métrica factual + link para linha de produto usada |
| `/contato` | Endereços, telefones, e-mails por área (comercial, técnico, imprensa), mapa |
| `/lgpd` | Política de privacidade, lista de cookies, preferências de consentimento, canal de DPO |

---

## 4. Stack Tecnológica e Performance

### 4.1 Decisão de arquitetura

| Critério | **Next.js 15 (App Router)** ✔ | Astro 5 | Nuxt 4 | WordPress (atual) |
|---|---|---|---|---|
| Renderização | RSC + SSG/ISR com revalidação por tag/webhook | SSG + ilhas React | SSG/SSR | PHP + cache de plugins |
| Componentes interativos (calculadora, seletor de cor, filtros) | React nativo (RSC/CSR) | React islands | Vue/Nuxt UI | jQuery/plugins |
| API internal (leads, lojas) | Route Handlers | Server endpoints | Server routes | Plugins |
| SEO / HTML final | HTML completo no servidor | HTML completo | HTML completo | Dependente de cache |
| Budget de JS controlável | Sim (RSC reduz JS da página) | Sim (mínimo) | Sim | Não (plugins acumulam) |
| Ecosistema de contratação (BR) | Alto | Médio | Médio | Alto |
| **Veredito** | **Escolhido** — catálogo + ferramentas interativas + API exigem o mesmo runtime; ISR dá reatividade do CMS sem re-render | Alternativa válida se o time preferir menos JS — custa ilhas separadas e infraestrutura duplicada de API | Viável; menor aderência ao time | Descartado: D17 (monólito, sem CI, budget inexistente) |

**Estrutura de renderização:**

| Template | Estratégia | Revalidação |
|---|---|---|
| Home, linhas, PDP, cores, cases | SSG | Webhook Sanity → `revalidateTag` por rota (produto alterado só re-renderiza sua PDP e linha) |
| `/onde-comprar`, `/b2b/*` (form), calculadora | CSR (client components) | — |
| `/api/*` (leads, lojas, busca) | Route Handlers | — |

### 4.2 Componentes da arquitetura e fontes de dados

| Componente | Tecnologia | Papel | Notas |
|---|---|---|---|
| Frontend | Next.js 15 + React 19 + TypeScript | SSG/ISR + interatividade | Tailwind CSS v4 (design tokens = CSS custom properties geradas do token set) |
| UI base | Radix UI (headless) + shadcn/ui (padrão de copy) | Acessibilidade por padrão (focus, aria, keyboard) | Componentes da seção 2.5 implementados sobre esta base |
| CMS | **Sanity** (headless, GROQ) | Produtos, cores, linhas, cases, páginas institucionais, documentos (metadados) | Documentos: `Product`, `Color`, `Line`, `Store`, `Case`, `Doc`. Webhooks → revalidação. Estrutura de schemas no Anexo A |
| Alternativa CMS | Strapi | Viável, porém GROQ + image CDN + webhooks granulares do Sanity reduzem trabalho no catálogo | — |
| Mídia (imagens) | Sanity Image CDN (ou R2) | AVIF/WebP, srcset, crop | Polity de assets em 4.4 |
| PDFs (BT/FISPQ) | S3/R2 + route `/downloads/[slug]` | Download direto com `Content-Disposition: attachment` + contagem de download | Nunca gatear (fluxo 2) |
| Banco operacional | **Postgres** (Neon ou Supabase) | `leads`, `lojas`, `eventos_doc`, consentimentos | Migração do mapa global atual → `lojas` com geocoding |
| Busca | **Meilisearch** | Produtos, cores, linhas, documentos | Único index; < 300 SKUs tornaria filtragem client-side suficiente, mas busca textual de FISPQ exige índice |
| Mapas | Leaflet + **tiles OSM auto-hospedadas em S3** (https) | `/onde-comprar` + home | Corrige mixed content (D07); sem dependência de API paga na v1 |
| Form/leads | Route Handler `/api/orcamento`, `/api/b2b` | Validação (Zod) → Postgres → e-mail (Resend) → webhook CRM | Idempotência por token; SLA de gravação < 5s |
| CRM | Pipedrive (ou HubSpot) via webhook | Qualificação B2B | Campo `origin: website` + UTM |
| WhatsApp | Deep-link `wa.me/5514998351483` com template por contexto | Prefill com SKU/litragem/volume (P04f) | Template único versionado no código |
| Analytics | GA4 + **PostHog** (funil, A/B, RUM próprio) | Eventos do Anexo C | Consent mode v2 (LGPD): medição sem cookie até aceite |
| Monitoramento | Sentry (erros) + Vercel Insights + `web-vitals` RUM → PostHog | Budgets de CWV em campo | Alerta quando p75 LCP > 2.5s |
| CI/CD | GitHub Actions | Lint, typecheck, testes, **Lighthouse CI** (budgets 4.4), axe-core, visual regression (Playwright) | PR bloqueado se quebrar budget |
| Hospedagem | Vercel (ou Cloudflare Pages) | CDN global, edge runtime para APIs | TTFB < 600ms |

**Modelo de dados (resumo — completo no Anexo A):** `Product` (1:1 com o contrato 2.6), `Color` (2.5.2), `Line` (facets derivadas), `Store` (endereço, geo, telefones, UFs atendidas), `Doc` (bt/fisqp, versão, data), `Case`, `Page` (Portable Text).

### 4.3 SEO técnico

**Taxonomia de URLs (final):**

| Padrão | Exemplo | Página |
|---|---|---|
| `/` | — | Home |
| `/produtos/[linha]` | `/produtos/pisos-industriais` | Categoria |
| `/produtos/[linha]/[sublinha]` | `/produtos/tintas-decorativas/texturas` | Subcategoria |
| `/produtos/[slug]` | `/produtos/formula-decosinal` | PDP |
| `/cores`, `/cores/[codigo]` | `/cores/mst-1004` | Cartela / cor |
| `/onde-comprar`, `/onde-comprar/[slug]` | `/onde-comprar/sorocaba-central` | Lojas |
| `/b2b/[rota]` | `/b2b/cotacao-atacado` | Canal B2B |
| `/downloads/[slug]` | `/downloads/bt-julien-ferrocote` | PDF (noindex) |

**Migração de 301 (mapa obrigatório antes do go-live):**

| Atual | Novo | Regra |
|---|---|---|
| `/produtos/formula-decosinal-amarelo/` | `/produtos/formula-decosinal?cor=amarelo` | Remove cor do slug (D09); 301 permanente |
| `/categoria/tintas-decorativas/` | `/produtos/tintas-decorativas` | Troca de taxonomy |
| `/produtos/[slug]` (demais) | `/produtos/[slug]` (ajuste: minúsculas, sem acento, `-` no lugar de espaço) | 301 quando houver alteração |
| `/assistencia-tecnica/` | `/b2b/assistencia-tecnica` | Reagrupamento do canal |
| `/solicitar-orcamento/`, `/solicitar-fisqp/` | Home / PDP (função absorvida) | 301 para a rota que cumpre o job; página de orçamento isolada vira modal |
| `/cases`, `/a-maestria` | `/cases`, `/institucional/a-maestria` | Preservar quando possível; 301 o restante |

**Templates de title/meta (limite em characters):**

| Template | Title (≤ 60) | Meta description (≤ 160) |
|---|---|---|
| Home | `Tintas e Revestimentos para Obras, Indústria e Demarcação \| Maestria` | `Calcule a quantidade, explore a cartela de cores e encontre revendedores. Tintas decorativas, industriais, anticorrosivas e demarcação Maestria.` |
| Categoria | `{Linha}: {N} produtos \| Catálogo Maestria` | Descrição da linha com superfícies e ambientes atendidos (keyword primária da linha) |
| PDP | `{Produto} {Acabamento} {Litragem} — {Linha} \| Maestria` | `{Produto}: {base}, rendimento {X} m²/L/demão, {acabamento}. Veja fichas técnicas, cores e onde comprar.` |
| Cor | `Cor {Nome} ({Código}) — Cartela Maestria` | `Cor {Nome}, {familia}, LRV {n}. Veja produtos Maestria disponíveis nesta cor e o preview em ambiente.` |
| Loja | `{Loja} — Revendedor Maestria em {Cidade}` | Endereço, telefone e horários da loja {Loja}, revendedora Maestria em {Cidade}/{UF}. |

**Dados estruturados (JSON-LD por template):**

| Página | Tipos schema.org | Campos-chave |
|---|---|---|
| Home | `Organization`, `WebSite` (+`potentialAction` SearchAction → `?q=`) | name, logo, sameAs (redes), areaServed |
| Categoria | `ItemList`, `BreadcrumbList` | items → PDPs da página |
| PDP | `Product`, `BreadcrumbList`, `FAQPage` (quando houver) | name, sku, image, description; `offers` **apenas com preço público** (priceCurrency BRL, availability); sem `aggregateRating` fictício |
| Cor | `CreativeWork` (cor como variante) + `ItemList` de produtos | hex, LRV, produtos compatíveis |
| Loja | `LocalBusiness` (subtipo `Store`/`HomeGoodsStore` quando aplicável) | name, address, geo (lat/long), telephone, openingHours, url |
| FAQ (home e linhas) | `FAQPage` | apenas as perguntas renderizadas |

**Estratégia de palavras-chave (mapeamento linha → keyword primária + long-tail):**

| Página | Keyword primária | Long-tail (conteúdo da página) |
|---|---|---|
| `/produtos/tintas-decorativas` | tinta acrílica | "tinta para parede interna", "quanto rende 18L de tinta" |
| `/produtos/pisos-industriais` | tinta para piso industrial | "piso de concreto para galpão", "epóxi para piso de fábrica" |
| `/produtos/tintas-anticorrosivas` | tinta anticorrosiva | "esmalte sintético para metal", "tinta para manutenção industrial" |
| `/produtos/demarcacao-viaria` | tinta para demarcação viária | "tinta para demarcação de estacionamento", "sinalização viária" |
| `/calculadora` | calcular quantidade de tinta | "quanto de tinta para 100m²", "quantas demãos de tinta" |
| `/onde-comprar` | revenda de tintas / onde comprar {linha} | "revendedor Maestria em {UF}" (páginas de loja) |

**Regras operacionais:**
- `canonical` absoluta; views filtradas → canonical da categoria raiz + `noindex` (evita thin duplicate, D09).
- `sitemap.xml` gerado (todas as rotas SSG + lojas); `robots.txt` permite tudo exceto `/api/`.
- `hreflang`: `x-default` e `pt-BR` (expansão internacional futura do catálogo de distribuidores).
- OG/Twitter: imagem gerada por Satori (PDP: lata + cor; categoria: marca da linha).
- Validação: Rich Results Test em 100% das PDPs e lojas no go-live (critério de aceitação, seção 5).

### 4.4 Metas de Core Web Vitals e política de assets

**Budgets (obrigatórios em CI via Lighthouse CI e monitorados em campo):**

| Métrica | Meta p75 (campo) | Budget (labs, Moto G4/4G, 4× CPU) | Medição |
|---|---|---|---|
| **LCP** | ≤ 2.5s | ≤ 2.5s | RUM `web-vitals` + Lighthouse CI |
| **CLS** | ≤ 0.1 | ≤ 0.1 | RUM + Lighthouse CI |
| **INP** | ≤ 200ms | TBT ≤ 200ms (proxy em labs) | RUM (INP só existe em campo) |
| TTFB | ≤ 600ms | ≤ 600ms | Vercel Insights |
| JS total por página | — | ≤ 170KB gzip | Bundle analyzer no CI |
| Imagem LCP | — | ≤ 150KB (AVIF) | Lighthouse CI |
| Payload total da página | — | ≤ 900KB | Lighthouse CI |
| Fontes | — | ≤ 50KB (2 famílias, subset latin, 4 pesos) | next/font (self-hosted) |

**Política de otimização de ativos visuais:**
- **Formato:** AVIF com fallback WebP (`<picture>` via pipeline do CMS); sRGB; jamais PNG em foto. Latas: fotografia sobre fundo branco, 1200px (LCP) + 640px (cards) — máx. 2 variantes por imagem.
- **Texturas de acabamento:** 320px por textura (fosco/acetinado/semibrilho) para cards e comparativo de PDP.
- **CLS = 0 por construção:** `aspect-ratio` reservado em toda imagem (lata 4:3, cena 16:9); fontes com `font-display: swap` + métricas `size-adjust` do `next/font`; cookie banner renderiza **após** a primeira interação (não em overlay de carga — elimina CLS e bloqueio de conteúdo, D13); player de YouTube só monta thumbnail após clique (D: autoplay do site atual).
- **LCP:** hero da home é imagem única (carrossel eliminado, D08) com `fetchpriority="high"` + `<link rel="preload">`; todas as imagens fora da dobra com `loading="lazy"` + `decoding="async"`.
- **INP:** cálculo da calculadora client-side com debounce 300ms; filtros da categoria sem rede (payload SSG); `requestIdleCallback` para hidratação de seções secundárias (cases, FAQ).
- **Mapa:** tiles OSM auto-hospedadas em S3 (https), cluster de pins (o mapa global atual renderiza ~20 tiles e pins sem cluster); mapa da home com `loading="lazy"` na interseção.
- **Alts obrigatórios** com padrão: lata → "Lata de {litragem} de {produto}, acabamento {acabamento}"; aplicação → "Aplicação de {produto} em {superfície}, {ambiente}"; cor → "Amostra da cor {nome}, código {código}".
- **Imagens de cases/fotos institucionais:** recomprensão em AVIF na importação (alvo ≤ 120KB a 1200px); vídeos: hospedagem apenas em YouTube (embed diferido).

**A/B testing:** PostHog Experiments a partir do go-live; primeiro experimento = hero da home (CTA primário "Calcular quantidade" vs. "Ver catálogo") com N mínimo 5.000 sessões por braço.

---

## 5. Plano de Implementação

**Time mínimo (esforço relativo):**

| Papel | Alocação | Janela |
|---|---|---|
| Product Manager | 0.5 | Fases 0–5 |
| Design UI/UX | 1.0 | Fases 0–3 (handoff por fase) |
| Frontend (Next.js/React) | 2.0 | Fases 1–5 |
| Backend/API + dados | 1.0 | Fases 0–4 |
| QA (manual + automatizado) | 0.5 | Fases 2–5 |
| Conteúdo/dados (fichas, FISPQ, lojas) | 0.5 | Fases 0–2 (crítico para P0/P2) |

**Cronograma total: 14 semanas até go-live + 30 dias de otimização.**

| Fase | Semanas | Entregáveis prioritários | Critérios de aceitação técnica |
|---|---|---|---|
| **P0 — Descoberta e dados** | 1–2 | Auditoria 100% dos ~40 SKUs (campos 2.6) em planilha → importação no Sanity; inventário de BT/FISPQ disponíveis; geocoding da base de lojas (mapa global atual → `lojas`); mapa de 301 validado; baseline de performance (Lighthouse 20 URLs + CrUX); schema do CMS aprovada; LGPD/consent desenhado | Script de validação: 0 produto sem campo obrigatório 2.6; mapa de 301 revisado por PM + SEO (0 rota órfã); baseline documentado com métricas atuais (LCP/CLS/TBT) |
| **P1 — Fundação** | 2–4 | Repo + CI (lint, typecheck, test, Lighthouse CI, axe-core, Playwright); tokens (cor/tipografia/espaçamento) 1:1 com especificação; layout global (header, footer, breadcrumb, busca shell); componentes base (Button, ProductCard, Breadcrumb, Toast, forms); `/lgpd` + consent v2; analytics (GA4 + PostHog) com consent mode | axe-core: 0 erro crítico no layout; tokens compilam do fonte único (JSON → CSS); CI verde como gate de merge; consent mode validado (dados de analytics só após aceite) |
| **P2 — Catálogo e PDP** | 4–8 | 6 linhas + 5 sublinhas decorativas (SSG); PDP completa (galeria, painel de compra, specs, documentos, aplicação, relacionadas, FAQ, sticky mobile); `/downloads/[slug]` com contagem; 301s no ar em staging; JSON-LD (Product/ItemList/Breadcrumb/FAQ); OG por Satori; UAT com 5 pintores reais | Rich Results Test: 100% das PDPs e linhas válidas; 301 audit: 0 rota antiga fora do ar sem redirect, 0 loop; Lighthouse CI: LCP ≤ 2.5s e JS ≤ 170KB nas templates de categoria e PDP (Moto G4 perfil); UAT fluxo 2: PDP → FISPQ em ≤ 2 cliques para 5/5 pintores |
| **P3 — Ferramentas interativas** | 7–10 | `/calculadora` (autônoma + inline em PDP e home) com testes unitários do kernel; `/cores` + `/cores/[codigo]` com cenas pré-renderizadas; `/onde-comprar` com busca geo + mapa (tiles https, clusters); integração calculadora → orçamento/WhatsApp com volume | Testes do kernel da calculadora: 100% dos casos passando + property test (embalagem sugerida ≥ volume necessário); busca de lojas: p95 < 300ms com 500 lojas sintéticas; preview de cor: 0 requisição adicional na troca de cor; INP < 200ms em labs no flow calculadora |
| **P4 — B2B e conversão** | 10–12 | `/b2b` (hub, cotação-atacado, representação, assistência, documentos); validação de CNPJ; pipeline leads → Postgres → Resend → CRM (webhook) testado de ponta a ponta; templates de WhatsApp por contexto; cases (3+); home completa com todos os blocos 3.1; A/B do hero configurado (não ativo) | Envio de cotação: lead no CRM + e-mail em < 5s (testado em staging com CRM real); 100% dos CTAs do mapa de eventos (Anexo C) disparam; LGPD: gravação de lead sem consentimento explícito é impossível (teste de negative case) |
| **P5 — Go-live e estabilização** | 12–14 | Migração de DNS + 301s em produção; RUM ativo (web-vitals → PostHog); monitoramento Sentry + alertas de CWV; dashboard de funis (GA4/PostHog); plano de otimização 30/60/90; treinamento do time comercial (CRM) e de conteúdo (CMS) | Lighthouse CI verde em 100% das rotas do sitemap; 0 bug crítico aberto; RUM: p75 LCP ≤ 2.5s, CLS ≤ 0.1 nas primeiras 2 semanas (senão: freeze de features novas); 301 audit em produção: 0 falha |
| **Otimização (pós-go-live)** | 15–19 | Leituras de RUM; experimento A/B do hero; ajuste de faceting (ordem de grupos por uso real); expansão de conteúdo SEO (per linha); iteração de PDP com dados de heatmaps de CTA | Revisão quinzenal de KPIs (abaixo); 1 experimento com veredicto documentado até a semana 19 |

**Riscos e mitigações:**

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| FISPQ/BT incompletos para parte dos SKUs | Alta | Fluxo 2 quebra para linha industrial | Inventário em P0 como gate de P2; estado "em elaboração" com rota para assistência técnica (P07) — nunca form gate |
| Base de lojas sem endereço/geo válidos | Alta | Busca de `/onde-comprar` com erros | Coleta por formulário junto aos revendedores (rodada em P0–P1); exibir apenas registros geocodados com confiança ≥ 80% |
| Preços não podem ser públicos (política comercial) | Alta | `Product.offers` ausente | Mantém "sob consulta" + CTA de cotação; schema `offers` adicionado apenas se política mudar (não bloqueia nada) |
| Dados de consumo/rendimento sem fonte técnica por SKU | Média | Calculadora gera número errado → dano de confiança | Campo obrigatório 2.6 revisado pelo técnico da Maestria (P0); produto sem consumo validado exibe calculadora em modo "estimativa" com aviso e CTA de orçamento |
| Escopo de categorias/sublinhas crescer durante a migração | Média | Slippage em P2 | Sitemap congelado em P0; mudanças entram no backlog da fase de otimização |

**KPIs de acompanhamento (dashboard único, 30/60/90 dias):**

| KPI | Definição | Alvo 90 dias |
|---|---|---|
| CVR de cotação | `quote_submitted` / sessões de PDP | Baseline + 20% (baseline = formulário atual, se medido; senão, estabelecer em 14–28 dias) |
| Downloads FISPQ/BT | `doc_download` / mês, por SKU | 100% dos SKUs industriais com ≥ 1 download/mês |
| Conclusão da calculadora | `calc_completed` / `calc_started` | ≥ 40% |
| Conversão calculadora → ação | `calc_quote_click` + `calc_wa_click` / `calc_completed` | ≥ 50% |
| CTR do WhatsApp em PDP | `wa_click` / `pdp_view` | ≥ 25% |
| Busca de loja | `store_opened` / sessões B2C | ≥ 15% |
| CWV campo | p75 LCP/CLS/INP (RUM/CrUX) | Verde (≤ 2.5s / ≤ 0.1 / ≤ 200ms) |
| Orgânico | Impressões mensais (GSC) | +25% em 90 dias; 100% das PDPs indexadas |

---

## 6. Critérios de Aceitação Globais

- [ ] 100% das rotas do sitemap renderizadas SSG com HTML completo no servidor (verificado via `curl` sem JS).
- [ ] axe-core: 0 violação crítica/serious em home, 1 categoria, 1 PDP, calculadora, onde-comprar e forms B2B.
- [ ] Pares de contraste da seção 2.2 validados por script no CI (tolerância: nenhum par abaixo do valor tabelado).
- [ ] Lighthouse CI: todos os budgets da tabela 4.4 verdes em todas as templates (Moto G4 / 4G / 4× CPU).
- [ ] RUM: p75 LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms nas primeiras 2 semanas de produção.
- [ ] Rich Results Test: 100% de validação das PDPs, categorias, cores, lojas e FAQs.
- [ ] Mapa de 301: 0 rota legível do domínio antigo sem redirect; 0 redirect loop; 0 404 em URLs do sitemap.
- [ ] Eventos do Anexo C: 100% emitidos e presentes no PostHog (teste de fumaça de funil por fluxos 1–3).
- [ ] LGPD: consent mode v2 ativo; leads sem consentimento não gravam; política em `/lgpd` com DPO.
- [ ] FISPQ/BT: 100% dos SKUs industriais com download direto funcional em produção.
- [ ] UAT: 3 fluxos prioritários concluídos por 5 usuários reais (2 B2C, 2 profissionais, 1 B2B) sem assistência.
- [ ] Backup/plano de rollback: snapshot de DNS + build anterior disponível para rollback < 30 min.

---

## Anexo A — Contratos de dados

```ts
// Line
interface Line {
  slug: string;            // "tintas-decorativas"
  name: string;            // "Tintas Decorativas"
  description: string;     // 120–160 chars (SEO)
  heroImage: ImageAsset;
  sublines?: { slug: string; name: string }[];
  keywordPrimary: string;
}

// Product (espelha o contrato obrigatório da seção 2.6)
interface Product {
  slug: string;
  sku: string;
  name: string;
  subline: "FORMULA" | "JULIEN" | "SOLS" | "AXION" | "CREPI";
  line: string;                      // slug de Line
  base: "agua" | "solvente";
  finishes: ("fosco" | "acetinado" | "semibrilho" | "brilhante")[];
  surfaces: ("alvenaria" | "concreto" | "gesso" | "madeira" | "metal" | "asfalto")[];
  environments: ("interno" | "externo")[];
  segment: "economica" | "standard" | "premium";
  formats: { size: "1L" | "3.6L" | "18L" | "200L"; code: string; priceBRL?: number }[];
  consumoM2PorLDemao: number;
  demaoPadrao: number;               // 1–6
  diluir: string;
  secagem: { aoToqueH: number; entreDemaoH: number; totalH: number };
  vocGL?: number;
  normas?: string[];
  validadeMeses: number;
  btPdf?: { url: string; version: string; updatedAt: string };
  fisqpPdf?: { url: string; version: string; updatedAt: string };
  colors: string[];                  // códigos Color
  images: { lata: Record<string, ImageAsset>; aplicacao: ImageAsset; textura?: ImageAsset; acabamento?: ImageAsset };
  applicationSteps: string[];        // 4 passos
  metaTitle: string; metaDesc: string;
  featured: boolean;
  faq?: { q: string; a: string }[];
}

// Color
interface Color {
  code: string;        // "MST-1004"
  name: string;
  family: string;
  hex: string;
  lrv: number;         // 0–100
  reference?: string;  // NCS / interColor
}

// Store
interface Store {
  slug: string;
  name: string;
  type: "revenda" | "distribuidor" | "matriz";
  address: { street: string; number: string; district: string; city: string; uf: string; cep: string };
  geo: { lat: number; lng: number; confidence: number }; // confidence 0–1
  phones: string[];
  hours: string;
  productCodes?: string[];  // estoque/sortimento (quando o revendedor alimentar)
}

// Lead
interface Lead {
  id: string; token: string;    // token = idempotência
  segment: "b2c" | "pro" | "b2b";
  channel: "quote" | "b2b_quote" | "b2b_repr" | "support" | "store_fallback";
  contact: { name: string; phone?: string; email?: string; company?: string; cnpj?: string; city?: string };
  payload: { productSlug?: string; colorCode?: string; format?: string; qty?: number; areaM2?: number; liters?: number; lines?: string[]; message?: string };
  consent: { lgpd: boolean; marketing?: boolean; at: string };
  createdAt: string;
  crmId?: string;
}
```

**Webhooks:** Sanity → `POST /api/revalidate` com tags (`product:slug`, `line:slug`, `all`) → `revalidateTag`. Sanidade do catálogo: validação dos campos obrigatórios no webhook de publish (rejeita com log).

## Anexo B — Fórmula da calculadora de rendimento

```
litros_necessarios = (area_m2 × demãos × (1 + perda)) / m2_por_l_por_demao
perda = 0.10 (fixa na v1, exibida ao usuário)
```

**Embalagens recomendadas:** algoritmo guloso do maior formato disponível do produto (200L → 18L → 3.6L → 1L), arredondando a última unidade para cima. Saída sempre com justificativa: "para X L, recomendamos A× 18L + B× 3.6L (= Y L)".

**Exemplo 1 (residencial):** área de 84 m² (paredes de um apartamento padrão), 2 demãos, 10 m²/L/demão.
`litros = (84 × 2 × 1.10) / 10 = 18.48 L` → embalagens: `1× 18L + 1× 1L = 19 L` (cobre 18.48 L com folga de 0.52 L).

**Exemplo 2 (não divisível):** 60 m², 2 demãos, 10 m²/L/demão → `13.2 L` → `3× 3.6L + 3× 1L = 13.8 L` (18L excede o volume em 48% — o algoritmo prioriza o menor desperdício quando o maior formato sobra > 30% do volume: regra de tie-break documentada nos testes).

**Regras de validação:** `area ∈ [1, 100000]`, `demãos ∈ [1,6]`, `m2_por_l_por_demao ∈ [1, 50]` (fora da faixa, o produto não alimenta a calculadora e exibe aviso "consulte rendimento na ficha"). Testes mínimos: divisibilidade exata, sobra < 30%, sobra > 30%, produto sem 18L, produto com 200L, área mínima 1 m², demãos 1 (selador).

## Anexo C — Mapa de eventos de analytics

| Evento | Gatilho | Parâmetros obrigatórios |
|---|---|---|
| `page_view` | Toda navegação SPA + SSG | `path`, `line?`, `sku?` |
| `search` | Submissão da busca global | `query`, `results_count` |
| `search_result_click` | Clique em resultado | `query`, `type` (product/color/doc), `id` |
| `card_click` | Clique em ProductCard | `sku`, `position` |
| `card_cta_bt` / `card_cta_quote` | CTAs do card | `sku` |
| `pdp_view` | Entrada na PDP | `sku`, `format`, `color?`, `source` |
| `color_view` / `color_select` / `color_copy` | Cartela, seletor, home | `code`, `context` (home/pdp/cartela) |
| `color_products_cta` | "ver produtos com esta cor" | `code`, `n` |
| `calc_started` | Primeiro input válido | `context` (home/pdp/calc) |
| `calc_completed` | Cálculo concluído | `area_m2`, `demoes`, `litros`, `sku?` |
| `calc_quote_click` / `calc_wa_click` | CTAs do resultado | `litros`, `sku?` |
| `format_change` | Troca de litragem em PDP | `sku`, `from`, `to` |
| `quote_submitted` | Envio do modal de orçamento | `sku?`, `format?`, `qty?`, `liters?`, `segment` |
| `quote_thanks_view` | Página de sucesso | `segment` |
| `doc_download` | Download BT/FISPQ | `sku`, `doc` (bt/fisqp) |
| `doc_capture_optin` | Aceite do toast progressivo | `sku` |
| `wa_click` | Abertura de wa.me | `context` (global/pdp/calc/b2b), `sku?`, `liters?` |
| `store_search` | Busca em /onde-comprar | `query`, `results_count` |
| `store_opened` | Detalhe de loja | `store_slug` |
| `b2b_hub_view` | Hub /b2b | — |
| `b2b_quote_submitted` / `b2b_repr_submitted` | Envio dos forms B2B | `lines[]`, `volume_est?` |
| `b2b_support_submitted` | Assistência técnica | `sku?`, `issue_type` |
| `filter_apply` / `filter_clear` | Facets da categoria | `line`, `facet`, `value` |
| `consent_accepted` / `consent_rejected` | Cookie banner | `categories[]` |

**Instrumentação:** eventos unificados via wrapper `track(event, params)` no PostHog + espelho GA4 (medição sob consent mode v2). Nome de página (virtual pages) = path + facets significativos para a categoria.

---

*Documento final da especificação v1.0. Decisões de projeto (preços públicos, SLA comercial, nomes de sublinhas) devem ser confirmadas com a Maestria durante a P0; nenhuma delas bloqueia o início das fases 1–2.*
