import type { Color, Line, Product } from "../types/catalog";

export const lines: Line[] = [
  {
    slug: "tintas-decorativas",
    name: "Formula Imobiliária e Decorativa",
    description:
      "Acrílicos Premium, Standard e Econômicos, esmaltes, massas e texturas. Do preparo ao acabamento, com cobertura e rendimento para obra e reforma.",
    keywordPrimary: "tinta acrílica Formula",
    image: "/images/textura-parede.jpg",
  },
  {
    slug: "demarcacao-viaria",
    name: "Axion Demarcação Viária",
    description:
      "Sinalização horizontal com secagem rápida e visibilidade diurna e noturna. Para vias, estacionamentos e áreas industriais.",
    keywordPrimary: "tinta para demarcação viária",
    image: "/images/aplicacao-axion.jpg",
  },
  {
    slug: "demarcacao-esportes",
    name: "Stadium Demarcação Esportiva",
    description:
      "A tinta oficial dos grandes estádios. Demarcadores inofensivos à grama, com visibilidade para o VAR.",
    keywordPrimary: "tinta para demarcação de gramado",
    image: "/images/aplicacao-campo.jpg",
  },
  {
    slug: "pisos-industriais",
    name: "Sols Pisos Industriais",
    description:
      "Sistemas epóxi e poliuretano em primer e acabamento. Tráfego pesado, resistência química e limpeza rigorosa sobre concreto.",
    keywordPrimary: "sistema epóxi para piso industrial",
    image: "/images/aplicacao-epoxi.jpg",
  },
  {
    slug: "tintas-anticorrosivas",
    name: "Julien Proteção Anticorrosiva",
    description:
      "Primários e intermediários epóxi de origem francesa para estruturas metálicas em ambientes marítimos e industriais. Sistemas certificados ACQPA.",
    keywordPrimary: "primário epóxi anticorrosivo",
    image: "/images/aplicacao-ferrocote.jpg",
  },
  {
    slug: "revestimentos",
    name: "Crepi Revestimentos de Fachada",
    description:
      "Revestimentos acrílicos texturizados e hidrorepelentes. Efeitos Granite, Pierre, Velouté e MetalliK para proteção e decoração de fachadas.",
    keywordPrimary: "revestimento acrílico para fachada",
    image: "/images/hero.jpg",
  },
];

export const colors: Color[] = [
  {
    code: "MST-1001",
    name: "Branco Gesso",
    family: "Neutros",
    hex: "#F4F1EA",
    lrv: 87,
    reference: "NCS S 0502-Y",
  },
  {
    code: "MST-1002",
    name: "Verde Musgo",
    family: "Verdes",
    hex: "#6B705C",
    lrv: 22,
    reference: "NCS S 4010-G30Y",
  },
  {
    code: "MST-1003",
    name: "Azul Profundo",
    family: "Azuis",
    hex: "#23446F",
    lrv: 12,
    reference: "NCS S 6030-B",
  },
  {
    code: "MST-1004",
    name: "Terracota Maestria",
    family: "Terrosos",
    hex: "#B4552D",
    lrv: 24,
    reference: "NCS S 4040-Y30R",
  },
  {
    code: "MST-1005",
    name: "Cinza Basalto",
    family: "Neutros",
    hex: "#4A4E57",
    lrv: 16,
    reference: "NCS S 4005-N",
  },
  {
    code: "MST-1006",
    name: "Ocre Demarcação",
    family: "Terrosos",
    hex: "#D9A21B",
    lrv: 52,
    reference: "NCS S 1060-Y",
  },
];

