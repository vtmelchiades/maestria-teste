export const WHATSAPP_NUMERO = "5514998351483";

export function formatarLitros(v: number): string {
  return `${v.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })} L`;
}

export function urlWhatsApp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemOrcamento(params: {
  produto?: string;
  sku?: string;
  litros?: number;
  detalhe?: string;
}): string {
  const partes: string[] = ["Olá, Maestria! Vim pelo site e quero um orçamento."];
  if (params.produto) {
    partes.push(
      `Produto: ${params.produto}${params.sku ? ` (${params.sku})` : ""}.`,
    );
  }
  if (params.litros !== undefined) {
    partes.push(`Quantidade calculada: ${formatarLitros(params.litros)}.`);
  }
  if (params.detalhe) partes.push(params.detalhe);
  return partes.join(" ");
}
