import { describe, expect, it } from "vitest";
import {
  LIMITES,
  calcular,
  calcularLitros,
  validarInput,
} from "./calculator";
import type { ProductFormat } from "../types/catalog";

const formatsDecosinal: ProductFormat[] = [
  { size: "1L", code: "FRM-DEC-1" },
  { size: "3.6L", code: "FRM-DEC-36" },
  { size: "18L", code: "FRM-DEC-18" },
];

describe("calculadora de rendimento — caso padrão (84 m²)", () => {
  it("aplica a fórmula exata com perda de 10% e recomenda 1×18L + 1×1L", () => {
    const input = { areaM2: 84, demaos: 2, consumoM2PorLDemao: 10 };

    expect(calcularLitros(input)).toBeCloseTo(18.48, 5);

    const r = calcular(input, formatsDecosinal);
    expect(r.litrosNecessarios).toBeCloseTo(18.48, 2);
    expect(r.embalagensRecomendadas).toEqual([
      { size: "18L", count: 1 },
      { size: "1L", count: 1 },
    ]);
    expect(r.volumeTotalFornecido).toBe(19);
    expect(r.sobraLitros).toBeCloseTo(0.52, 2);
  });
});

describe("calculadora de rendimento — tie-break de desperdício", () => {
  it("não força 1 lata de 18L quando a sobra ultrapassa 30% do volume", () => {
    // 60 m² × 2 demãos × 1,10 / 10 = 13,2 L
    const input = { areaM2: 60, demaos: 2, consumoM2PorLDemao: 10 };

    const r = calcular(input, formatsDecosinal);

    const de18 = r.embalagensRecomendadas.find((e) => e.size === "18L");
    expect(de18).toBeUndefined();
    expect(r.embalagensRecomendadas).toEqual([
      { size: "3.6L", count: 3 },
      { size: "1L", count: 3 },
    ]);
    expect(r.volumeTotalFornecido).toBe(13.8);
    expect(r.sobraLitros).toBeCloseTo(0.6, 2);
  });
});

describe("calculadora de rendimento — validação de limites", () => {
  it("rejeita área fora de [1, 100000], demãos fora de [1, 6] e consumo fora de [1, 50]", () => {
    expect(
      validarInput({ areaM2: 0, demaos: 2, consumoM2PorLDemao: 10 }),
    ).toHaveLength(1);
    expect(
      validarInput({
        areaM2: LIMITES.areaMax + 1,
        demaos: 2,
        consumoM2PorLDemao: 10,
      }),
    ).toHaveLength(1);
    expect(
      validarInput({ areaM2: 84, demaos: 7, consumoM2PorLDemao: 10 }),
    ).toHaveLength(1);
    expect(
      validarInput({ areaM2: 84, demaos: 2, consumoM2PorLDemao: 60 }),
    ).toHaveLength(1);
    expect(
      validarInput({
        areaM2: Number.NaN,
        demaos: 2,
        consumoM2PorLDemao: 10,
      }),
    ).toHaveLength(1);
  });

  it("aceita os limites válidos", () => {
    expect(validarInput({ areaM2: 1, demaos: 1, consumoM2PorLDemao: 1 })).toEqual(
      [],
    );
    expect(
      validarInput({ areaM2: 100000, demaos: 6, consumoM2PorLDemao: 50 }),
    ).toEqual([]);
  });
});