export const products: Product[] = [
  {
    slug: "formula-decosinal",
    sku: "FRM-DEC-18",
    name: "Formula Decosinal",
    subline: "FORMULA",
    line: "demarcacao-viaria",
    base: "solvente",
    finishes: ["fosco"],
    surfaces: ["concreto", "asfalto"],
    environments: ["externo"],
    formats: [
      { size: "1L", code: "FRM-DEC-1" },
      { size: "3.6L", code: "FRM-DEC-36" },
      { size: "18L", code: "FRM-DEC-18" },
    ],
    consumoM2PorLDemao: 1.5,
    demaoPadrao: 1,
    diluir: "Até 5% com Diluente D-550",
    secagem: { aoToqueH: 0.33, entreDemaoH: 0.33, totalH: 24 },
    btPdf: "/downloads/bt-formula-decosinal.pdf",
    fisqpPdf: "/downloads/fisqp-formula-decosinal.pdf",
    colors: ["MST-1001", "MST-1006"],
    images: {
      lata: "/images/lata-decosinal.jpg",
      aplicacao: "/images/aplicacao-decosinal.jpg",
      textura: "/images/textura-parede.jpg",
    },
    description:
      "Tinta acrílica estirenada monocomponente para demarcação viária retrorrefletiva, com aspersão de microesferas de vidro. Secagem rápida e visibilidade diurna e noturna em trabalhos novos ou repinturas. Liberação ao tráfego em 20 minutos.",
    applicationSteps: [
      "Prepare o pavimento: superfície limpa, seca e isenta de graxa, poeira e umidade.",
      "Homogeneíze e dilua até 5% com Diluente D-550.",
      "Aplique em 1 demão e asperja microesferas de vidro para retrorreflexão.",
      "Libere ao tráfego após 20 minutos. Rendimento de referência: 1,5 m²/L a 0,6 mm.",
    ],
    metaTitle: "Formula Decosinal, Demarcação Viária | Maestria",
    metaDescription:
      "Formula Decosinal: tinta acrílica para demarcação viária retrorrefletiva. Tráfego em 20 min, 1,5 m²/L. Baixe BT e FISPQ.",
    featured: true,
  },
  {
    slug: "julien-ferrocote",
    sku: "JUL-FER-18",
    name: "Julien Ferrocote",
    subline: "JULIEN",
    line: "tintas-anticorrosivas",
    base: "bicomponente",
    finishes: ["acetinado"],
    surfaces: ["metal"],
    environments: ["interno", "externo"],
    formats: [
      { size: "3.6L", code: "JUL-FER-36" },
      { size: "18L", code: "JUL-FER-18" },
      { size: "200L", code: "JUL-FER-200" },
    ],
    consumoM2PorLDemao: 8,
    demaoPadrao: 2,
    diluir: "Fornecido em 2 componentes. Mistura 85/15 em volume. Consulte o boletim técnico.",
    secagem: { aoToqueH: 6, entreDemaoH: 12, totalH: 24 },
    btPdf: "/downloads/bt-julien-ferrocote.pdf",
    fisqpPdf: "/downloads/fisqp-julien-ferrocote.pdf",
    colors: ["MST-1005", "MST-1001"],
    images: {
      lata: "/images/lata-ferrocote.jpg",
      aplicacao: "/images/aplicacao-ferrocote.jpg",
      textura: "/images/textura-parede.jpg",
    },
    description:
      "Primário e intermediário epóxi de dois componentes, altos sólidos e secagem rápida, pigmentado com fosfato de zinco. Proteção de longa duração para estruturas metálicas em ambientes marítimos e industriais. Certificação ACQPA 23422.",
    applicationSteps: [
      "Prepare o aço: decapagem Sa 2 1/2 ou hidrojateamento UHP sobre revestimento antigo em bom estado.",
      "Misture os 2 componentes na proporção 85/15 em volume e homogeneíze.",
      "Aplique em 2 demãos conforme o sistema especificado, cerca de 100 µm por demão.",
      "Respeite 12 h entre demãos a 20 °C. Cura total em 24 h.",
    ],
    metaTitle: "Julien Ferrocote, Primário Epóxi | Maestria",
    metaDescription:
      "Julien Ferrocote: primário epóxi 2 componentes, altos sólidos e fosfato de zinco. Certificação ACQPA. Fichas para download.",
    featured: true,
  },
  {
    slug: "sols-epoxi-industrial",
    sku: "SOL-EPI-18",
    name: "Sols Epóxi Industrial",
    subline: "SOLS",
    line: "pisos-industriais",
    base: "bicomponente",
    finishes: ["brilhante"],
    surfaces: ["concreto"],
    environments: ["interno"],
    formats: [
      { size: "18L", code: "SOL-EPI-18" },
      { size: "200L", code: "SOL-EPI-200" },
    ],
    consumoM2PorLDemao: 6,
    demaoPadrao: 2,
    diluir: "Sistema sem solvente. Preparo e mistura conforme o boletim do sistema.",
    secagem: { aoToqueH: 4, entreDemaoH: 8, totalH: 48 },
    btPdf: "/downloads/bt-sols-epoxi-industrial.pdf",
    fisqpPdf: "/downloads/fisqp-sols-epoxi-industrial.pdf",
    colors: ["MST-1005", "MST-1002", "MST-1001"],
    images: {
      lata: "/images/lata-epoxi.jpg",
      aplicacao: "/images/aplicacao-epoxi.jpg",
      textura: "/images/textura-parede.jpg",
    },
    description:
      "Sistema epóxi sem solvente para pisos de concreto: primer e acabamento em camadas de alta espessura. Resiste ao tráfego pesado, à abrasão e à lavagem rigorosa em indústria e comércio.",
    applicationSteps: [
      "Prepare o concreto: tratamento mecânico, aspiração e correção da planicidade quando indicado.",
      "Aplique o primer a rolo ou trincha. Sobre substrato poroso, preveja a segunda demão.",
      "Execute o acabamento autonivelante a espátula dentada e rolo fura-bolha, na espessura do sistema.",
      "Respeite a cura total antes de liberar o tráfego. Rendimentos variam com a porosidade do substrato.",
    ],
    metaTitle: "Sols Epóxi Industrial, Pisos | Maestria",
    metaDescription:
      "Sols: sistema epóxi sem solvente para pisos de concreto. Primer e acabamento autonivelante para tráfego pesado.",
    featured: true,
  },
  {
    slug: "axion-demarcacao-viaria",
    sku: "AXI-DEM-18",
    name: "Axion Demarcação Viária",
    subline: "AXION",
    line: "demarcacao-viaria",
    base: "solvente",
    finishes: ["fosco"],
    surfaces: ["asfalto", "concreto"],
    environments: ["externo"],
    formats: [
      { size: "18L", code: "AXI-DEM-18" },
      { size: "200L", code: "AXI-DEM-200" },
    ],
    consumoM2PorLDemao: 2.5,
    demaoPadrao: 1,
    diluir: "Até 5% com o diluente indicado no boletim técnico",
    secagem: { aoToqueH: 0.5, entreDemaoH: 2, totalH: 24 },
    btPdf: "/downloads/bt-axion-demarcacao.pdf",
    fisqpPdf: "/downloads/fisqp-axion-demarcacao.pdf",
    colors: ["MST-1001", "MST-1006"],
    images: {
      lata: "/images/lata-axion.jpg",
      aplicacao: "/images/aplicacao-axion.jpg",
      textura: "/images/textura-parede.jpg",
    },
    description:
      "Tinta para sinalização horizontal com secagem ultrarrápida e alta visibilidade. Para vias, faixas e estacionamentos em asfalto e concreto, em obras novas ou repinturas.",
    applicationSteps: [
      "Limpe o pavimento: varrição e remoção de graxa e umidade com escova e jato de ar.",
      "Homogeneíze por 3 minutos. Dilua até 5% conforme o boletim técnico.",
      "Demarque em 1 demão. Asperja microesferas para retrorreflexão noturna.",
      "Toque em 30 minutos. Tráfego leve após 2 h e liberação total em 24 h.",
    ],
    metaTitle: "Axion Demarcação Viária, 30 Min | Maestria",
    metaDescription:
      "Axion: tinta para sinalização horizontal em asfalto e concreto. Toque em 30 min e alta visibilidade. BT e FISPQ para download.",
    featured: true,
  },
];

/** alias em pt-BR usado nas páginas */
export const produtos = products;

export function contarPorLinha(lineSlug: string): number {
  return products.filter((p) => p.line === lineSlug).length;
}

export function produtosPorLinha(lineSlug: string): Product[] {
  return products.filter((p) => p.line === lineSlug);
}

export function linhaPorSlug(slug: string): Line | undefined {
  return lines.find((l) => l.slug === slug);
}

export function corPorCodigo(code: string): Color | undefined {
  return colors.find((c) => c.code === code);
}

export function coresDoProduto(codes: string[]): Color[] {
  return codes
    .map((code) => corPorCodigo(code))
    .filter((c): c is Color => c !== undefined);
}
