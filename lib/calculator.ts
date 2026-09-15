import type { CalculationResult, ProductFormat } from "../types/catalog";

/** Perda de aplicação fixa (10%), exibida ao usuário */
export const PERDA_PADRAO = 0.1;

/**
 * Regra de tie-break de desperdício: quando a lata de um formato grande
 * deixaria sobra superior a 30% do volume necessário, o algoritmo prioriza
 * múltiplos dos formatos menores (3.6L / 1L) para reduzir o desperdício.
 */
export const TIE_BREAK_FRACAO = 0.3;

export const LIMITES = {
  areaMin: 1,
  areaMax: 100000,
  demaoMin: 1,
  demaoMax: 6,
  consumoMin: 1,
  consumoMax: 50,
} as const;

export interface CalculatorInput {
  areaM2: number;
  demaos: number;
  consumoM2PorLDemao: number;
}

const EPS = 1e-6;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Converte rótulo de litragem ("3.6L") em número. */
export function parseLitros(size: string): number {
  const n = Number.parseFloat(size.replace(/[^\d.,]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Validação de limites de entrada.
 * Retorna lista de erros (vazia quando a entrada é válida).
 */
export function validarInput(input: CalculatorInput): string[] {
  const erros: string[] = [];
  const { areaM2, demaos, consumoM2PorLDemao } = input;

  if (!Number.isFinite(areaM2)) {
    erros.push("Informe uma área válida em m².");
  } else if (areaM2 < LIMITES.areaMin || areaM2 > LIMITES.areaMax) {
    erros.push(
      `A área deve estar entre ${LIMITES.areaMin} e ${LIMITES.areaMax} m².`,
    );
  }

  if (
    !Number.isInteger(demaos) ||
    demaos < LIMITES.demaoMin ||
    demaos > LIMITES.demaoMax
  ) {
    erros.push(
      `O número de demãos deve ser inteiro, entre ${LIMITES.demaoMin} e ${LIMITES.demaoMax}.`,
    );
  }

  if (
    !Number.isFinite(consumoM2PorLDemao) ||
    consumoM2PorLDemao < LIMITES.consumoMin ||
    consumoM2PorLDemao > LIMITES.consumoMax
  ) {
    erros.push(
      "Rendimento do produto fora da faixa técnica (1 a 50 m²/L/demão).",
    );
  }

  return erros;
}

/** Fórmula exata: litros = (área × demãos × 1,10) / rendimento */
export function calcularLitros(input: CalculatorInput): number {
  const { areaM2, demaos, consumoM2PorLDemao } = input;
  return (areaM2 * demaos * (1 + PERDA_PADRAO)) / consumoM2PorLDemao;
}

/**
 * Recomendação gulosa de embalagens (200L → 18L → 3.6L → 1L), com a regra
 * de tie-break de 30% quando uma lata grande ficaria majoritariamente vazia.
 * Sempre cobre o volume necessário (a última unidade arredonda para cima).
 */
export function calcular(
  input: CalculatorInput,
  formats: ProductFormat[],
): CalculationResult {
  const litros = calcularLitros(input);
  const sizes = Array.from(new Set(formats.map((f) => f.size))).sort(
    (a, b) => parseLitros(b) - parseLitros(a),
  );

  const counts = new Map<string, number>();
  let remaining = litros;

  for (let i = 0; i < sizes.length && remaining > EPS; i += 1) {
    const size = sizes[i];
    const v = parseLitros(size);
    const isLast = i === sizes.length - 1;

    if (remaining < v) {
      // Uma lata única deste formato cobriria o restante com sobra.
      const sobraSeTivesse = v - remaining;
      if (!isLast && sobraSeTivesse > TIE_BREAK_FRACAO * remaining) {
        continue; // desperdício acima de 30%: prefere formatos menores
      }
      const count = isLast ? Math.ceil(remaining / v) : 1;
      counts.set(size, (counts.get(size) ?? 0) + count);
      remaining = isLast ? 0 : Math.max(0, remaining - v);
    } else {
      const count = isLast
        ? Math.ceil(remaining / v)
        : Math.floor(remaining / v);
      counts.set(size, (counts.get(size) ?? 0) + count);
      remaining = isLast ? 0 : remaining - count * v;
    }
  }

  // segurança: garante cobertura do volume restante com o menor formato
  if (remaining > EPS) {
    const min = sizes[sizes.length - 1];
    counts.set(min, (counts.get(min) ?? 0) + Math.ceil(remaining / parseLitros(min)));
  }

  const embalagensRecomendadas = Array.from(counts.entries())
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => parseLitros(b.size) - parseLitros(a.size));

  const volumeTotalFornecido = round2(
    embalagensRecomendadas.reduce(
      (acc, e) => acc + e.count * parseLitros(e.size),
      0,
    ),
  );

  return {
    litrosNecessarios: round2(litros),
    embalagensRecomendadas,
    volumeTotalFornecido,
    sobraLitros: round2(volumeTotalFornecido - litros),
  };
}
