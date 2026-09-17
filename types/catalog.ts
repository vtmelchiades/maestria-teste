export type Subline = "FORMULA" | "JULIEN" | "SOLS" | "AXION" | "CREPI";

export type Base = "agua" | "solvente" | "bicomponente";

export type Finish = "fosco" | "acetinado" | "semibrilho" | "brilhante";

export type Surface =
  | "alvenaria"
  | "concreto"
  | "gesso"
  | "madeira"
  | "metal"
  | "asfalto";

export type Environment = "interno" | "externo";

export interface ProductFormat {
  size: string;
  code: string;
  priceBRL?: number;
}

export interface ProductImages {
  /** Foto da lata (estúdio, fundo neutro) */
  lata: string;
  /** Foto de aplicação em obra real */
  aplicacao: string;
  /** Textura de acabamento (close) */
  textura: string;
}

export interface Product {
  slug: string;
  sku: string;
  name: string;
  subline: Subline;
  /** slug da linha (cf. Line.slug) */
  line: string;
  base: Base;
  finishes: Finish[];
  surfaces: Surface[];
  environments: Environment[];
  formats: ProductFormat[];
  /** Rendimento em m² litro, por demão */
  consumoM2PorLDemao: number;
  /** Demãos recomendadas pela ficha técnica */
  demaoPadrao: number;
  diluir: string;
  secagem: {
    aoToqueH: number;
    entreDemaoH: number;
    totalH: number;
  };
  btPdf: string;
  fisqpPdf: string;
  /** códigos Color (cf. Color.code) */
  colors: string[];
  images: ProductImages;
  description: string;
  applicationSteps: string[];
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
}

export interface Color {
  code: string;
  name: string;
  family: string;
  hex: string;
  /** luminância refletida (0–100) */
  lrv: number;
  /** referência NCS/interColor */
  reference: string;
}

export interface Line {
  slug: string;
  name: string;
  description: string;
  keywordPrimary: string;
  image: string;
}

export interface CalculationResult {
  litrosNecessarios: number;
  embalagensRecomendadas: { size: string; count: number }[];
  volumeTotalFornecido: number;
  sobraLitros: number;
}
