import type { Color, Line, Product } from "../types/catalog";

export const lines: Line[] = [
  {
    slug: "tintas-decorativas",
    name: "Tintas Decorativas",
    description:
      "Acrílicos, texturas e esmaltes para parede interna e externa, da econômica ao premium.",
    keywordPrimary: "tinta acrílica",
    image: "/images/textura-parede.jpg",
  },
  {
    slug: "demarcacao-viaria",
    name: "Demarcação Viária",
    description:
      "Tintas de alta reflectância para sinalização de estacionamentos, vias e faixas, com secagem extra rápida.",
    keywordPrimary: "tinta para demarcação viária",
    image: "/images/aplicacao-axion.jpg",
  },
  {
    slug: "demarcacao-esportes",
    name: "Demarcação Esportes",
    description:
      "Sistemas de demarcação de campos e quadras com abrasão controlada e durabilidade comprovada.",
    keywordPrimary: "demarcação de campos",
    image: "/images/aplicacao-campo.jpg",
  },
  {
    slug: "pisos-industriais",
    name: "Pisos Industriais",
    description:
      "Epóxis e poliuretanos para pisos de concreto: tráfego pesado, química e limpeza rigorosa.",
    keywordPrimary: "tinta para piso industrial",
    image: "/images/aplicacao-epoxi.jpg",
  },
  {
    slug: "tintas-anticorrosivas",
    name: "Tintas Anticorrosivas",
    description:
      "Proteção de estruturas metálicas e manutenção industrial com ciclos completos de defesa.",
    keywordPrimary: "tinta anticorrosiva",
    image: "/images/aplicacao-ferrocote.jpg",
  },
  {
    slug: "revestimentos",
    name: "Revestimentos",
    description:
      "Revestimentos texturizados para fachada e interior, com identidade arquitetural e durabilidade.",
    keywordPrimary: "revestimento para fachada",
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
    finishes: ["brilhante"],
    surfaces: ["concreto", "asfalto"],
    environments: ["interno", "externo"],
    formats: [
      { size: "1L", code: "FRM-DEC-1", priceBRL: 24.9 },
      { size: "3.6L", code: "FRM-DEC-36", priceBRL: 54.9 },
      { size: "18L", code: "FRM-DEC-18", priceBRL: 189.9 },
    ],
    consumoM2PorLDemao: 3,
    demaoPadrao: 1,
    diluir: "Até 10% com solvente FORMULA",
    secagem: { aoToqueH: 1, entreDemaoH: 4, totalH: 24 },
    btPdf: "/downloads/bt-formula-decosinal.pdf",
    fisqpPdf: "/downloads/fisqp-formula-decosinal.pdf",
    colors: ["MST-1001", "MST-1006", "MST-1003"],
    images: {
      lata: "/images/lata-decosinal.jpg",
      aplicacao: "/images/aplicacao-decosinal.jpg",
      textura: "/images/textura-parede.jpg",
    },
    description:
      "Tinta acrílica a base de solvente de secagem extra rápida para demarcação de estacionamentos, faixas e áreas industriais em concreto e asfalto. Alta visibilidade e resistência ao tráfego.",
    applicationSteps: [
      "Limpe a superfície: remova graxa, poeira e solventes residuais com escova de aço e solvente apropriado.",
      "Dilua até 10% com solvente FORMULA e homogeneize antes da aplicação.",
      "Aplique 1 demão com rolo de espuma, pincel ou airless, em faixas de 10 cm.",
      "Cure total em 24 h; liberação ao tráfego leve após 4 h.",
    ],
    metaTitle: "Formula Decosinal — Demarcação de Alto Tráfego | Maestria",
    metaDescription:
      "Formula Decosinal: acrílica a base de solvente, secagem em 1 h, rendimento de 3 m²/L. BT e FISPQ em um clique.",
    featured: true,
  },
  {
    slug: "julien-ferrocote",
    sku: "JUL-FER-18",
    name: "Julien Ferrocote",
    subline: "JULIEN",
    line: "tintas-anticorrosivas",
    base: "solvente",
    finishes: ["semibrilho"],
    surfaces: ["metal"],
    environments: ["interno", "externo"],
    formats: [
      { size: "3.6L", code: "JUL-FER-36" },
      { size: "18L", code: "JUL-FER-18" },
      { size: "200L", code: "JUL-FER-200" },
    ],
    consumoM2PorLDemao: 8,
    demaoPadrao: 2,
    diluir: "Até 15% com solvente JULIEN",
    secagem: { aoToqueH: 2, entreDemaoH: 6, totalH: 36 },
    btPdf: "/downloads/bt-julien-ferrocote.pdf",
    fisqpPdf: "/downloads/fisqp-julien-ferrocote.pdf",
    colors: ["MST-1005", "MST-1003", "MST-1001"],
    images: {
      lata: "/images/lata-ferrocote.jpg",
      aplicacao: "/images/aplicacao-ferrocote.jpg",
      textura: "/images/textura-parede.jpg",
    },
    description:
      "Esmalte anticorrosivo de alta defesa para estruturas metálicas, galvanizadas preparadas e manutenção industrial. Ciclos de proteção para ambientes severos e intempéries.",
    applicationSteps: [
      "Prepare o metal: escove a zona (Sa 2.5) e remova óleos com desengraxante.",
      "Aplique primer antioxidante JULIEN (quando especificado no ciclo).",
      "Dilua até 15% com solvente JULIEN; aplique 2 demãos de 150–200 µm.",
      "Respeite 6 h entre demãos; entrega final após 36 h.",
    ],
    metaTitle: "Julien Ferrocote — Esmalte Anticorrosivo | Maestria",
    metaDescription:
      "Julien Ferrocote: esmalte anticorrosivo para metal, 8 m²/L/demão, ciclo completo de defesa. Fichas técnicas para download.",
    featured: true,
  },
  {
    slug: "sols-epoxi-industrial",
    sku: "SOL-EPI-18",
    name: "SOLS Epóxi Industrial",
    subline: "SOLS",
    line: "pisos-industriais",
    base: "agua",
    finishes: ["semibrilho", "brilhante"],
    surfaces: ["concreto"],
    environments: ["interno"],
    formats: [
      { size: "18L", code: "SOL-EPI-18" },
      { size: "200L", code: "SOL-EPI-200" },
    ],
    consumoM2PorLDemao: 6,
    demaoPadrao: 2,
    diluir: "Até 10% com água potável",
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
      "Sistema epóxi-acrílico à base de água para pisos de concreto industrial: resistência química, a abrasão e a lavagem de alta pressão. Acabamento semibrilho ou brilhante.",
    applicationSteps: [
      "Aperte o piso: moagem diamantada até a pasta fresca, aspiração completa.",
      "Aplique selador epóxi por espátula lisa (0,2 mm).",
      "Dilua até 10% com água potável; aplique 2 demãos de 600 g/m².",
      "Cura total em 48 h; liberação de tráfego em 72 h.",
    ],
    metaTitle: "SOLS Epóxi Industrial — Piso de Concreto | Maestria",
    metaDescription:
      "SOLS Epóxi Industrial: sistema para pisos de concreto, 6 m²/L/demão, resistência química e a abrasão. Calcule o volume em segundos.",
    featured: true,
  },
  {
    slug: "axion-demarcacao-viaria",
    sku: "AXI-DEM-18",
    name: "AXION Demarcação Viária",
    subline: "AXION",
    line: "demarcacao-viaria",
    base: "solvente",
    finishes: ["brilhante"],
    surfaces: ["asfalto", "concreto"],
    environments: ["externo"],
    formats: [
      { size: "18L", code: "AXI-DEM-18" },
      { size: "200L", code: "AXI-DEM-200" },
    ],
    consumoM2PorLDemao: 2.5,
    demaoPadrao: 1,
    diluir: "Até 5% com solvente AXION",
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
      "Tinta demarcante viária de secagem ultra rápida (30 min ao toque) com alta reflectância para sinalização horizontal em asfalto e concreto. Conformidade com sinalização rodoviária.",
    applicationSteps: [
      "Vareie o pavimento; remova graxa e água com escova e jato de ar.",
      "Misture a tinta por 3 min; dilua até 5% com solvente AXION.",
      "Demarque com máquina demarcadora ou rolo de 10 cm, 1 demão.",
      "Liberação total em 24 h; tráfego leve após 2 h.",
    ],
    metaTitle: "AXION Demarcação Viária — Secagem em 30 Min | Maestria",
    metaDescription:
      "AXION Demarcação Viária: alta reflectância, secagem em 30 min, 2,5 m²/L. Para sinalização em asfalto e concreto.",
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
